package main

import (
	"log"
	"os"
	"qb_pdf/config"
	"qb_pdf/functions"
	question "qb_pdf/routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading` .env file")
	}

	//get app port from .env file
	appPort := os.Getenv("APP_PORT")
	apiBaseApp := os.Getenv("API_BASE_PATH")

	config.InitDB()
	defer config.Database.Close()

	//set up in release mode
	gin.SetMode(gin.ReleaseMode)
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{"http://localhost:3000"},
		AllowMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders: []string{"Origin", "Content-Type", "Authorization"},
	}))

	r.Use(functions.RestrictOrigin)
	//
	r.GET(apiBaseApp+"/getQuestion/:academic_year/:sem/*courseId", question.GetQuestions)
	r.GET(apiBaseApp+"/getcourses", question.GetAllCourses)
	//
	r.NoRoute(func(c *gin.Context) {
		functions.Response(c, 404, "API Not Found", nil)
	})
	r.Run(":" + appPort)
}
