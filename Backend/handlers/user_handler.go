package handlers

import (
	"encoding/json"
	"net/http"

	"backend/database"
	"backend/models"
)

// CreateUser handles the user creation request
func CreateUser(w http.ResponseWriter, r *http.Request) {
	var user models.User

	// Decode the incoming JSON request body into the user struct
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Insert the user into the database
	sqlStatement := `
		INSERT INTO users (username, email, password_hash)
		VALUES ($1, $2, $3)
		RETURNING id`
	err := database.DB.QueryRow(sqlStatement, user.Username, user.Password).Scan(&user.ID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Return the created user as JSON response
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(user)
}
