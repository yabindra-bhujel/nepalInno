package router

import (

    "github.com/labstack/echo/v4"
)

func RegisterAllRoutes(api *echo.Group) {
    UserRouters(api)
    BlogRouters(api)
}
