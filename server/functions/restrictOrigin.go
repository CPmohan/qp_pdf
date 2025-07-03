package functions

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

func RestrictOrigin(c *gin.Context) {
	disallowedAgents := []string{"PostmanRuntime1", "curl", "Insomnia", "HttpClient"}

	userAgent := c.Request.Header.Get("User-Agent")
	for _, agent := range disallowedAgents {
		if strings.Contains(strings.ToLower(userAgent), strings.ToLower(agent)) {
			c.JSON(http.StatusForbidden, gin.H{
				"message": "Access denied",
			})
			c.Abort()
			return
		}
	}
	c.Next()
}
