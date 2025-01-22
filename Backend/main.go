package main

import (
	"backend/database"
	"backend/routes"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables from .env file
	err := godotenv.Load()
	if err != nil {
		log.Println("Error loading .env file, using system environment variables")
	}

	// Initialize db
	database.InitDB()

	// Set up the router and routes
	r := mux.NewRouter()

	// Set up CORS middleware
	corsMiddleware := handlers.CORS(
		handlers.AllowedOrigins([]string{"http://localhost:3000"}),
		handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}),
		handlers.AllowedHeaders([]string{"Content-Type", "Authorization", "X-Requested-With"}),
		handlers.AllowCredentials(),
		handlers.MaxAge(3600),
	)

	// Apply CORS middleware to router
	r.Use(corsMiddleware)

	// Routes
	r.HandleFunc("/signup", routes.SignUpHandler).Methods("POST", "OPTIONS")
	r.HandleFunc("/login", routes.LoginHandler).Methods("POST", "OPTIONS")

	// Create server with timeouts
	srv := &http.Server{
		Handler:      r,
		Addr:         ":8081",
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}

	// Start the server
	fmt.Println("Server is running at http://localhost:8081")
	log.Fatal(srv.ListenAndServe())
}
