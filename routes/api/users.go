package api

import (
	"gifty/models"

	"github.com/gin-gonic/gin"
)

func RegisterUserRoutes(r *gin.Engine) {
	// import models here

	user := r.Group("/api/v1")
	{
		user.GET("/users", models.GetUsers)
		user.GET("/user/:id", models.GetUser)
		user.POST("/user", models.AddUser)
		// 	user.GET(":id", user.Get)
		// 	user.POST("", user.Create)
		// 	user.PUT(":id", user.Update)
		// 	user.DELETE(":id", user.Delete)
		// }
	}

	return
}
