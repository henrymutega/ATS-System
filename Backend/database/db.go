package database

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/lib/pq"
)

var DB *sql.DB

func InitDB() {
	// Get database connection parameters from environment variables
	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	dbname := os.Getenv("DB_NAME")

	// Log database connection attempt
	log.Printf("Attempting to connect to database at %s:%s", host, port)

	// Construct connection string
	connStr := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbname)

	// Open database connection
	var err error
	DB, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatalf("Error opening database: %v", err)
	}

	// Test the connection
	err = DB.Ping()
	if err != nil {
		log.Fatalf("Error connecting to the database: %v", err)
	}

	log.Println("Connected to the database successfully")

	// Drop the existing users table if it exists
	dropTableSQL := `DROP TABLE IF EXISTS users;`
	_, err = DB.Exec(dropTableSQL)
	if err != nil {
		log.Fatalf("Error dropping users table: %v", err)
	}

	// Create users table with the correct schema
	createTableSQL := `
	CREATE TABLE users (
		id SERIAL PRIMARY KEY,
		firstname VARCHAR(100) NOT NULL,
		lastname VARCHAR(100) NOT NULL,
		email VARCHAR(100) UNIQUE NOT NULL,
		password VARCHAR(100) NOT NULL,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);`

	_, err = DB.Exec(createTableSQL)
	if err != nil {
		log.Fatalf("Error creating users table: %v", err)
	}

	log.Println("Users table created successfully")
}
