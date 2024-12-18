package main

import (
	"backend/database"
	"backend/routes"
	"fmt"
	"log"
	"net/http"

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
	r.HandleFunc("/signup", routes.SignUpHandler).Methods("POST")
	r.HandleFunc("/login", routes.LoginHandler).Methods("POST")

	// Start the HTTP Server
	fmt.Println("Server is running at 8080")
	log.Fatal(http.ListenAndServe(":8080", r))
}
