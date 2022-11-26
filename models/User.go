package models

import (
	"fmt"
	"gifty/repository/sqlite"
	"log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// define sqlite model
type User struct {
	ID          int    `db:"id"`
	Name        string `db:"name"`
	UserName    string `db:"user_name"`
	PhoneNumber string `db:"phone_number"`
	Email       string `db:"email"`
	CreatedDate string `db:"created_date"`
}

func GetUsers(c *gin.Context) {
	rows, err := sqlite.DB.Query("select id, name, user_name, phone_number, email, created_date from User")
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	var users []User
	for rows.Next() {
		fmt.Println("here: ")

		var user User
		err = rows.Scan(&user.ID, &user.Name, &user.UserName, &user.PhoneNumber, &user.Email, &user.CreatedDate)
		if err != nil {
			log.Fatal(err)
		}
		fmt.Println("rows: ", user)

		users = append(users, user)
	}

	err = rows.Err()
	if err != nil {
		log.Fatal(err)
	}

	c.JSON(http.StatusOK, gin.H{
		"code":  200,
		"users": users,
	})
}

func GetUser(c *gin.Context) {
	idParam := c.Param("id")

	id, err := strconv.Atoi(idParam)
	if err != nil {
		log.Fatal(err)
	}

	var user User
	row := sqlite.DB.QueryRow("SELECT id, name, user_name, phone_number, email, created_date from User where id=$1;", id)
	err = row.Scan(&user.ID, &user.Name, &user.UserName, &user.PhoneNumber, &user.Email, &user.CreatedDate)

	if err != nil {
		log.Fatal(err)
	}

	c.JSON(http.StatusOK, gin.H{
		"code": 200,
		"user": user,
	})
}

func AddUser(c *gin.Context) {
	var newUser User
	c.BindJSON(&newUser)

	err := sqlite.DB.QueryRow("INSERT into User(name, phone_number, email) values(?, ?, ?) RETURNING id;", newUser.Name, newUser.PhoneNumber, newUser.Email).Scan(&newUser.ID)
	if err != nil {
		log.Fatal(err)
	}

	c.JSON(http.StatusOK, gin.H{
		"code": 200,
		"id":   newUser.ID,
	})
}
