package handlers

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"karaoke-backend/internal/models"
)

type PlaylistHandler struct {
	collection *mongo.Collection
}

func NewPlaylistHandler(db *mongo.Database) *PlaylistHandler {
	return &PlaylistHandler{
		collection: db.Collection("playlists"),
	}
}

func (h *PlaylistHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	opts := options.Find().SetSort(bson.D{{"order", 1}, {"createdAt", 1}})
	cursor, err := h.collection.Find(ctx, bson.M{}, opts)
	if err != nil {
		http.Error(w, "Failed to fetch playlists", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(ctx)

	var playlists []models.Playlist
	if err = cursor.All(ctx, &playlists); err != nil {
		http.Error(w, "Failed to decode playlists", http.StatusInternalServerError)
		return
	}

	if playlists == nil {
		playlists = []models.Playlist{}
	}

	response := models.APIResponse{Data: playlists}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func (h *PlaylistHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := primitive.ObjectIDFromHex(vars["id"])
	if err != nil {
		http.Error(w, "Invalid playlist ID", http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var playlist models.Playlist
	err = h.collection.FindOne(ctx, bson.M{"_id": id}).Decode(&playlist)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			http.Error(w, "Playlist not found", http.StatusNotFound)
			return
		}
		http.Error(w, "Failed to fetch playlist", http.StatusInternalServerError)
		return
	}

	response := models.APIResponse{Data: playlist}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func (h *PlaylistHandler) Create(w http.ResponseWriter, r *http.Request) {
	var req models.CreatePlaylistRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if req.Name == "" {
		http.Error(w, "Name is required", http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Get the highest order number
	var lastPlaylist models.Playlist
	opts := options.FindOne().SetSort(bson.D{{"order", -1}})
	h.collection.FindOne(ctx, bson.M{}, opts).Decode(&lastPlaylist)

	now := time.Now()
	playlist := models.Playlist{
		ID:        primitive.NewObjectID(),
		Name:      req.Name,
		Order:     lastPlaylist.Order + 1,
		CreatedAt: now,
		UpdatedAt: now,
	}

	_, err := h.collection.InsertOne(ctx, playlist)
	if err != nil {
		http.Error(w, "Failed to create playlist", http.StatusInternalServerError)
		return
	}

	response := models.APIResponse{Data: playlist}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(response)
}

func (h *PlaylistHandler) Update(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := primitive.ObjectIDFromHex(vars["id"])
	if err != nil {
		http.Error(w, "Invalid playlist ID", http.StatusBadRequest)
		return
	}

	var req models.UpdatePlaylistRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	update := bson.M{"updatedAt": time.Now()}
	if req.Name != nil {
		update["name"] = *req.Name
	}
	if req.Order != nil {
		update["order"] = *req.Order
	}

	result, err := h.collection.UpdateOne(
		ctx,
		bson.M{"_id": id},
		bson.M{"$set": update},
	)
	if err != nil {
		http.Error(w, "Failed to update playlist", http.StatusInternalServerError)
		return
	}

	if result.MatchedCount == 0 {
		http.Error(w, "Playlist not found", http.StatusNotFound)
		return
	}

	// Fetch updated playlist
	var playlist models.Playlist
	err = h.collection.FindOne(ctx, bson.M{"_id": id}).Decode(&playlist)
	if err != nil {
		http.Error(w, "Failed to fetch updated playlist", http.StatusInternalServerError)
		return
	}

	response := models.APIResponse{Data: playlist}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func (h *PlaylistHandler) Delete(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := primitive.ObjectIDFromHex(vars["id"])
	if err != nil {
		http.Error(w, "Invalid playlist ID", http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Also delete all songs in this playlist
	songsCollection := h.collection.Database().Collection("songs")
	_, err = songsCollection.DeleteMany(ctx, bson.M{"playlistId": id})
	if err != nil {
		log.Printf("Warning: Failed to delete songs for playlist %s: %v", id.Hex(), err)
	}

	result, err := h.collection.DeleteOne(ctx, bson.M{"_id": id})
	if err != nil {
		http.Error(w, "Failed to delete playlist", http.StatusInternalServerError)
		return
	}

	if result.DeletedCount == 0 {
		http.Error(w, "Playlist not found", http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
