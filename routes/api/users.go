package api

import (
	"gifty/models"

	"github.com/gin-gonic/gin"
)

// r.GET("/api/v1/users", user.List)
// r.GET("/api/v1/users/:id", user.Get)
// r.POST("/api/v1/users", user.Create)
// r.PUT("/api/v1/users/:id", user.Update)
// r.DELETE("/api/v1/users/:id", user.Delete)

func RegisterUserRoutes(r *gin.Engine) {
	// import models here
	user := r.Group("/api/v1/users")
	{
		user.GET("", models.GetUsers)
		// 	user.GET(":id", user.Get)
		// 	user.POST("", user.Create)
		// 	user.PUT(":id", user.Update)
		// 	user.DELETE(":id", user.Delete)
		// }
	}
	return
}
