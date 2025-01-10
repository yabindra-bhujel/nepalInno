package utils

import (
    "net/http"
    "time"
	"github.com/labstack/echo/v4"
)

const COOKIE_NAME = "AUTHENTICATION"

func WriteCookie(c echo.Context, token string) error {
    // Create a cookie
    cookie := new(http.Cookie)
    cookie.Name = COOKIE_NAME
    cookie.Value = token
    cookie.Expires = time.Now().Add(24 * time.Hour)
    cookie.HttpOnly = true // Secure against XSS
    cookie.Secure = true   // Ensure HTTPS usage
    cookie.Path = "/"

    c.SetCookie(cookie)

    return c.JSON(http.StatusOK, map[string]string{
        "message": "Cookie and header set successfully",
    })
}


func DeleteCookie(c echo.Context) error {
    // delete the cookie
    cookie := new(http.Cookie)
    cookie.Name = COOKIE_NAME
    cookie.Path = "/"
    cookie.MaxAge = -1

    c.SetCookie(cookie)

    return c.JSON(http.StatusOK, map[string]string{
        "message": "Cookie deleted successfully",
    })
}