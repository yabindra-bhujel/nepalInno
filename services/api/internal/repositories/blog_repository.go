package repositories

import (
	"fmt"
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
func (repo *BlogRepository) FindAll() ([]entity.Blog, error) {
	var blogs []entity.Blog
	err := repo.db.Find(&blogs).Error
	return blogs, err
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
func (repo *BlogRepository) Update(blog *entity.Blog) error {
	return repo.db.Save(blog).Error
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
