package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"time"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"

	"karaoke-backend/internal/config"
	"karaoke-backend/internal/database"
	playlistHandler "karaoke-backend/internal/handlers"
)

func main() {
	// Load .env file if it exists
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system environment variables")
	}

	// Load configuration
	cfg := config.Load()

	// Connect to database
	db, err := database.Connect(cfg.MongoURI, cfg.DatabaseName)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer db.Close()

	// Create handlers
	playlistH := playlistHandler.NewPlaylistHandler(db.DB)
	songH := playlistHandler.NewSongHandler(db.DB)

	// Setup routes
	router := mux.NewRouter()

	// API routes
	api := router.PathPrefix("/api").Subrouter()

	// Playlist routes
	api.HandleFunc("/playlists", playlistH.GetAll).Methods("GET")
	api.HandleFunc("/playlists", playlistH.Create).Methods("POST")
	api.HandleFunc("/playlists/{id}", playlistH.GetByID).Methods("GET")
	api.HandleFunc("/playlists/{id}", playlistH.Update).Methods("PUT")
	api.HandleFunc("/playlists/{id}", playlistH.Delete).Methods("DELETE")

	// Song routes
	api.HandleFunc("/songs", songH.GetAll).Methods("GET")
	api.HandleFunc("/songs", songH.Create).Methods("POST")
	api.HandleFunc("/songs/{id}", songH.GetByID).Methods("GET")
	api.HandleFunc("/songs/{id}", songH.Update).Methods("PUT")
	api.HandleFunc("/songs/{id}/order", songH.UpdateOrder).Methods("PUT")
	api.HandleFunc("/songs/{id}", songH.Delete).Methods("DELETE")

	// CORS middleware
	corsHandler := handlers.CORS(
		handlers.AllowedOriginValidator(func(origin string) bool {
			return true // Allow all origins
		}),
		handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}),
		handlers.AllowedHeaders([]string{"Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"}),
		handlers.AllowCredentials(),
	)(router)

	// Add logging middleware
	loggedRouter := handlers.LoggingHandler(os.Stdout, corsHandler)

	// Create server
	server := &http.Server{
		Addr:         ":" + cfg.Port,
		Handler:      loggedRouter,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	// Start server in a goroutine
	go func() {
		log.Printf("Server starting on port %s", cfg.Port)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatal("Failed to start server:", err)
		}
	}()

	// Wait for interrupt signal to gracefully shutdown the server
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt)
	<-quit
	log.Println("Shutting down server...")

	// Graceful shutdown
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		log.Fatal("Server forced to shutdown:", err)
	}

	log.Println("Server exited")
}
