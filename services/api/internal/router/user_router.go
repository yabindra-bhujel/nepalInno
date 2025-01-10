package router

import (
	"net/http"
	"time"
	"github.com/labstack/echo/v4"
	"github.com/yabindra-bhujel/nepalInno/internal/config"
	"github.com/yabindra-bhujel/nepalInno/internal/entity"
	"github.com/yabindra-bhujel/nepalInno/internal/repositories"
	"github.com/yabindra-bhujel/nepalInno/internal/services"
	"github.com/yabindra-bhujel/nepalInno/internal/middleware"
	"github.com/yabindra-bhujel/nepalInno/internal/utils"
)

// UserRouters sets up routes related to user functionality.
func UserRouters(api *echo.Group) {
	// Initialize dependencies
	db := config.GetDB()
	userRepo := repositories.NewUserRepository(db)
	userService := services.NewUserService(userRepo)

	// Set up routes
	api.POST("/auth/google_user_create", func(c echo.Context) error {
		return createUserFromGoogleAuth(c, userService)
	})

    // Protect '/me' route using AuthMiddleware
    api.GET("/auth/me", middleware.AuthMiddleware(func(c echo.Context) error {
        return me(c, userService)
    }))
    // Protect '/logout' route using AuthMiddleware
    api.POST("/auth/logout", middleware.AuthMiddleware(func(c echo.Context) error {
        return logout(c)
    }))
}

//@Summary      Google User Creation
// @Description  Create a new user using Google OAuth credentials or return an existing user.
// @Tags         User
// @Accept       json
// @Produce      json
// @Param        credential body string true "Google OAuth Token"
// @Success      200 {object} entity.User
// @Failure      400 {object} map[string]string
// @Failure      401 {object} map[string]string
// @Failure      500 {object} map[string]string
// @Router       /auth/google_user_create [post]
func createUserFromGoogleAuth(c echo.Context, userService *services.UserService) error {
    var input struct {
        Credential string `json:"credential"`
    }

    if err := c.Bind(&input); err != nil {
        return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid input format"})
    }

    claims, err := utils.DecodeGoogleLoginUserToken(input.Credential)
    if err != nil {
        return c.JSON(http.StatusUnauthorized, map[string]string{"error": "Invalid Google token"})
    }

    email := claims["email"].(string)
    existingUser, _ := userService.FindUserByEmail(email)
    if existingUser != nil {
        token, err := utils.GenerateToken(email, existingUser.ID.String())
        if err != nil {
            return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to generate token"})
        }
        return utils.WriteCookie(c, token)
    }

    user := &entity.User{
        Email:        email,
        FullName:     utils.StringPointer(claims["name"].(string)),
        Image:        utils.StringPointer(claims["picture"].(string)),
        AuthProvider: utils.StringPointer("google"),
        IsActive:     true,
        IsVerified:   true,
        Role:         "user",
        LastLogin:    utils.TimePointer(time.Now()),
    }

    createdUser, err := userService.CreateGoogleAuth(user)
    if err != nil {
        return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
    }

    token, err := utils.GenerateToken(email, createdUser.ID.String())
    if err != nil {
        return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to generate token"})
    }

    return utils.WriteCookie(c, token)
}


// @Summary      Get if the user is authenticated
// @Description  Get the user details if authenticated
// @Tags         User
// @Accept       json
// @Produce      json
// @Success      200 {object} entity.User
// @Failure      401 {object} map[string]string
// @Router       /auth/me [get]
func me(c echo.Context, userService *services.UserService) error {
    email := c.Get("email").(string)

    user, err := userService.FindUserByEmail(email)
    if err != nil {
        return c.JSON(http.StatusUnauthorized, map[string]string{"error": "Unauthorized"})
    }

    return c.JSON(http.StatusOK, user) 
}

// @Summary      Logout
// @Description  Logout the user
// @Tags         User
// @Accept       json
// @Produce      json
// @Success      200 {object} map[string]string
// @Failure      401 {object} map[string]string
// @Router       /auth/logout [post]
func logout(c echo.Context) error {
    return utils.DeleteCookie(c)
}

