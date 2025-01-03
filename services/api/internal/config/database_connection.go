package config

import (
	"fmt"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres" // PostgreSQL dialect
	"log"
	"os"
)

var db *gorm.DB

func InitDB() error {
	var err error
	databaseUrl := os.Getenv("DATABASE_URL")

	// If DATABASE_URL is not set, return an error
	if databaseUrl == "" {
		return fmt.Errorf("No DATABASE_URL environment variable found")
	}

	// Open the database connection
	db, err = gorm.Open("postgres", databaseUrl)
	if err != nil {
		return fmt.Errorf("Error connecting to the database: %v", err)
	}

	// Check if the connection is successful by performing a ping
	if err = db.DB().Ping(); err != nil {
		return fmt.Errorf("Error pinging the database: %v", err)
	}

	log.Println("Connection to the database established successfully.")
	return nil
}

func GetDB() *gorm.DB {
	return db
}

func CloseDB() error {
	if db != nil {
		return db.Close()
	}
	return nil
}
