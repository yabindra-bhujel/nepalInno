package services

import (
	"fmt"
	"github.com/yabindra-bhujel/nepalInno/internal/entity"
	"github.com/yabindra-bhujel/nepalInno/internal/repositories"
)

// UserService provides user-related operations.
type UserService struct {
	repo *repositories.UserRepository
}

// NewUserService creates a new UserService instance.
func NewUserService(repo *repositories.UserRepository) *UserService {
	return &UserService{repo: repo}
}

func (s *UserService) CreateGoogleAuth(user *entity.User) (*entity.User, error) {

	// Example: Ensure user has a default role if not provided
	if user.Role == "" {
		user.Role = "user" // Default to "user" role if none provided
	}

	// Create the user in the database
	err := s.repo.Create(user)
	if err != nil {
		return nil, fmt.Errorf("failed to create user: %w", err)
	}
	return user, nil
}

// CreateUser creates a new user with the provided details.
func (s *UserService) CreateUser(user *entity.User) (*entity.User, error) {
	// Example: Ensure user has a default role if not provided
	if user.Role == "" {
		user.Role = "user" // Default to "user" role if none provided
	}

	// Create the user in the database
	err := s.repo.Create(user)
	if err != nil {
		return nil, fmt.Errorf("failed to create user: %w", err)
	}
	return user, nil
}

// FindAllUsers returns all users.
func (s *UserService) FindAllUsers() ([]entity.User, error) {
	users, err := s.repo.FindAll()
	if err != nil {
		return nil, fmt.Errorf("failed to retrieve users: %w", err)
	}
	return users, nil
}

// FindUserByID returns a user by ID.
func (s *UserService) FindUserByID(id string) (*entity.User, error) {
	// You may want to convert the ID to a proper UUID if needed
	user, err := s.repo.FindByID(id)
	if err != nil {
		return nil, fmt.Errorf("failed to find user by ID: %w", err)
	}
	return user, nil
}

// UpdateUser updates an existing user's details.
func (s *UserService) UpdateUser(user *entity.User) (*entity.User, error) {
	// Perform any validation or additional logic
	err := s.repo.Update(user)
	if err != nil {
		return nil, fmt.Errorf("failed to update user: %w", err)
	}
	return user, nil
}

// DeleteUser soft deletes a user by ID.
func (s *UserService) DeleteUser(id string) error {
	err := s.repo.Delete(id)
	if err != nil {
		return fmt.Errorf("failed to delete user: %w", err)
	}
	return nil
}

// FindUserByEmail returns a user by email.
func (s *UserService) FindUserByEmail(email string) (*entity.User, error) {
	user, err := s.repo.FindByEmail(email)
	if err != nil {
		return nil, fmt.Errorf("failed to find user by email: %w", err)
	}
	return user, nil
}


func (s *UserService) alreadyExists(email string) bool {
	user, err := s.repo.FindByEmail(email)
    if err!= nil {
        return false
    }
    return user!= nil
}
