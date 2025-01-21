package main

import (
	"backend/database"
	"backend/routes"
	"fmt"
	"log"
	"net/http"

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
	r.HandleFunc("/signup", routes.SignUpHandler).Methods("POST", "OPTIONS")
	r.HandleFunc("/login", routes.LoginHandler).Methods("POST", "OPTIONS")

	// Apply CORS middleware
	corsHandler := handlers.CORS(
		handlers.AllowedOrigins([]string{"http://localhost:3000"}), // Allow frontend origin
		handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}),
		handlers.AllowedHeaders([]string{"Content-Type", "Authorization", "X-Requested-With", "Accept"}),
		handlers.AllowCredentials(),
		handlers.ExposedHeaders([]string{"Content-Length"}),
		handlers.MaxAge(86400),
	)(r)

	// Start the HTTP Server
	fmt.Println("Server is running at 8081")
	log.Fatal(http.ListenAndServe(":8081", corsHandler))
}
