package db

import (
	"time"
)

// Event represents an error that occurs
type Event struct {
	ID        int64      `gorm:"primaryKey" json:"id"`
	Time      *time.Time `json:"time"`
	Site      Site       `gorm:"ForeignKey:SiteID" json:"-"`
	SiteID    int64      `gorm:"constraint:OnDelete:CASCADE;" json:"site-id"`
	OldStatus string     `gorm:"not null" json:"old_status"`
	NewStatus string     `gorm:"not null" json:"new_status"`
}
