package main

import (
	"context"
	"fmt"
	"os"
	"os/signal"
	"syscall"

	"github.com/nathan-osman/sitemon/db"
	"github.com/nathan-osman/sitemon/monitor"
	"github.com/nathan-osman/sitemon/notifier"
	"github.com/nathan-osman/sitemon/server"
	"github.com/urfave/cli/v2"
	"golang.org/x/term"
)

type contextVal string

const contextDB contextVal = "db"

func main() {
	app := &cli.App{
		Name:  "sitemon",
		Usage: "Simple site monitor with web interface",
		Flags: []cli.Flag{
			&cli.StringFlag{
				Name:    "data-dir",
				EnvVars: []string{"DATA_DIR"},
				Usage:   "path to data directory",
			},
			&cli.StringFlag{
				Name:    "device-token",
				EnvVars: []string{"DEVICE_TOKEN"},
				Usage:   "service account key for FCM",
			},
			&cli.StringFlag{
				Name:    "key-file",
				EnvVars: []string{"KEY_FILE"},
				Usage:   "device token for FCM",
			},
			&cli.StringFlag{
				Name:    "secret-key",
				EnvVars: []string{"SECRET_KEY"},
				Usage:   "secret key for cookies",
			},
			&cli.StringFlag{
				Name:    "server-addr",
				Value:   ":8000",
				EnvVars: []string{"SERVER_ADDR"},
				Usage:   "HTTP address to listen on",
			},
		},
		Before: func(c *cli.Context) error {

			// Connect to the database
			conn, err := db.New(c.String("data-dir"))
			if err != nil {
				return err
			}

			// Store the database connection in the context
			c.Context = context.WithValue(c.Context, contextDB, conn)
			return nil
		},
		After: func(c *cli.Context) error {

			// Close the database connection on exit
			conn := c.Context.Value(contextDB)
			if conn != nil {
				conn.(*db.Conn).Close()
			}
			return nil
		},
		Commands: []*cli.Command{
			{
				Name:  "createuser",
				Usage: "create a new user account",
				Action: func(c *cli.Context) error {

					// Grab the db pointer and prepare an empty user
					var (
						conn = c.Context.Value(contextDB).(*db.Conn)
						u    = &db.User{}
					)

					// Prompt for the email
					fmt.Print("Email? ")
					fmt.Scanln(&u.Email)

					// Prompt for the password, hiding the input
					fmt.Print("Password? ")
					p, err := term.ReadPassword(int(syscall.Stdin))
					if err != nil {
						return err
					}
					if err := u.SetPassword(string(p)); err != nil {
						return err
					}

					// Create the user
					if err := conn.Save(u).Error; err != nil {
						return err
					}

					fmt.Println()
					fmt.Println("New user created successfully!")

					return nil
				},
			},
		},
		Action: func(c *cli.Context) error {

			// Grab the database
			conn := c.Context.Value(contextDB).(*db.Conn)

			// Create the notifier
			var (
				deviceToken = c.String("device-token")
				keyFile     = c.String("key-file")
				not         *notifier.Notifier
			)
			if deviceToken != "" && keyFile != "" {
				n, err := notifier.New(keyFile, deviceToken)
				if err != nil {
					return err
				}
				not = n
			}

			// Create the monitor
			mon := monitor.New(conn, not)
			defer mon.Close()

			// Create the server
			s := server.New(
				c.String("server-addr"),
				c.String("secret-key"),
				conn,
				mon,
			)
			defer s.Close()

			// Wait for SIGINT or SIGTERM
			sigChan := make(chan os.Signal, 1)
			signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)
			<-sigChan

			return nil
		},
	}
	if err := app.Run(os.Args); err != nil {
		fmt.Fprintf(os.Stderr, "fatal: %s\n", err.Error())
	}
}
