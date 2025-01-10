package config

import (
	"fmt"
	"gorm.io/gorm"
	"gorm.io/driver/postgres"
	"github.com/yabindra-bhujel/nepalInno/internal/entity"
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
	db, err = gorm.Open(postgres.Open(databaseUrl), &gorm.Config{})
	if err != nil {
		return fmt.Errorf("Error connecting to the database: %v", err)
	}

	// Check if the connection is successful by performing a ping
	sqlDB, err := db.DB()
	if err != nil {
		return fmt.Errorf("Error getting database instance: %v", err)
	}
	if err = sqlDB.Ping(); err != nil {
		return fmt.Errorf("Error pinging the database: %v", err)
	}

	log.Println("Connection to the database established successfully.")
	log.Println("Migrating the database...")
	if err = db.AutoMigrate(
		&entity.User{},
		&entity.BlogTag{},
		&entity.Blog{},
	); err != nil {
		return fmt.Errorf("Error migrating the database: %v", err)
	}
	log.Println("Database migration completed successfully.")
	return nil
}

func GetDB() *gorm.DB {
	return db
}

func CloseDB() error {
	if db != nil {
		sqlDB, err := db.DB()
		if err != nil {
			return fmt.Errorf("Error getting database instance: %v", err)
		}
		return sqlDB.Close()
	}
	return nil
}
