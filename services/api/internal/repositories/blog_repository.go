package repositories

import (
	"fmt"
	"strconv"

	"github.com/yabindra-bhujel/nepalInno/internal/entity"
	"gorm.io/gorm"
)

// BlogRepository is the struct that holds the database instance and methods to interact with the blog data.
type BlogRepository struct {
	db *gorm.DB
}

// NewBlogRepository creates a new BlogRepository instance.
func NewBlogRepository(db *gorm.DB) *BlogRepository {
	return &BlogRepository{db: db}
}

// Create creates a new blog post and stores it in the database.
func (repo *BlogRepository) Create(blog *entity.Blog) (*entity.Blog, error) {
	err := repo.db.Create(blog).Error
	return blog, err
}

// FindAll retrieves all blog posts from the database.
func (repo *BlogRepository) FindAll(page string, limit string, search_keyword string,) ([]entity.Blog, map[string]interface{}, error) {
	
	var blogs []entity.Blog

	// Convert page and limit to integers
	pageInt, err := strconv.Atoi(page)
	if err != nil {
		return nil, nil, err
	}

	limitInt, err := strconv.Atoi(limit)
	if err != nil {
		return nil, nil, err
	}

	// Calculate the offset based on the page
	offset := (pageInt - 1) * limitInt

	// Using Joins to search in both Blog's title and BlogTag's name
	err = repo.db.Joins("JOIN blog_tag_associations bta ON bta.blog_id = blogs.id").
		Joins("JOIN blog_tags bt ON bt.id = bta.blog_tag_id").
		Where("blogs.title LIKE ? OR bt.name LIKE ?", "%"+search_keyword+"%", "%"+search_keyword+"%").
		// order by created_at most viewed

		Distinct().
		Limit(limitInt).Offset(offset).Find(&blogs).Error
	
	if err != nil {
		return nil, nil, err
	}

	// Query to get the total number of blogs matching the search
	var totalCount int64
	err = repo.db.Joins("JOIN blog_tag_associations bta ON bta.blog_id = blogs.id").
		Joins("JOIN blog_tags bt ON bt.id = bta.blog_tag_id").
		Where("blogs.title LIKE ? OR bt.name LIKE ?", "%"+search_keyword+"%", "%"+search_keyword+"%").
		Model(&entity.Blog{}).Select("COUNT(DISTINCT blogs.id)").Scan(&totalCount).Error

	
	if err != nil {
		return nil, nil, err
	}

	// Calculate the total number of pages
	totalPages := int(totalCount) / limitInt
	if totalCount%int64(limitInt) > 0 {
		totalPages++
	}

	// Create the footer with pagination details
	footer := map[string]interface{}{
		"total_count": int(totalCount),
		"total_pages": int(totalPages),
		"page":        int(pageInt),
		"limit":       int(limitInt),
	}

	return blogs, footer, nil
}

// FindByID finds a blog post by its ID.
func (repo *BlogRepository) FindByID(id string) (*entity.Blog, error) {
	var blog entity.Blog
	err := repo.db.Where("id = ?", id).First(&blog).Error
	if err != nil {
		return nil, fmt.Errorf("blog post with ID %s not found: %w", id, err)
	}
	return &blog, nil
}

// Update updates an existing blog post in the database.
func (repo *BlogRepository) Update(blog *entity.Blog) (*entity.Blog, error) {
	err := repo.db.Save(blog).Error
	return blog, err
}

// Delete removes a blog post (soft delete) by its ID.
func (repo *BlogRepository) Delete(id string) error {
	return repo.db.Where("id = ?", id).Delete(&entity.Blog{}).Error
}

// FindTagByName searches for a tag by its name.
func (repo *BlogRepository) FindTagByName(name string) (*entity.BlogTag, error) {
	tag := new(entity.BlogTag)
	err := repo.db.Where("name = ?", name).First(tag).Error
	if err != nil {
		return nil, fmt.Errorf("failed to find tag by name: %w", err)
	}
	return tag, nil
}

// CreateTag creates a new tag in the database.
func (repo *BlogRepository) CreateTag(tag *entity.BlogTag) (*entity.BlogTag, error) {
	err := repo.db.Create(tag).Error
	return tag, err
}

// GetTagsByBlogID retrieves all tags associated with a blog post by its ID.
func (repo *BlogRepository) GetTagsByBlogID(blogID string) ([]entity.BlogTag, error) {
	var blog entity.Blog
	// Preload the Tags for the given blogID
	err := repo.db.Preload("Tags").Where("id = ?", blogID).First(&blog).Error
	if err != nil {
		return nil, err
	}

	// Return the Tags associated with the blog
	return blog.Tags, nil
}


func (repo *BlogRepository) FindAllTags() ([]map[string]interface{}, error) {
	var results []map[string]interface{}

	// Perform the join between the BlogTag and BlogTagAssociation tables
	// Count the number of blogs associated with each tag
	err := repo.db.Table("blog_tags").
		Select("blog_tags.id, blog_tags.name, COUNT(blog_tag_associations.blog_id) AS blog_count").
		Joins("LEFT JOIN blog_tag_associations ON blog_tag_associations.blog_tag_id = blog_tags.id").
		Group("blog_tags.id").
		Scan(&results).Error

	return results, err
}
