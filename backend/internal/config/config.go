package config

import (
	"os"
)

type Config struct {
	Port         string
	MongoURI     string
	DatabaseName string
}

func Load() *Config {
	return &Config{
		Port:         getEnv("PORT", "8080"),
		MongoURI:     getEnv("MONGO_URI", "mongodb://localhost:27017"),
		DatabaseName: getEnv("DATABASE_NAME", "karaoke"),
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
