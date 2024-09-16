package db

// Site is a URL that needs to be monitored.
type Site struct {
	ID       int64  `gorm:"primaryKey" json:"id"`
	Name     string `gorm:"not null" json:"name"`
	URL      string `gorm:"not null" json:"url"`
	Interval int    `gorm:"not null" json:"interval"`
}
