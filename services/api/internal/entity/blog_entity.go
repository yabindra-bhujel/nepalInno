package entity

import (
	"github.com/google/uuid"
	"time"
)

type Blog struct {
	ID          uuid.UUID  `gorm:"type:uuid;default:uuid_generate_v4()" json:"id"`
	Title       string     `json:"title"`
	Content     string     `json:"content"`
	IsPublished bool       `gorm:"default:false" json:"is_published"`
	Thumbnail   *string    `json:"thumbnail_image"`

	// Many-to-Many relationship with BlogTag using the blog_tag_associations table
	Tags []BlogTag `gorm:"many2many:blog_tag_associations;"`
	
	AuthorID  uuid.UUID `json:"author_id"`
	Author    User      `gorm:"foreignKey:AuthorID" json:"author"`

	// Timestamps
	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt time.Time `gorm:"autoUpdateTime" json:"updated_at"`
	DeletedAt time.Time `gorm:"index" json:"deleted_at"`
}

func (Blog) TableName() string {
	return "blogs"
}



