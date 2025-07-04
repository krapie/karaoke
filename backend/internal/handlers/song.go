package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"karaoke-backend/internal/models"
)

type SongHandler struct {
	collection *mongo.Collection
}

func NewSongHandler(db *mongo.Database) *SongHandler {
	return &SongHandler{
		collection: db.Collection("songs"),
	}
}

func (h *SongHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	filter := bson.M{}

	// Filter by playlist if provided
	if playlistID := r.URL.Query().Get("playlistId"); playlistID != "" {
		id, err := primitive.ObjectIDFromHex(playlistID)
		if err != nil {
			http.Error(w, "Invalid playlist ID", http.StatusBadRequest)
			return
		}
		filter["playlistId"] = id
	}

	opts := options.Find().SetSort(bson.D{{"order", 1}, {"createdAt", 1}})
	cursor, err := h.collection.Find(ctx, filter, opts)
	if err != nil {
		http.Error(w, "Failed to fetch songs", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(ctx)

	var songs []models.Song
	if err = cursor.All(ctx, &songs); err != nil {
		http.Error(w, "Failed to decode songs", http.StatusInternalServerError)
		return
	}

	if songs == nil {
		songs = []models.Song{}
	}

	response := models.APIResponse{Data: songs}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func (h *SongHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := primitive.ObjectIDFromHex(vars["id"])
	if err != nil {
		http.Error(w, "Invalid song ID", http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var song models.Song
	err = h.collection.FindOne(ctx, bson.M{"_id": id}).Decode(&song)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			http.Error(w, "Song not found", http.StatusNotFound)
			return
		}
		http.Error(w, "Failed to fetch song", http.StatusInternalServerError)
		return
	}

	response := models.APIResponse{Data: song}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func (h *SongHandler) Create(w http.ResponseWriter, r *http.Request) {
	var req models.CreateSongRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if req.Title == "" || req.Artist == "" || req.PlaylistID == "" {
		http.Error(w, "Title, artist, and playlistId are required", http.StatusBadRequest)
		return
	}

	playlistID, err := primitive.ObjectIDFromHex(req.PlaylistID)
	if err != nil {
		http.Error(w, "Invalid playlist ID", http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Verify playlist exists
	playlistsCollection := h.collection.Database().Collection("playlists")
	err = playlistsCollection.FindOne(ctx, bson.M{"_id": playlistID}).Err()
	if err != nil {
		if err == mongo.ErrNoDocuments {
			http.Error(w, "Playlist not found", http.StatusNotFound)
			return
		}
		http.Error(w, "Failed to verify playlist", http.StatusInternalServerError)
		return
	}

	// Get the highest order number for this playlist
	var lastSong models.Song
	opts := options.FindOne().SetSort(bson.D{{"order", -1}})
	h.collection.FindOne(ctx, bson.M{"playlistId": playlistID}, opts).Decode(&lastSong)

	now := time.Now()
	song := models.Song{
		ID:         primitive.NewObjectID(),
		Title:      req.Title,
		Artist:     req.Artist,
		PlaylistID: playlistID,
		Order:      lastSong.Order + 1,
		Lyrics:     req.Lyrics,
		CreatedAt:  now,
		UpdatedAt:  now,
	}

	_, err = h.collection.InsertOne(ctx, song)
	if err != nil {
		http.Error(w, "Failed to create song", http.StatusInternalServerError)
		return
	}

	response := models.APIResponse{Data: song}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(response)
}

func (h *SongHandler) Update(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := primitive.ObjectIDFromHex(vars["id"])
	if err != nil {
		http.Error(w, "Invalid song ID", http.StatusBadRequest)
		return
	}

	var req models.UpdateSongRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	update := bson.M{"updatedAt": time.Now()}
	if req.Title != nil {
		update["title"] = *req.Title
	}
	if req.Artist != nil {
		update["artist"] = *req.Artist
	}
	if req.Lyrics != nil {
		update["lyrics"] = *req.Lyrics
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
		http.Error(w, "Failed to update song", http.StatusInternalServerError)
		return
	}

	if result.MatchedCount == 0 {
		http.Error(w, "Song not found", http.StatusNotFound)
		return
	}

	// Fetch updated song
	var song models.Song
	err = h.collection.FindOne(ctx, bson.M{"_id": id}).Decode(&song)
	if err != nil {
		http.Error(w, "Failed to fetch updated song", http.StatusInternalServerError)
		return
	}

	response := models.APIResponse{Data: song}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func (h *SongHandler) UpdateOrder(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := primitive.ObjectIDFromHex(vars["id"])
	if err != nil {
		http.Error(w, "Invalid song ID", http.StatusBadRequest)
		return
	}

	var req models.UpdateSongOrderRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	result, err := h.collection.UpdateOne(
		ctx,
		bson.M{"_id": id},
		bson.M{"$set": bson.M{"order": req.Order, "updatedAt": time.Now()}},
	)
	if err != nil {
		http.Error(w, "Failed to update song order", http.StatusInternalServerError)
		return
	}

	if result.MatchedCount == 0 {
		http.Error(w, "Song not found", http.StatusNotFound)
		return
	}

	// Fetch updated song
	var song models.Song
	err = h.collection.FindOne(ctx, bson.M{"_id": id}).Decode(&song)
	if err != nil {
		http.Error(w, "Failed to fetch updated song", http.StatusInternalServerError)
		return
	}

	response := models.APIResponse{Data: song}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func (h *SongHandler) Delete(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := primitive.ObjectIDFromHex(vars["id"])
	if err != nil {
		http.Error(w, "Invalid song ID", http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	result, err := h.collection.DeleteOne(ctx, bson.M{"_id": id})
	if err != nil {
		http.Error(w, "Failed to delete song", http.StatusInternalServerError)
		return
	}

	if result.DeletedCount == 0 {
		http.Error(w, "Song not found", http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
