package db

import "time"

// Event represents an error that occurs
type Event struct {
	ID        int64     `gorm:"primaryKey" json:"id"`
	Time      time.Time `gorm:"not null" json:"time"`
	Site      Site      `gorm:"ForeignKey:SiteID" json:"-"`
	SiteID    int64     `gorm:"constraint:OnDelete:CASCADE;" json:"site-id"`
	OldStatus Status    `gorm:"not null" json:"old_status"`
	NewStatus Status    `gorm:"not null" json:"new_status"`
}
