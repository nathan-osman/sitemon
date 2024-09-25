package server

import (
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/nathan-osman/sitemon/db"
)

type apiLoginParams struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func (s *Server) apiLogin(c *gin.Context) {
	v := apiLoginParams{}
	if err := c.ShouldBindJSON(&v); err != nil {
		panic(err)
	}
	u := db.User{}
	if err := s.conn.
		Where("email = ?", v.Email).
		First(&u).Error; err != nil {
		panic(err)
	}
	if err := u.Authenticate(v.Password); err != nil {
		panic(err)
	}
	session := sessions.Default(c)
	session.Set(sessionKeyUserID, u.ID)
	if err := session.Save(); err != nil {
		panic(err)
	}
	c.Status(http.StatusNoContent)
}

func (s *Server) apiSites(c *gin.Context) {
	var (
		sites = []*db.Site{}
		conn  = s.conn.DB
	)
	if !s.userIsLoggedIn(c) {
		conn = conn.Where("public = ?", true)
	}
	if err := conn.Find(&sites).Error; err != nil {
		panic(err)
	}
	c.JSON(http.StatusOK, sites)
}

func (s *Server) apiSitesId(c *gin.Context) {
	var (
		site = db.Site{}
		conn = s.conn.DB
	)
	if !s.userIsLoggedIn(c) {
		conn = conn.Where("public = ?", true)
	}
	if err := conn.First(&site, c.Param("id")).Error; err != nil {
		panic(err)
	}
	c.JSON(http.StatusOK, &site)
}

func (s *Server) apiTest(c *gin.Context) {
	c.Status(http.StatusNoContent)
}

func (s *Server) apiLogout(c *gin.Context) {
	session := sessions.Default(c)
	session.Delete(sessionKeyUserID)
	if err := session.Save(); err != nil {
		panic(err)
	}
	c.Status(http.StatusNoContent)
}

func (s *Server) apiSitesCreate(c *gin.Context) {
	siteWritable := db.SiteWritable{}
	if err := c.ShouldBindJSON(&siteWritable); err != nil {
		panic(err)
	}
	site := db.Site{
		SiteWritable: siteWritable,
		Status:       db.StatusUnknown,
	}
	if err := s.conn.Create(&site).Error; err != nil {
		panic(err)
	}
	c.JSON(http.StatusOK, &site)
}

func (s *Server) apiSitesIdEdit(c *gin.Context) {
	siteWritable := db.SiteWritable{}
	if err := c.ShouldBindJSON(&siteWritable); err != nil {
		panic(err)
	}
	if err := s.conn.
		Model(&db.Site{}).
		Where("id = ?", c.Param("id")).
		Updates(&siteWritable).Error; err != nil {
		panic(err)
	}
	c.JSON(http.StatusOK, &siteWritable)
}

func (s *Server) apiSitesIdDelete(c *gin.Context) {
	if err := s.conn.
		Delete(&db.Site{}, c.Param("id")).Error; err != nil {
		panic(err)
	}
	c.Status(http.StatusNoContent)
}
