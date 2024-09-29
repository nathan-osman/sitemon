package monitor

import (
	"context"
	"net/http"
	"time"

	"github.com/nathan-osman/sitemon/db"
)

type requestStatus struct {
	Status  string
	Details string
}

func doRequest(s *db.Site) requestStatus {

	// Create the context for the request
	ctx := context.Background()
	if s.Timeout != 0 {
		newCtx, cancel := context.WithTimeout(
			ctx,
			time.Duration(s.Timeout)*time.Second,
		)
		defer cancel()
		ctx = newCtx
	}

	// Create the request
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, s.URL, nil)
	if err != nil {
		return requestStatus{
			Status:  db.StatusError,
			Details: err.Error(),
		}
	}

	// Set the User Agent
	req.Header.Set("User-Agent", "sitemon")

	// Issue the request
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return requestStatus{
			Status:  db.StatusError,
			Details: err.Error(),
		}
	}
	defer resp.Body.Close()

	// Fail on HTTP errors (unless set to ignore)
	if resp.StatusCode >= 400 && !s.IgnoreHTTPErrors {
		return requestStatus{
			Status:  db.StatusError,
			Details: resp.Status,
		}
	}

	return requestStatus{
		Status: db.StatusOnline,
	}
}

func (m *Monitor) check(id int64, now time.Time) {
	if err := m.conn.Transaction(func(c *db.Conn) error {

		s := db.Site{}

		// Lock the row for updating
		if err := c.LockForUpdate(&s, id); err != nil {
			return err
		}

		// Grab the current status
		oldStatus := s.Status

		// Perform the request and update the database
		r := doRequest(&s)
		s.Status = r.Status
		s.Details = r.Details
		s.LastCheck = &now
		if err := c.Save(&s).Error; err != nil {
			return err
		}

		// If the status changed, create an event
		if s.Status != oldStatus {
			if err := c.Save(
				&db.Event{
					Time:      &now,
					SiteID:    s.ID,
					OldStatus: oldStatus,
					NewStatus: s.Status,
				},
			).Error; err != nil {
				return err
			}
		}

		return nil

	}); err != nil {
		panic(err)
	}
}
