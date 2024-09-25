package db

import (
	"time"
)

const (
	StatusUnknown   = "unknown"
	StatusOnline    = "online"
	StatusError     = "error"
	StatusTimeout   = "error_timeout"
	StatusHTTPError = "error_http"
)

// SiteWritable represents the writable fields of a site.
type SiteWritable struct {
	Name             string `gorm:"not null" json:"name"`
	URL              string `gorm:"not null" json:"url"`
	Public           bool   `gorm:"not null" json:"public"`
	Enabled          bool   `gorm:"not null" json:"enabled"`
	Timeout          int    `gorm:"not null" json:"timeout"`
	IgnoreHTTPErrors bool   `gorm:"not null" json:"ignore_http_errors"`
	OnlineInterval   int    `gorm:"not null" json:"online_interval"`
	OfflineInterval  int    `gorm:"not null" json:"offline_interval"`
}

// Site is a URL that needs to be monitored.
type Site struct {
	SiteWritable
	ID        int64      `gorm:"primaryKey" json:"id"`
	LastCheck *time.Time `json:"last_check"`
	Status    string     `gorm:"index;not null" json:"status"`
	Details   string     `gorm:"not null" json:"details"`
}

// Interval returns an interval based on the current status.
func (s *Site) Interval() time.Duration {
	if s.Status == StatusOnline || s.OfflineInterval == 0 {
		return time.Duration(s.OnlineInterval) * time.Second
	}
	return time.Duration(s.OfflineInterval) * time.Second
}
