package main

import (
	"backend/database"
	"backend/routes"
	"fmt"
	"log"
	"net/http"
)

func main() {
	// Initialize db
	database.InitDB()

	// Set routes
	routes.SetupRoutes()

	// Start the HTTP Server
	fmt.Println("Server is running at 8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
