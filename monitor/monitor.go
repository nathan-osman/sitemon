package monitor

import (
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
		select {
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
