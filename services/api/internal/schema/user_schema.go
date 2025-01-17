package schama


type UserResponse struct {
    ID        string `json:"id"`
    Email    string `json:"email"`
    FullName string `json:"full_name"`
    Image    string `json:"image"`
}