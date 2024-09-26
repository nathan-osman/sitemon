package monitor

import (
	"time"

	"github.com/nathan-osman/sitemon/db"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

// Monitor manages a goroutine for checking sites.
type Monitor struct {
	logger     zerolog.Logger
	updateChan chan any
	closedChan chan any
	conn       *db.Conn
}

func (m *Monitor) run() {
	defer close(m.closedChan)
	for {
		var (
			sites []*db.Site
			next  time.Time
			now   = time.Now()
		)
		if err := m.conn.Where("enabled = ?", true).Find(&sites).Error; err != nil {
			m.logger.Error().Msg(err.Error())
			return
		}
		for _, s := range sites {
			var n time.Time
			if s.LastCheck != nil {
				n = s.LastCheck.Add(s.Interval())
			}
			if n.Before(now) {
				m.check(s.ID, now)
				n = n.Add(s.Interval())
			}
			if next.IsZero() || n.Before(next) {
				next = n
			}
		}
		var (
			nextChan <-chan time.Time
		)
		if !next.IsZero() {
			nextChan = time.After(next.Sub(now))
		}
		select {
		case <-nextChan:
		case _, ok := <-m.updateChan:
			if !ok {
				return
			}
		}
	}
}

// New creates and initializes a new Monitor instance.
func New(conn *db.Conn) *Monitor {
	m := &Monitor{
		logger:     log.With().Str("package", "monitor").Logger(),
		updateChan: make(chan any),
		closedChan: make(chan any),
		conn:       conn,
	}
	go m.run()
	return m
}

// Update indicates to the monitor that the database has changed and it should
// reload the data.
func (m *Monitor) Update() {
	m.updateChan <- nil
}

// Close shuts down the monitor.
func (m *Monitor) Close() {
	close(m.updateChan)
	<-m.closedChan
}
