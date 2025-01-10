package entity

import (
	"github.com/google/uuid"
	"time"
)

type User struct {
	ID           uuid.UUID            `gorm:"type:uuid;default:uuid_generate_v4()" json:"id"`
	FullName     *string              `json:"full_name"`
	Email        string               `gorm:"uniqueIndex;not null" json:"email"`
	Password     *string              `json:"password"`
	CreatedAt    time.Time            `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt    time.Time            `gorm:"autoUpdateTime" json:"updated_at"`
	LastLogin	*time.Time           `json:"last_login"`
	AuthProvider *string   			  `json:"auth_provider"`
	IsActive     bool                 `gorm:"default:true" json:"is_active"`
	IsVerified   bool                 `gorm:"default:false" json:"is_verified"`
	Role         string               `gorm:"default:'user'" json:"role"`
	Image        *string              `json:"image"`

	// relationships
	Blogs     []Blog    `gorm:"foreignKey:AuthorID" json:"blogs"`
}

func (User) TableName() string {
	return "users"
}
