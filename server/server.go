package server

import (
	"context"
	"errors"
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
	"github.com/nathan-osman/sitemon/db"
	"github.com/nathan-osman/sitemon/monitor"
	"github.com/nathan-osman/sitemon/ui"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

const sessionName = "sitemon"

func init() {
	// Switch Gin to release mode
	gin.SetMode(gin.ReleaseMode)
}

type Server struct {
	server http.Server
	logger zerolog.Logger
	conn   *db.Conn
	mon    *monitor.Monitor
}

func New(serverAddr, secretKey string, conn *db.Conn, mon *monitor.Monitor) *Server {

	var (
		r = gin.New()
		s = &Server{
			server: http.Server{
				Addr:    serverAddr,
				Handler: r,
			},
			logger: log.With().Str("package", "server").Logger(),
			conn:   conn,
			mon:    mon,
		}
		store = cookie.NewStore([]byte(secretKey))
	)

	// Initialize the cookie store
	store.Options(sessions.Options{
		Path:     "/",
		HttpOnly: true,
	})

	// Serve the static files from /
	r.Use(
		static.Serve(
			"/",
			ui.EmbedFileSystem{
				FileSystem: http.FS(ui.Content),
			},
		),
	)

	groupApi := r.Group("/api")
	{
		// Use the session and our custom user middleware for the API
		groupApi.Use(
			gin.CustomRecoveryWithWriter(nil, panicToJSONError),
			sessions.Sessions(sessionName, store),
			s.loadUser,
		)

		groupApi.POST("/login", s.apiLogin)
		groupApi.GET("/sites", s.apiSites)
		groupApi.GET("/sites/:id", s.apiSitesId)

		// Routes that require authentication
		groupAuthApi := groupApi.Group("")
		{
			groupAuthApi.Use(s.requireUser)
			groupAuthApi.GET("/test", s.apiTest)
			groupAuthApi.POST("/logout", s.apiLogout)

			groupAuthApi.POST("/sites/create", s.apiSitesCreate)
			groupAuthApi.POST("/sites/:id/edit", s.apiSitesIdEdit)
			groupAuthApi.POST("/sites/:id/delete", s.apiSitesIdDelete)
		}
	}

	// Serve the static files on all other paths too
	r.NoRoute(func(c *gin.Context) {
		c.Request.URL.Path = "/"
		r.HandleContext(c)
		c.Abort()
	})

	// Listen for connections in a separate goroutine
	go func() {
		defer s.logger.Info().Msg("server stopped")
		s.logger.Info().Msg("server started")
		if err := s.server.ListenAndServe(); !errors.Is(err, http.ErrServerClosed) {
			s.logger.Error().Msg(err.Error())
		}
	}()

	return s
}

func (s *Server) Close() {
	s.server.Shutdown(context.Background())
}
