package router

import (
	"github.com/labstack/echo/v4"
	"github.com/yabindra-bhujel/nepalInno/internal/config"
	"github.com/yabindra-bhujel/nepalInno/internal/middleware"
	"github.com/yabindra-bhujel/nepalInno/internal/repositories"
	"github.com/yabindra-bhujel/nepalInno/internal/schema"
	"github.com/yabindra-bhujel/nepalInno/internal/services"
)

// BlogRouters sets up routes related to blog functionality.
func BlogRouters(api *echo.Group) {
	// Initialize dependencies
	db := config.GetDB()
	blogService := services.NewBlogService(repositories.NewBlogRepository(db))
	userService := services.NewUserService(repositories.NewUserRepository(db))

	// only can use authenticated user
	api.POST("/blog", middleware.AuthMiddleware(func(c echo.Context) error {
		return createBlog(c, blogService)
	}))
	api.POST("/blog/save", middleware.AuthMiddleware(func(c echo.Context) error {
		return save(c, blogService)
	}))

	api.PUT("/blog/view/:id", func(c echo.Context) error {
		return updateBlogViews(c, blogService)
	})
	// can be accessed by anyone
	api.GET("/blog", func(c echo.Context) error {
		return getAllBlogs(c, blogService, userService)
	})
	api.GET("/blog/:id", func(c echo.Context) error {
		return getBlogByID(c, blogService, userService)
	})
	api.GET("/blog/tags", func(c echo.Context) error {
		return getTags(c, blogService)
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
// @Param        page query int false "Page number"
// @Param        limit query int false "Number of items per page"
// @Param        search_keyword query string false "Search keyword"
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


// @Summary      Update Blog Views
// @Description  Update the view count of a blog post.
// @Tags         Blog
// @Accept       json
// @Produce      json
// @Param        id path string true "Blog post ID"
// @Success      200 {object} schama.BlogOutput
// @Failure      400 {object} map[string]string
// @Failure      404 {object} map[string]string
// @Failure      500 {object} map[string]string
// @Router       /blog/view/{id} [put]
func updateBlogViews(c echo.Context, blogService *services.BlogService) error {
	return blogService.UpdateBlogView(c)
}


// @Summary      Get tag list
// @Description  Retrieve all tags.
// @Tags         Blog
// @Accept       json
// @Produce      json
// @Success      200 {object} []schama.TagOutput
// @Failure      500 {object} map[string]string
// @Router       /blog/tags [get]
func getTags(c echo.Context, blogService *services.BlogService) error {
	return blogService.GetTags(c)
}