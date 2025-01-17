package router

import (
	"github.com/labstack/echo/v4"
	"github.com/yabindra-bhujel/nepalInno/internal/config"
	"github.com/yabindra-bhujel/nepalInno/internal/repositories"
	"github.com/yabindra-bhujel/nepalInno/internal/services"
	"github.com/yabindra-bhujel/nepalInno/internal/middleware"
	"github.com/yabindra-bhujel/nepalInno/internal/schema"
)

// BlogRouters sets up routes related to blog functionality.
func BlogRouters(api *echo.Group) {
	// Initialize dependencies
	db := config.GetDB()
	blogService := services.NewBlogService(repositories.NewBlogRepository(db))
	userService := services.NewUserService(repositories.NewUserRepository(db))

	// Set up routes
	api.POST("/blog", middleware.AuthMiddleware(func(c echo.Context) error {
		return createBlog(c, blogService)
	}))
	api.POST("/blog/save", middleware.AuthMiddleware(func(c echo.Context) error {
		return save(c, blogService)
	}))

	api.GET("/blog", func(c echo.Context) error {
		return getAllBlogs(c, blogService, userService)
	})
	api.GET("/blog/:id", func(c echo.Context) error {
		return getBlogByID(c, blogService, userService)
	})
}

// @Summary      Create Blog Post
// @Description  Create a new blog post.
// @Tags         Blog
// @Accept       json
// @Produce      json
// @Param        blog body schama.BlogInput true "Blog post details"
// @Success      200 {object} schama.BlogOutput
// @Failure      400 {object} map[string]string
// @Failure      401 {object} map[string]string
// @Failure      500 {object} map[string]string
// @Router       /blog [post]
func createBlog(c echo.Context, blogService *services.BlogService) error {
	var input schama.BlogInput
	return blogService.Create(c, false, input)
}

// @Summary      Save Blog Post
// @Description  Save a new blog post.
// @Tags         Blog
// @Accept       json
// @Produce      json
// @Param        blog body schama.BlogInput true "Blog post details"
// @Success      201 {object} schama.BlogOutput
// @Failure      400 {object} map[string]string
// @Failure      401 {object} map[string]string
// @Failure      500 {object} map[string]string
// @Router       /blog/save [post]
func save(c echo.Context, blogService *services.BlogService) error {
	var input schama.BlogInput
	return blogService.Create(c, true, input)
}

// @Summary      Get All Blog Posts
// @Description  Retrieve all blog posts.
// @Tags         Blog
// @Accept       json
// @Produce      json
// @Success      200 {object} []schama.BlogOutput
// @Failure      500 {object} map[string]string
// @Router       /blog [get]
func getAllBlogs(c echo.Context, blogService *services.BlogService, userService *services.UserService) error {
	return blogService.GetAllBlog(c, *userService)
}

// @Summary      Get Blog Post by ID
// @Description  Retrieve a blog post by its ID.
// @Tags         Blog
// @Accept       json
// @Produce      json
// @Param        id path string true "Blog post ID"
// @Success      200 {object} schama.BlogOutput
// @Failure      400 {object} map[string]string
// @Failure      404 {object} map[string]string
// @Failure      500 {object} map[string]string
// @Router       /blog/{id} [get]
func getBlogByID(c echo.Context, blogService *services.BlogService, userService *services.UserService) error {
	return blogService.GetBlogByID(c, *userService)
}