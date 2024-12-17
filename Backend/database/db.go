package database

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
)

// DB variable will hold the connection pool
var DB *sql.DB

// InitDB initializes the database connection
func InitDB() {
	var err error
	// Connection string to connect to the PostgreSQL database
	connStr := "postgres://myuser:mypassword@localhost:5432/mydatabase?sslmode=disable"

	DB, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal("Failed to connect to database: ", err)
	}

	// Test the connection to the database
	err = DB.Ping()
	if err != nil {
		log.Fatal("Not connected to database: ", err)
	}

	fmt.Println("Connected to the database successfully")
}
