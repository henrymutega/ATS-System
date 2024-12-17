package database

import (
	"database/sql"
	"fmt"
	"log"
)

var DB *sql.DB

func Connect() {
	connStr := ""
	var err error

	DB, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal("Failed to connect to database: ", err)
	}

	if err := DB.Ping(); err != nil {
		log.Fatal("Database connection failed: ", err)
	}

	fmt.Println("Database connected successfully!")
}
