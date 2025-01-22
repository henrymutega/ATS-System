package routes

import (
	"backend/database"
	"backend/models"
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/dgrijalva/jwt-go"
	"golang.org/x/crypto/bcrypt"
)

// SignUpHandler handles user signup requests
func SignUpHandler(w http.ResponseWriter, r *http.Request) {
	log.Printf("Received signup request from: %s", r.RemoteAddr)

	// Set CORS headers
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
	w.Header().Set("Access-Control-Allow-Credentials", "true")

	// Handle preflight request
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	// Read request body
	var user models.User
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		log.Printf("Error decoding request body: %v", err)
		http.Error(w, "Invalid request format", http.StatusBadRequest)
		return
	}

	log.Printf("Received signup request for email: %s", user.Email)

	// Validate user input
	if user.Email == "" || user.Password == "" {
		log.Printf("Invalid signup attempt: missing required fields")
		http.Error(w, "Email and password are required", http.StatusBadRequest)
		return
	}

	// Check if user already exists
	var exists bool
	err = database.DB.QueryRow("SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)", user.Email).Scan(&exists)
	if err != nil && err != sql.ErrNoRows {
		log.Printf("Error checking existing user: %v", err)
		http.Error(w, "Error checking user existence", http.StatusInternalServerError)
		return
	}

	if exists {
		log.Printf("User already exists with email: %s", user.Email)
		http.Error(w, "User already exists", http.StatusConflict)
		return
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		log.Printf("Error hashing password: %v", err)
		http.Error(w, "Error processing password", http.StatusInternalServerError)
		return
	}

	// Insert user into database
	_, err = database.DB.Exec(
		"INSERT INTO users (firstname, lastname, email, password) VALUES ($1, $2, $3, $4)",
		user.FirstName, user.LastName, user.Email, string(hashedPassword))
	if err != nil {
		log.Printf("Error saving user to database: %v", err)
		http.Error(w, "Error creating user", http.StatusInternalServerError)
		return
	}

	// Generate JWT token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"email": user.Email,
		"exp":   time.Now().Add(time.Hour * 24).Unix(),
	})

	tokenString, err := token.SignedString([]byte("your-secret-key"))
	if err != nil {
		log.Printf("Error generating token: %v", err)
		http.Error(w, "Error generating token", http.StatusInternalServerError)
		return
	}

	// Set response headers
	w.Header().Set("Content-Type", "application/json")

	// Send success response
	response := map[string]interface{}{
		"status":  "success",
		"message": "User created successfully",
		"token":   tokenString,
	}

	// Encode and send response
	if err := json.NewEncoder(w).Encode(response); err != nil {
		log.Printf("Error encoding response: %v", err)
		http.Error(w, "Error encoding response", http.StatusInternalServerError)
		return
	}

	log.Printf("User successfully created with email: %s", user.Email)
}

// LoginHandler handles user login requests
func LoginHandler(w http.ResponseWriter, r *http.Request) {
	// Set CORS headers
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
	w.Header().Set("Access-Control-Allow-Credentials", "true")

	// Handle preflight request
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	var user models.User
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&user)
	if err != nil {
		log.Printf("Error decoding request body: %v", err)
		http.Error(w, "Invalid request format", http.StatusBadRequest)
		return
	}

	log.Printf("Login attempt for email: %s", user.Email)

	// Verify user in the database
	var storedPassword string
	err = database.DB.QueryRow("SELECT password FROM users WHERE email = $1", user.Email).Scan(&storedPassword)
	if err != nil {
		if err == sql.ErrNoRows {
			log.Printf("No user found with email: %s", user.Email)
			http.Error(w, "Invalid credentials", http.StatusUnauthorized)
			return
		}
		log.Printf("Database error while fetching user: %v", err)
		http.Error(w, "Server error", http.StatusInternalServerError)
		return
	}

	// Compare password with the hashed password
	err = bcrypt.CompareHashAndPassword([]byte(storedPassword), []byte(user.Password))
	if err != nil {
		log.Printf("Password mismatch for user %s", user.Email)
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	// Generate JWT token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"email": user.Email,
		"exp":   time.Now().Add(time.Hour * 24).Unix(), // Token valid for 24 hours
	})

	tokenString, err := token.SignedString([]byte("your-secret-key"))
	if err != nil {
		log.Printf("Error generating token: %v", err)
		http.Error(w, "Error generating token", http.StatusInternalServerError)
		return
	}

	// Send response
	w.Header().Set("Content-Type", "application/json")
	response := map[string]interface{}{
		"status":  "success",
		"message": "Login successful",
		"token":   tokenString,
	}

	if err := json.NewEncoder(w).Encode(response); err != nil {
		log.Printf("Error encoding response: %v", err)
		http.Error(w, "Error encoding response", http.StatusInternalServerError)
		return
	}

	log.Printf("Login successful for user: %s", user.Email)
}
