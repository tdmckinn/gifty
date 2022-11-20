package main

import (
	"context"
	"fmt"
	"gifty/logger"
	"gifty/repository/sqlite"
	"gifty/routes"
	"gifty/settings"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/spf13/viper"
	"go.uber.org/zap"
)

// Go web development scaffold for general purpose

func main() {
	// 1. Load config
	if err := settings.Init(); err != nil {
		fmt.Printf("Init settings failed, err: %v\n", err)
		return
	}

	// 2. Initialize logger
	if err := logger.Init(settings.Conf.LoggerConfig); err != nil {
		fmt.Printf("Init logger failed, err: %v\n", err)
		return
	}
	defer logger.Sync()
	zap.L().Debug("Logger init succeeded.")

	// 3. Initialize SQLite connection
	if err := sqlite.Init(settings.Conf.SQLite); err != nil {
		zap.L().Error("Connect DB failed", zap.Error(err))
		return
	}
	zap.L().Debug("MySQL init succeeded.")

	// 4. Initialize Redis connection
	// if err := redis.Init(settings.Conf.RedisConfig); err != nil {
	// 	zap.L().Error("Connect redis failed", zap.Error(err))
	// 	return
	// }
	// defer redis.Close()
	// zap.L().Debug("Redis init succeeded.")

	// 5. Register routes
	router := routes.Setup(settings.Conf.Mode)

	// 6. Initiate service (and graceful shutdown)
	server := http.Server{
		Addr:    fmt.Sprintf(":%d", viper.GetInt("app.port")),
		Handler: router,
	}

	go func() {
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			zap.L().Fatal("Shutdown incorrect: ", zap.Error(err))
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	zap.L().Info("Shutdown Server.")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := server.Shutdown(ctx); err != nil {
		zap.L().Fatal("Shutdown timeout: ", zap.Error(err))
	}
	zap.L().Info("Server shutdown.")
}
