package utils

import (
    "time"
    "github.com/yabindra-bhujel/nepalInno/internal/config"
	"github.com/golang-jwt/jwt/v4"
)

type jwtCustomClaims struct {
	Email  string `json:"email"`
	ID string   `json:"id"`
	jwt.RegisteredClaims
}

func GenerateToken(email string, ID string) (string, error) {
    jwtClaims := &jwtCustomClaims{
        Email: email,
        ID:    ID,
        RegisteredClaims: jwt.RegisteredClaims{
            ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour * 72)),
        },
    }

    token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwtClaims)
    t, err := token.SignedString([]byte(config.GetJWTSecret()))
    if err != nil {
        return "", err
    }
    return t, nil
}