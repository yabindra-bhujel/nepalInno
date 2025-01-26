package services

import (
	"net/http"
	"strings"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	"github.com/yabindra-bhujel/nepalInno/internal/entity"
	"github.com/yabindra-bhujel/nepalInno/internal/repositories"
	"github.com/yabindra-bhujel/nepalInno/internal/schema"
)

// BlogService provides blog-related business logic.
type BlogService struct {
	repo        *repositories.BlogRepository
	userService *UserService
}

// NewBlogService creates a new BlogService instance.
func NewBlogService(repo *repositories.BlogRepository) *BlogService {
	return &BlogService{repo: repo}
}

// Create creates a new blog post and returns the created blog. or Save the blog post without publishing.
func (s *BlogService) Create(c echo.Context, isSaveOnly bool, input schama.BlogInput) error {

	// Parse and validate the request body
	if err := c.Bind(&input); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid input format"})
	}
	if err := c.Validate(input); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Validation failed"})
	}

	// Fetch the user ID from the context
	userID, ok := c.Get("id").(string)
	if !ok {
		return c.JSON(http.StatusUnauthorized, map[string]string{"error": "Unauthorized"})
	}

	// Convert userID to uuid.UUID
	authorUUID, err := uuid.Parse(userID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Invalid user ID format"})
	}

	// Handle Tags: Fetch or create each tag
	var blogTags []entity.BlogTag
	if input.Tags != nil {
		for _, tagName := range *input.Tags {
			tag, _ := s.repo.FindTagByName(tagName)

			if tag == nil {
				// Tag not found, create a new one
				newTag, err := s.repo.CreateTag(&entity.BlogTag{Name: tagName})
				if err != nil {
					return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
				}
				if err != nil {
					return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
				}
				blogTags = append(blogTags, *newTag)
			} else {
				blogTags = append(blogTags, *tag)
			}
		}
	}

	// calculate the time to read from the content
	timeToRead := calculateTimeToRead(input.Content)

	// Create the blog entity
	blog := &entity.Blog{
		Title:       input.Title,
		Content:     input.Content,
		AuthorID:    authorUUID,
		Thumbnail:   input.Thumbnail,
		Tags:        blogTags,
		TimeToRead:  int64(timeToRead),
		TotalViews:  0,
		IsPublished: true,
	}

	if isSaveOnly {
		blog.IsPublished = false
	}

	createdBlog, err := s.repo.Create(blog)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	var thumbnail string

	if blog.Thumbnail != nil {
		thumbnail = *blog.Thumbnail
	} else {
		thumbnail = ""
	}

	// Convert the created blog to output format
	output := schama.BlogOutput{
		ID:          createdBlog.ID.String(),
		Title:       createdBlog.Title,
		Content:     createdBlog.Content,
		Thumbnail:   thumbnail,
		Tags:        make([]string, len(createdBlog.Tags)),
		IsPublished: createdBlog.IsPublished,
		CreatedAt:   createdBlog.CreatedAt.Format("2006-01-02 15:04:05"),
		TimeToRead:  int(createdBlog.TimeToRead),
		TotalViews:  int(createdBlog.TotalViews),
	}

	// Populate the Tags field with tag names
	for i, tag := range createdBlog.Tags {
		output.Tags[i] = tag.Name
	}

	// Respond with the created blog
	return c.JSON(http.StatusCreated, output)
}

// fetch all blog post and return the list of blog post
func (s *BlogService) GetAllBlog(c echo.Context, userService UserService) error {
	page := c.QueryParam("page")
	limit := c.QueryParam("limit")
	searchKeyword := c.QueryParam("search_keyword")
	
	// Fetch all blogs and footer (pagination details)
	blogs, footer, err := s.repo.FindAll(page, limit, searchKeyword)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}
	
	// Initialize an empty slice to hold the output
	var output schama.BlogListOutput

	// Loop through each blog to fetch user data (author's email) and populate the output
	for _, blog := range blogs {
		// Fetch user by ID (AuthorID) for the blog
		user, err := userService.FindUserByID(blog.AuthorID.String())
		if err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
		}

		var thumbnail string
		if blog.Thumbnail != nil {
			thumbnail = *blog.Thumbnail
		} else {
			thumbnail = ""
		}

		blogUUID, err := uuid.Parse(blog.ID.String())
		if err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Invalid blog ID format"})
		}

		tags, _ := s.repo.GetTagsByBlogID(blogUUID.String())

		blogOutput := schama.BlogOutput{
			ID:          blog.ID.String(),
			Title:       blog.Title,
			Content:     blog.Content,
			Thumbnail:   thumbnail,
			Tags:        convertTagsToStrings(tags),
			IsPublished: blog.IsPublished,
			CreatedAt:   blog.CreatedAt.Format("2006-01-02"),
			TimeToRead:  int(blog.TimeToRead),
			TotalViews:  int(blog.TotalViews),
			User: schama.UserOutput{
				ID:    user.ID.String(),
				Email: user.Email,
				Name:  *user.FullName,
				Image: *user.Image,
			},
		}

		// Append the blogOutput to the Blogs slice in the output
		output.Blogs = append(output.Blogs, blogOutput)
	}

	// Extract values from the footer map and handle potential errors
	totalCount, ok := footer["total_count"].(int)
	if !ok {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "total_count is not an integer"})
	}

	totalPages, ok := footer["total_pages"].(int)
	if !ok {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "total_pages is not an integer"})
	}

	pageInt, ok := footer["page"].(int)
	if !ok {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "page is not an integer"})
	}

	limitInt, ok := footer["limit"].(int)
	if !ok {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "limit is not an integer"})
	}

	// Populate footer details in the output
	output.TotalCount = totalCount
	output.TotalPage = totalPages
	output.CurrentPage = pageInt
	output.Limit = limitInt

	// Respond with the list of blogs
	return c.JSON(http.StatusOK, output)
}


// convertTagsToStrings converts a slice of BlogTag to a slice of strings
func convertTagsToStrings(tags []entity.BlogTag) []string {
	tagNames := make([]string, len(tags))
	for i, tag := range tags {
		tagNames[i] = tag.Name
	}
	return tagNames
}

func (s *BlogService) GetBlogByID(c echo.Context, userService UserService) error {

	// Fetch the blog ID from the URL
	blogID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid blog ID format"})
	}

	// Fetch the blog by ID
	blog, err := s.repo.FindByID(blogID.String())
	if err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "Blog not found"})
	}

	var thumbnail string

	if blog.Thumbnail != nil {
		thumbnail = *blog.Thumbnail
	} else {
		thumbnail = ""
	}

	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	user, err := userService.FindUserByID(blog.AuthorID.String())
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	blogUUID, err := uuid.Parse(blog.ID.String())

	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Invalid blog ID format"})
	}

	tags, _ := s.repo.GetTagsByBlogID(blogUUID.String())
	blogOutput := schama.BlogOutput{
		ID:          blog.ID.String(),
		Title:       blog.Title,
		Content:     blog.Content,
		Thumbnail:   thumbnail,
		Tags:        convertTagsToStrings(tags),
		IsPublished: blog.IsPublished,
		CreatedAt:   blog.CreatedAt.Format("2006-01-02"),
		TimeToRead:  int(blog.TimeToRead),
		TotalViews:  int(blog.TotalViews),
		User: schama.UserOutput{
			ID:    user.ID.String(),
			Email: user.Email,
			Name:  *user.FullName,
			Image: *user.Image,
		},
	}

	// Populate the Tags field with tag names
	for j, tag := range blog.Tags {
		blogOutput.Tags[j] = tag.Name
	}

	// Respond with the blog
	return c.JSON(http.StatusOK, blogOutput)
}

func calculateTimeToRead(content string) float64 {
	// Calculate the time to read based on the average reading speed of 200 words per minute
	// and the total number of words in the content
	const wordsPerMinute = 200
	words := strings.Fields(content)
	min := float64(len(words)) / wordsPerMinute
	// if the time to read is less than 1 minute, set it to 1 minute
	if min < 1 {
		return 1
	}
	return min

}

func (s *BlogService) UpdateBlogView(c echo.Context) error {
	// Fetch the blog ID from the URL
	blogId, err := uuid.Parse(c.Param("id"))
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid blog ID format"})
	}

	// Fetch the blog by ID
	blog, err := s.repo.FindByID(blogId.String())
	if err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "Blog not found"})
	}

	// Update the total views count
	blog.TotalViews++
	updatedBlog, err := s.repo.Update(blog)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, updatedBlog)
}




func (s *BlogService) GetTags(c echo.Context) error {
	// Fetch all tags with the associated blog count
	tags, err := s.repo.FindAllTags()
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	var output []map[string]interface{}

	for _, tag := range tags {
		output = append(output, map[string]interface{}{
			"id":         tag["id"],
			"name":       tag["name"],
			"count":      tag["blog_count"],
		})
	}

	return c.JSON(http.StatusOK, output)
}