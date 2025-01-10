package repositories


import (
	"fmt"
	"gorm.io/gorm"
	"github.com/yabindra-bhujel/nepalInno/internal/entity"
)

type BlogRepository struct {
	db *gorm.DB
}

// Constructor to initialize BlogRepository
func NewBlogRepository(db *gorm.DB) *BlogRepository {
	return &BlogRepository{db: db}
}

// Create creates a new blog post
func (repo *BlogRepository) Create(blog *entity.Blog) error {
	return repo.db.Create(blog).Error
}

// FindAll returns all blog posts
func (repo *BlogRepository) FindAll() ([]entity.Blog, error) {
	var blogs []entity.Blog
	err := repo.db.Find(&blogs).Error
	return blogs, err
}

// FindByID finds a blog post by ID
func (repo *BlogRepository) FindByID(id string) (*entity.Blog, error) {
    var blog entity.Blog
    err := repo.db.Where("id = ?", id).First(&blog).Error
    if err != nil {
        return nil, fmt.Errorf("blog post with ID %s not found: %w", id, err)
    }
    return &blog, nil
}

// Update updates an existing blog post
func (repo *BlogRepository) Update(blog *entity.Blog) error {
	return repo.db.Save(blog).Error
}

// Delete removes a blog post (soft delete)
func (repo *BlogRepository) Delete(id string) error {
	return repo.db.Where("id = ?", id).Delete(&entity.Blog{}).Error
}

// FindTagByName finds a blog tag by name
func (repo *BlogRepository) FindTagByName(name string) (*entity.BlogTag, error) {
	tag := new(entity.BlogTag)
	err := repo.db.Where("name = ?", name).First(tag).Error
	if err != nil {
		return nil, fmt.Errorf("failed to find tag by name: %w", err)
	}
	return tag, nil
}

// CreateTag creates a new blog tag
func (repo *BlogRepository) CreateTag(tag *entity.BlogTag) error {
	return repo.db.Create(tag).Error
}

