package functions

import (
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

var jwtSecret []byte

func init() {
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		log.Fatalf("JWT_SECRET is not set in the .env file")
	}
	jwtSecret = []byte(secret)
}

func Middleware(c *gin.Context) {
	appToken := c.GetHeader("Authorization")

	if appToken == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized: token information is missing"})
		c.Abort()
		return
	}

	parts := strings.Split(appToken, " ")
	if len(parts) != 2 || parts[0] != "Bearer" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header format must be Bearer {token}"})
		c.Abort()
		return
	}

	tokenString := parts[1]
	token, claims, err := parseToken(tokenString)
	if err != nil || !token.Valid {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		c.Abort()
		return
	}

	username, ok := claims["username"].(string)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims: username not found"})
		c.Abort()
		return
	}

	c.Set("userId", username)

	// Proceed to the next handler
	c.Next()

}

func parseToken(tokenString string) (*jwt.Token, jwt.MapClaims, error) {
	claims := jwt.MapClaims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtSecret, nil
	})
	return token, claims, err
}
