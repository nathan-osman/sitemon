package notifier

import (
	"context"

	firebase "firebase.google.com/go/v4"
	"firebase.google.com/go/v4/messaging"
	"google.golang.org/api/option"
)

// Notifier provides notifications via FCM.
type Notifier struct {
	client      *messaging.Client
	deviceToken string
}

// New creates a new Notifier instance.
func New(keyFile, deviceToken string) (*Notifier, error) {
	a, err := firebase.NewApp(
		context.Background(),
		nil,
		option.WithCredentialsFile(keyFile),
	)
	if err != nil {
		return nil, err
	}
	c, err := a.Messaging(context.Background())
	if err != nil {
		return nil, err
	}
	return &Notifier{
		client:      c,
		deviceToken: deviceToken,
	}, nil
}

// Send sends the specified message.
func (n *Notifier) Send(title, body string) error {
	_, err := n.client.Send(
		context.Background(),
		&messaging.Message{
			Notification: &messaging.Notification{
				Title: title,
				Body:  body,
			},
			Token: n.deviceToken,
		},
	)
	return err
}
