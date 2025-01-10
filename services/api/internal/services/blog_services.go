package services

import (
	"fmt"
	"github.com/yabindra-bhujel/nepalInno/internal/entity"
	"github.com/yabindra-bhujel/nepalInno/internal/repositories"
)

// BlogService provides blog-related operations.
type BlogService struct {
	repo *repositories.BlogRepository
}

// NewBlogService creates a new BlogService instance.
func NewBlogService(repo *repositories.BlogRepository) *BlogService {
	return &BlogService{repo: repo}
}

// Create creates a new blog post.
func (s *BlogService) CreateBlog(blog *entity.Blog) (*entity.Blog, error) {
	err := s.repo.Create(blog)
    if err!= nil {
        return nil, fmt.Errorf("failed to create blog: %w", err)
    }
    return blog, nil
}


func (s *BlogService) FindTagByName(name string) (*entity.BlogTag, error) {
	tag, err := s.repo.FindTagByName(name)
	if err != nil {
		return nil, fmt.Errorf("failed to find tag by name: %w", err)
	}
	return tag, nil
}

func (s *BlogService) CreateBlogTag(tag *entity.BlogTag) (*entity.BlogTag, error){
	err := s.repo.CreateTag(tag)
    if err!= nil {
        return nil, fmt.Errorf("failed to create blog tag: %w", err)
    }
    return tag, nil
}
