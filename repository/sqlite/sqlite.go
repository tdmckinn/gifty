package sqlite

import (
	"database/sql"
	"fmt"
	"gifty/settings"
	"log"
	"os"

	_ "github.com/mattn/go-sqlite3"
)

var DB *sql.DB

func Init(cfg *settings.SQLite) (err error) {
	os.Remove("./gifty.db")

	db, err := sql.Open("sqlite3", "./gifty.db")
	if err != nil {
		log.Fatal(err)
	}

	// store global reference to db
	DB = db

	defer db.Close()

	sqlStmt := `
	create table foo (id integer not null primary key, name text);
	delete from foo;
	`
	_, err = db.Exec(sqlStmt)
	if err != nil {
		log.Printf("%q: %s\n", err, sqlStmt)
		return
	}

	tx, err := db.Begin()
	if err != nil {
		log.Fatal(err)
	}
	stmt, err := tx.Prepare("insert into foo(id, name) values(?, ?)")
	if err != nil {
		log.Fatal(err)
	}
	defer stmt.Close()
	for i := 0; i < 100; i++ {
		_, err = stmt.Exec(i, fmt.Sprintf("こんにちは世界%03d", i))
		if err != nil {
			log.Fatal(err)
		}
	}
	err = tx.Commit()
	if err != nil {
		log.Fatal(err)
	}

	rows, err := db.Query("select id, name from foo")
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()
	for rows.Next() {
		var id int
		var name string
		err = rows.Scan(&id, &name)
		if err != nil {
			log.Fatal(err)
		}
		fmt.Println(id, name)
	}
	err = rows.Err()
	if err != nil {
		log.Fatal(err)
	}

	stmt, err = db.Prepare("select name from foo where id = ?")
	if err != nil {
		log.Fatal(err)
	}
	defer stmt.Close()
	var name string
	err = stmt.QueryRow("3").Scan(&name)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(name)

	_, err = db.Exec("delete from foo")
	if err != nil {
		log.Fatal(err)
	}

	_, err = db.Exec("insert into foo(id, name) values(1, 'foo'), (2, 'bar'), (3, 'baz')")
	if err != nil {
		log.Fatal(err)
	}

	rows, err = db.Query("select id, name from foo")
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()
	for rows.Next() {
		var id int
		var name string
		err = rows.Scan(&id, &name)
		if err != nil {
			log.Fatal(err)
		}
		fmt.Println(id, name)
	}
	err = rows.Err()
	if err != nil {
		log.Fatal(err)
	}

	return err
}

// import (
// 	"fmt"
// 	_ "github.com/go-sql-driver/mysql"
// 	"github.com/jmoiron/sqlx"
// 	"gifty/settings"
// 	"go.uber.org/zap"
// )

// var db *sqlx.DB

// func Init(cfg *settings.MySQLConfig) (err error) {
// 	dsn := fmt.Sprintf("%s:%s@tcp(%s:%d)/%s?%s",
// 		cfg.User,
// 		cfg.Password,
// 		cfg.Host,
// 		cfg.Port,
// 		cfg.Schema,
// 		cfg.Params,
// 	)
// 	db, err = sqlx.Connect("mysql", dsn)
// 	if err != nil {
// 		return
// 	}

// 	db.SetMaxOpenConns(cfg.MaxConn)
// 	db.SetMaxIdleConns(cfg.MaxIdle)

// 	return
// }
