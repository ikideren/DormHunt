package main

import (
	"log"
	"net/http"
	"os"

	_ "github.com/Devounn/DormHunt/docs" // This is required for swag to work
	authmw "github.com/Devounn/DormHunt/internal/delivery/http/middleware"
	v1 "github.com/Devounn/DormHunt/internal/delivery/http/v1"
	"github.com/Devounn/DormHunt/internal/repository"
	"github.com/Devounn/DormHunt/internal/usecase"
	database "github.com/Devounn/DormHunt/pkg"
	"github.com/go-chi/chi/v5"
	chimw "github.com/go-chi/chi/v5/middleware"
	"github.com/joho/godotenv"
	httpSwagger "github.com/swaggo/http-swagger"
)

// @title DormHunt API
// @version 1.0
// @description This is the backend API for the DormHunt platform.
// @termsOfService http://swagger.io/terms/

// @contact.name API Support
// @contact.url http://www.swagger.io/support
// @contact.email support@swagger.io

// @license.name Apache 2.0
// @license.url http://www.apache.org/licenses/LICENSE-2.0.html

// @host localhost:8080
// @BasePath /api/v1
func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, relying on environment variables")
	}

	connString := os.Getenv("DATABASE_URL")
	if connString == "" {
		log.Fatal("DATABASE_URL is not set")
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// 1. Initialize Database
	dbPool, err := database.Connect(connString)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer dbPool.Close()

	// 2. Initialize Repositories
	dormRepo := repository.NewPostgresDormRepository(dbPool)

	// Additional repositories
	reportRepo := repository.NewPostgresReportRepository(dbPool)
	messageRepo := repository.NewPostgresMessageRepository(dbPool)

	// 3. Initialize UseCases
	dormUC := usecase.NewDormUseCase(dormRepo)

	// Additional usecases
	reportUC := usecase.NewReportUseCase(reportRepo)
	messageUC := usecase.NewMessageUseCase(messageRepo)

	// 4. Initialize Handlers
	dormHandler := v1.NewDormHandler(dormUC)
	reportHandler := v1.NewReportHandler(reportUC)
	messageHandler := v1.NewMessageHandler(messageUC)

	// 5. Setup Router
	r := chi.NewRouter()
	r.Use(chimw.Logger)
	r.Use(chimw.Recoverer)

	// Swagger documentation
	r.Get("/swagger/*", httpSwagger.Handler(
		httpSwagger.URL("http://localhost:"+port+"/swagger/doc.json"), //The url pointing to API definition
	))

	// API Routes
	r.Route("/api/v1", func(r chi.Router) {
		r.Mount("/dorms", dormHandler.Routes())

		// Reports and messages require simple auth middleware
		r.With(authmw.AuthMiddleware).Mount("/reports", reportHandler.Routes())
		r.With(authmw.AuthMiddleware).Mount("/messages", messageHandler.Routes())
	})

	log.Printf("Server starting on port %s", port)
	if err := http.ListenAndServe(":"+port, r); err != nil {
		log.Fatalf("Could not start server: %v", err)
	}
}
