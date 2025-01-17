package entity

import (
	"github.com/google/uuid"
	"time"
)

type BlogTag struct {
	ID   uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4()" json:"id"`
	Name string    `json:"name"`

	// Many-to-Many relationship with Blog
	Blogs []Blog `gorm:"many2many:blog_tag_associations;" json:"blogs"`

	// Timestamps
	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
}

func (BlogTag) TableName() string {
	return "blog_tags"
}