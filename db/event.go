package db

import (
	"time"
)

// Event represents an error that occurs
type Event struct {
	ID        int64      `gorm:"primaryKey" json:"id"`
	Time      *time.Time `gorm:"not null" json:"time"`
	SiteID    int64      `gorm:"not null" json:"site_id"`
	Site      Site       `gorm:"constraint:OnDelete:CASCADE;" json:"-"`
	OldStatus string     `gorm:"not null" json:"old_status"`
	NewStatus string     `gorm:"not null" json:"new_status"`
	Details   string     `gorm:"not null" json:"details"`
}
