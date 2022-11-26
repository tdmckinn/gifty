package sqlite

import (
	"database/sql"
	"gifty/settings"
	"log"

	_ "github.com/mattn/go-sqlite3"
)

var DB *sql.DB

var sqlStmt = `
CREATE TABLE IF NOT EXISTS "User" (
	"id"	INTEGER NOT NULL UNIQUE,
	"name"	TEXT,
	"user_name"	TEXT UNIQUE,
	"phone_number"	INTEGER UNIQUE,
	"email"	TEXT UNIQUE,
	"created_date" INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT)
);

CREATE TABLE IF NOT EXISTS "Location" (
	"id"	INTEGER NOT NULL UNIQUE,
	"userId"	INTEGER NOT NULL UNIQUE,
	"street)address"	TEXT,
	"postal_code"	INTEGER UNIQUE,
	"state"	TEXT UNIQUE,
	"country_id"	TEXT UNIQUE,
	"location_id"	INTEGER NOT NULL UNIQUE,
	"created_date" INTEGER,
	FOREIGN KEY("userId") REFERENCES "User"("id")
	PRIMARY KEY("id" AUTOINCREMENT)
);

CREATE TABLE IF NOT EXISTS "Friendship" (
		"friendship_id" INTEGER NOT NULL UNIQUE,
		"user_id" INTEGER NOT NULL,
		"friend_id" INTEGER NOT NULL,
		"created_date" INTEGER,
		PRIMARY KEY("friendship_id" AUTOINCREMENT),
		FOREIGN KEY("user_id") REFERENCES "User"("id"),
		FOREIGN KEY("friend_id") REFERENCES "User"("id")
	)		
`

func Init(cfg *settings.SQLite) (err error) {
	// os.Remove("./gifty.db")

	db, err := sql.Open("sqlite3", "./gifty.db")
	if err != nil {
		log.Fatal(err)
	}

	// store global reference to db
	DB = db

	// defer db.Close()

	_, err = db.Exec(sqlStmt)
	if err != nil {
		log.Printf("%q: %s\n", err, sqlStmt)
		return
	}

	return err
}
