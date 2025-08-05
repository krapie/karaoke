package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Playlist struct {
	ID        primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Name      string             `json:"name" bson:"name" validate:"required,min=1,max=100"`
	Order     int                `json:"order" bson:"order"`
	CreatedAt time.Time          `json:"createdAt" bson:"createdAt"`
	UpdatedAt time.Time          `json:"updatedAt" bson:"updatedAt"`
}

type Song struct {
	ID         primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Title      string             `json:"title" bson:"title" validate:"required,min=1,max=200"`
	Artist     string             `json:"artist" bson:"artist" validate:"required,min=1,max=100"`
	PlaylistID primitive.ObjectID `json:"playlistId" bson:"playlistId" validate:"required"`
	Order      int                `json:"order" bson:"order"`
	TJNumber   *int               `json:"tjNumber,omitempty" bson:"tjNumber,omitempty"`
	Lyrics     string             `json:"lyrics,omitempty" bson:"lyrics,omitempty"`
	CreatedAt  time.Time          `json:"createdAt" bson:"createdAt"`
	UpdatedAt  time.Time          `json:"updatedAt" bson:"updatedAt"`
}

type CreatePlaylistRequest struct {
	Name string `json:"name" validate:"required,min=1,max=100"`
}

type UpdatePlaylistRequest struct {
	Name  *string `json:"name,omitempty" validate:"omitempty,min=1,max=100"`
	Order *int    `json:"order,omitempty"`
}

type CreateSongRequest struct {
	Title      string `json:"title" validate:"required,min=1,max=200"`
	Artist     string `json:"artist" validate:"required,min=1,max=100"`
	PlaylistID string `json:"playlistId" validate:"required"`
	TJNumber   *int   `json:"tjNumber,omitempty"`
	Lyrics     string `json:"lyrics,omitempty"`
}

type UpdateSongRequest struct {
	Title    *string `json:"title,omitempty" validate:"omitempty,min=1,max=200"`
	Artist   *string `json:"artist,omitempty" validate:"omitempty,min=1,max=100"`
	TJNumber *int    `json:"tjNumber,omitempty"`
	Lyrics   *string `json:"lyrics,omitempty"`
	Order    *int    `json:"order,omitempty"`
}

type UpdateSongOrderRequest struct {
	Order int `json:"order" validate:"required,min=0"`
}

type APIResponse struct {
	Data    interface{} `json:"data,omitempty"`
	Message string      `json:"message,omitempty"`
	Error   string      `json:"error,omitempty"`
}

type ErrorResponse struct {
	Error   string `json:"error"`
	Message string `json:"message,omitempty"`
}
