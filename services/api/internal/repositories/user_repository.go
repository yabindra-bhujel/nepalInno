package repositories

import (
	"fmt"
	"gorm.io/gorm"
	"github.com/yabindra-bhujel/nepalInno/internal/entity"
)

type UserRepository struct {
	db *gorm.DB
}

// Constructor to initialize UserRepository
func NewUserRepository(db *gorm.DB) *UserRepository {
	return &UserRepository{db: db}
}

// Create creates a new user
func (repo *UserRepository) Create(user *entity.User) error {
	return repo.db.Create(user).Error
}

// FindAll returns all users
func (repo *UserRepository) FindAll() ([]entity.User, error) {
	var users []entity.User
	err := repo.db.Find(&users).Error
	return users, err
}

// FindByID finds a user by ID
func (repo *UserRepository) FindByID(id string) (*entity.User, error) {
	var user entity.User
	err := repo.db.Where("id = ?", id).First(&user).Error
	if err != nil {
		return nil, fmt.Errorf("user with ID %s not found: %w", id, err)
	}
	return &user, nil
}

// Update updates an existing user
func (repo *UserRepository) Update(user *entity.User) error {
	return repo.db.Save(user).Error
}

// Delete removes a user (soft delete)
func (repo *UserRepository) Delete(id string) error {
	return repo.db.Where("id = ?", id).Delete(&entity.User{}).Error
}

func (repo *UserRepository) FindByEmail(email string) (*entity.User, error) {
	var user entity.User
	err := repo.db.Where("email = ?", email).First(&user).Error
	if err != nil {
		return nil, fmt.Errorf("user with email %s not found: %w", email, err)
	}
	return &user, nil
}