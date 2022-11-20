package models

import (
	"fmt"

	"github.com/gin-gonic/gin"
)

// define sqlite model
type User struct {
	ID   int    `db:"id"`
	Name string `db:"name"`
}

func GetUsers(c *gin.Context) {

	fmt.Println("GetUsers")
}
