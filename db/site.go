package db

import (
	"time"
)

type Status int

const (
	StatusUnknown Status = iota
	StatusOnline
	StatusError
	StatusTimeout
	StatusHTTPError
)

func (s Status) String() string {
	switch s {
	case StatusOnline:
		return "online"
	case StatusError:
		return "error"
	case StatusTimeout:
		return "error (timeout)"
	case StatusHTTPError:
		return "error (HTTP)"
	default:
		return "unknown"
	}
}

// Site is a URL that needs to be monitored.
type Site struct {
	ID               int64     `gorm:"primaryKey" json:"id"`
	Name             string    `gorm:"not null" json:"name"`
	URL              string    `gorm:"not null" json:"url"`
	Public           bool      `gorm:"not null" json:"public"`
	Enabled          bool      `gorm:"not null" json:"enabled"`
	Timeout          int       `gorm:"not null" json:"timeout"`
	IgnoreHTTPErrors bool      `gorm:"not null" json:"ignore_http_errors"`
	OnlineInterval   int       `gorm:"not null" json:"online_interval"`
	OfflineInterval  int       `gorm:"not null" json:"offline_interval"`
	LastCheck        time.Time `gorm:"not null" json:"last_check"`
	Status           Status    `gorm:"not null" json:"status"`
	Details          string    `gorm:"not null" json:"details"`
}

// Interval returns an interval based on the current status.
func (s *Site) Interval() time.Duration {
	if s.Status == StatusOnline || s.OfflineInterval == 0 {
		return time.Duration(s.OnlineInterval)
	}
	return time.Duration(s.OfflineInterval)
}
