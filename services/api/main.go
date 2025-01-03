package main

import (
	"context"
	"github.com/labstack/echo/v4"
	echoSwagger "github.com/swaggo/echo-swagger"
	_ "github.com/yabindra-bhujel/nepalInno/docs"
	"github.com/yabindra-bhujel/nepalInno/internal/router"
	"github.com/yabindra-bhujel/nepalInno/internal/config"
	"log"
	"os"
	"os/signal"
	"syscall"
)

// @title Budd API Documentation
// @version 1.0
// @description this is the documentation for the Budd API service. Budd is a Nepal-based tech blogging platform.
// @host localhost:8080
// @BasePath /api/v1
func main() {
	e := echo.New()

	// inital database connection
	if err := config.InitDB(); err != nil {
		log.Fatalf("Error initializing database: %v", err)
	}

	// Swagger route
	e.GET("/swagger/*", echoSwagger.WrapHandler)

	// API group
	api := e.Group("/api/v1")
	router.RegisterAllRoutes(api)

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt, syscall.SIGTERM)

	// Start the server in a goroutine to allow graceful shutdown
	go func() {
		log.Println("Starting the server on http://localhost:8000")
		log.Println("For API documentation, visit http://localhost:8000/swagger/index.html")
		if err := e.Start(":8000"); err != nil {
			log.Fatalf("Server failed to start: %v", err)
		}
	}()

	// Wait for the interrupt signal
	<-quit
	log.Println("Shutting down the server...")

	// Perform a graceful shutdown
	if err := e.Shutdown(context.Background()); err != nil {
		log.Fatalf("Server forced to shutdown: %v", err)
	}

	// Close the database connection
	if err := config.CloseDB(); err != nil {
		log.Printf("Error closing the database: %v", err)
	}

	log.Println("Server shut down successfully.")
}
