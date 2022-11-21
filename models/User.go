package models

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

// define sqlite model
type User struct {
	ID   int    `db:"id"`
	Name string `db:"name"`
}

func GetUsers(c *gin.Context) {

	fmt.Println("GetUsers")

	c.JSON(http.StatusOK, gin.H{
		"code": 200,
		"msg":  "Hello World",
	})
}
