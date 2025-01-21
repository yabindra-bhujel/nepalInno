package main

import (
	"context"
	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	echoSwagger "github.com/swaggo/echo-swagger"
	_ "github.com/yabindra-bhujel/nepalInno/docs"
	"github.com/yabindra-bhujel/nepalInno/internal/config"
	"github.com/yabindra-bhujel/nepalInno/internal/router"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
)

const PORT = "8000"

type CustomValidator struct {
	validator *validator.Validate
}

// Validate performs validation
func (cv *CustomValidator) Validate(i interface{}) error {
	return cv.validator.Struct(i)
}

// @title Budd API Documentation
// @version 1.0
// @description this is the documentation for the Budd API service. Budd is a Nepal-based tech blogging platform.
// @host localhost:8000
// @BasePath /api/v1
func main() {
	e := echo.New()

	// Register the custom validator
	e.Validator = &CustomValidator{validator: validator.New()}

	// Middleware
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:5173"},
		AllowMethods: []string{
			http.MethodGet, http.MethodPost, http.MethodPut,
			http.MethodDelete, http.MethodOptions,
		},
		AllowHeaders: []string{
			echo.HeaderOrigin, echo.HeaderContentType,
			echo.HeaderAccept, echo.HeaderAuthorization,
		},
		AllowCredentials: true,
	}))

	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

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
		port := ":8000"
		if err := e.Start(port); err != nil {
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
