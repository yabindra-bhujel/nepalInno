package utils

import (
	"fmt"
	"github.com/golang-jwt/jwt/v4"
)

// Decode Google login user token without verification
func DecodeGoogleLoginUserToken(tokenString string) (jwt.MapClaims, error) {
	
	token, _, err := new(jwt.Parser).ParseUnverified(tokenString, &jwt.MapClaims{})
	if err != nil {
		return nil, fmt.Errorf("failed to parse token: %v", err)
	}

	// Extract claims from the token and ensure they are of type jwt.MapClaims
	claims, ok := token.Claims.(*jwt.MapClaims)
	if !ok {
		return nil, fmt.Errorf("invalid claims")
	}
	return *claims, nil
}
