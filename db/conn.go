package db

import (
	"path"

	"github.com/glebarez/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

// Conn maintains a connection to the database.
type Conn struct {
	*gorm.DB
}

// New attempts to connect to or create the database.
func New(dataDir string) (*Conn, error) {
	d, err := gorm.Open(
		sqlite.Open(path.Join(dataDir, "db.sqlite3")),
		&gorm.Config{},
	)
	if err != nil {
		return nil, err
	}
	if err := d.AutoMigrate(
		&User{},
		&Site{},
		&Event{},
	); err != nil {
		return nil, err
	}
	return &Conn{
		d,
	}, nil
}

// Transaction starts a new transaction.
func (c *Conn) Transaction(fn func(*Conn) error) error {
	return c.DB.Transaction(func(tx *gorm.DB) error {
		return fn(&Conn{DB: tx})
	})
}

// LockForUpdate locks the specified row.
func (c *Conn) LockForUpdate(dest any, conds ...any) error {
	return c.Clauses(
		clause.Locking{
			Strength: "UPDATE",
		},
	).First(dest, conds).Error
}

// Close closes the database connection.
func (c *Conn) Close() {
	db, _ := c.DB.DB()
	db.Close()
}
