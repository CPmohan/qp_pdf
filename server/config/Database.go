package config

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
)

var Database *sql.DB

func InitDB() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system environment variables")
	}

	dbWriteUser := os.Getenv("DB_USER")
	dbWritePass := os.Getenv("DB_PASSWORD")
	dbWriteHost := os.Getenv("DB_HOST")

	dbName := os.Getenv("DB_NAME")

	if dbWriteUser == "" || dbWriteHost == "" || dbName == "" {
		log.Fatal("Database environment variables are not set for write DB")
	}

	// DSN with tls=custom for write connection
	writeDSN := fmt.Sprintf("%s:%s@tcp(%s)/%s", dbWriteUser, dbWritePass, dbWriteHost, dbName)
	db, err := sql.Open("mysql", writeDSN)
	if err != nil {
		log.Fatal("Error connecting to Writing DB:", err)
	}
	// configureDB(db)
	Database = db

	fmt.Println("DB Connected")
}

// func configureDB(db *sql.DB) {
// 	db.SetMaxOpenConns(1000)
// 	db.SetMaxIdleConns(500)
// 	db.SetConnMaxLifetime(5 * time.Minute)
// 	db.SetConnMaxIdleTime(2 * time.Minute)

// 	if err := db.Ping(); err != nil {
// 		log.Fatal("Error pinging DB:", err)
// 	}
// }
