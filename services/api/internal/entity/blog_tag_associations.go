package entity

import (
    "github.com/google/uuid"
    "time"
)

// BlogTagAssociation 中間テーブル
type BlogTagAssociation struct {
	BlogID    uuid.UUID `gorm:"type:uuid;primaryKey" json:"blog_id"`
	BlogTagID uuid.UUID `gorm:"type:uuid;primaryKey" json:"blog_tag_id"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
}

func (BlogTagAssociation) TableName() string {
	return "blog_tag_associations"
}