package routes

import (
	"gifty/routes/api"
	"gifty/routes/middle"

	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

func Setup(mode string) *gin.Engine {
	router := gin.Default()

	// Serve frontend static files
	// router.StaticFS("/static", http.Dir("./static"))
	router.Use(static.Serve("/", static.LocalFile("./static/dist", true)))

	config := cors.DefaultConfig()
	config.AllowAllOrigins = true
	router.Use(cors.New(config))

	setEngineMode(mode)

	router.Use(
		middle.Ginzap(zap.L()),
		middle.RecoveryWithZap(zap.L(), true),
	)

	// register routes here
	// router.GET("/", func(c *gin.Context) {
	// 	c.String(http.StatusOK, http.StatusText(http.StatusOK))
	// })

	api.RegisterUserRoutes(router)

	return router
}

func setEngineMode(mode string) {
	switch mode {
	case "prod", "release":
		gin.SetMode("release")
	case "test":
		gin.SetMode("test")
	case "dev", "debug":
		fallthrough
	default:
		gin.SetMode("debug")
	}
}
