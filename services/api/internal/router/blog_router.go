package router

import (
	"net/http"
	// "time"
	"fmt"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	"github.com/yabindra-bhujel/nepalInno/internal/config"
	"github.com/yabindra-bhujel/nepalInno/internal/entity"
	"github.com/yabindra-bhujel/nepalInno/internal/repositories"
	"github.com/yabindra-bhujel/nepalInno/internal/services"
	"github.com/yabindra-bhujel/nepalInno/internal/middleware"
	// "github.com/yabindra-bhujel/nepalInno/internal/utils"
)

// BlogRouters sets up routes related to blog functionality.
func BlogRouters(api *echo.Group) {
	// Initialize dependencies
	db := config.GetDB()
	blogRepo := repositories.NewBlogRepository(db)
	blogService := services.NewBlogService(blogRepo)

	 api.GET("/blog", func(c echo.Context) error {
        return createBlog(c, blogService)
    })

	// Set up routes
    api.POST("/blog", middleware.AuthMiddleware(func(c echo.Context) error {
        return createBlog(c, blogService)
    }))
	  api.POST("/blog/save", middleware.AuthMiddleware(func(c echo.Context) error {
        return save(c, blogService)
    }))
	

}

// convertToBlogTags converts a slice of tag IDs to a slice of BlogTag entities.
func convertToBlogTags(tagIDs []string) []entity.BlogTag {
	var blogTags []entity.BlogTag
	for _, id := range tagIDs {
		uuidID, err := uuid.Parse(id)
		if err != nil {
			continue // or handle the error appropriately
		}
		blogTags = append(blogTags, entity.BlogTag{ID: uuidID})
	}
	return blogTags
}

type BlogInput struct {
		Title     string   `json:"title"`
		Content   string   `json:"content"`
		Tags      *[]string `json:"tags"`           // Tag names or IDs
		Thumbnail *string   `json:"thumbnail_image"` // Thumbnail URL
	}


//@Summary      Create Blog Post
// @Description  Create a new blog post.
// @Tags         Blog
// @Accept       json
// @Produce      json
// @Param        blog body BlogInput true "Blog post details"
// @Success      200 {object} entity.Blog
// @Failure      400 {object} map[string]string
// @Failure      401 {object} map[string]string
// @Failure      500 {object} map[string]string
// @Router       /blog [post]
func createBlog(c echo.Context, blogService *services.BlogService) error {
	var input struct {
		Title     string   `json:"title"`
		Content   string   `json:"content"`
		Tags      *[]string `json:"tags"`           // Tag names or IDs
		Thumbnail *string   `json:"thumbnail_image"` // Thumbnail URL
	}

	fmt.Println("Inside createBlog", input)

	// Parse request body into input struct
	if err := c.Bind(&input); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid input format"})
	}

	// Fetch the user ID from the context (set by middleware)
	userID, ok := c.Get("id").(string)
	if !ok || userID == "" {
		return c.JSON(http.StatusUnauthorized, map[string]string{"error": "Unauthorized"})
	}

	// Handle Tags: Fetch or create each tag and collect IDs
	// var tagsID []string
	// if input.Tags != nil {
	// 	for _, tagName := range *input.Tags {
	// 		tag, _ := blogService.FindTagByName(tagName)
	// 		// if err != nil {
	// 		// 	return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	// 		// }

	// 		if tag == nil {
	// 			// Tag not found, create a new one
	// 			newTag, err := blogService.CreateBlogTag(&entity.BlogTag{Name: tagName})
	// 			if err != nil {
	// 				return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	// 			}
	// 			tagsID = append(tagsID, newTag.ID.String())
	// 		} else {
	// 			tagsID = append(tagsID, tag.ID.String())
	// 		}
	// 	}
	// }

	// Convert userID to uuid.UUID
	authorUUID, err := uuid.Parse(userID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Invalid user ID format"})
	}

	// Create the blog entity
	blog := &entity.Blog{
		Title:       input.Title,
		Content:     input.Content,
		AuthorID:    authorUUID,
		Thumbnail:   input.Thumbnail,
		// Tags:        convertToBlogTags(tagsID),
		IsPublished: true,
	}

	// Call service to create the blog
	createdBlog, err := blogService.CreateBlog(blog)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	// Respond with the created blog
	return c.JSON(http.StatusOK, createdBlog)
}

//@Summary      Save Blog Post
// @Description  Save a new blog post.
// @Tags         Blog
// @Accept       json
// @Produce      json
// @Param        blog body BlogInput true "Blog post details"
// @Success      201 {object} entity.Blog
// @Failure      400 {object} map[string]string
// @Failure      401 {object} map[string]string
// @Failure      500 {object} map[string]string
// @Router       /blog/save [post]
func save(c echo.Context, blogService *services.BlogService) error {
	var input struct {
		Title     string   `json:"title"`
		Content   string   `json:"content"`
		Tags      *[]string `json:"tags"`           // Tag names or IDs
		Thumbnail *string   `json:"thumbnail_image"` // Thumbnail URL
	}

	fmt.Println("Inside createBlog", input)

	// Parse request body into input struct
	if err := c.Bind(&input); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid input format"})
	}

	// Fetch the user ID from the context (set by middleware)
	userID, ok := c.Get("id").(string)
	if !ok || userID == "" {
		return c.JSON(http.StatusUnauthorized, map[string]string{"error": "Unauthorized"})
	}

	// Handle Tags: Fetch or create each tag and collect IDs
	// var tagsID []string
	// if input.Tags != nil {
	// 	for _, tagName := range *input.Tags {
	// 		tag, _ := blogService.FindTagByName(tagName)
	// 		// if err != nil {
	// 		// 	return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	// 		// }

	// 		if tag == nil {
	// 			// Tag not found, create a new one
	// 			newTag, err := blogService.CreateBlogTag(&entity.BlogTag{Name: tagName})
	// 			if err != nil {
	// 				return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	// 			}
	// 			tagsID = append(tagsID, newTag.ID.String())
	// 		} else {
	// 			tagsID = append(tagsID, tag.ID.String())
	// 		}
	// 	}
	// }

	// Convert userID to uuid.UUID
	authorUUID, err := uuid.Parse(userID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Invalid user ID format"})
	}

	// Create the blog entity
	blog := &entity.Blog{
		Title:       input.Title,
		Content:     input.Content,
		AuthorID:    authorUUID,
		Thumbnail:   input.Thumbnail,
		// Tags:        convertToBlogTags(tagsID),
		IsPublished: false,
	}

	// Call service to create the blog
	createdBlog, err := blogService.CreateBlog(blog)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	// Respond with the created blog
	return c.JSON(http.StatusOK, createdBlog)
}
