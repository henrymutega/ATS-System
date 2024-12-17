package routes

import (
	"net/http"

	"backend/handlers"
)

// SetupRoutes maps the HTTP routes to the respective handlers
func SetupRoutes() {
	http.HandleFunc("/create-user", handlers.CreateUser)
}
