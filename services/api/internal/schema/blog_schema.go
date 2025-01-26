package schama


type BlogInput struct {
	Title     string   `json:"title"`
	Content   string   `json:"content"`
	Tags      *[]string `json:"tags"`           // Tag names or IDs
	Thumbnail *string   `json:"thumbnail_image"` // Thumbnail URL
}


type UserOutput struct {
	ID    string `json:"id"`
	Email string `json:"email"`
	Name  string `json:"name"`
	Image string `json:"image"`
}


type BlogOutput struct {
	ID          string   `json:"id"`
	Title       string   `json:"title"`
	Content     string   `json:"content"`
	Thumbnail   string   `json:"thumbnail"`
	Tags        []string `json:"tags"`
	IsPublished bool     `json:"is_published"`
	CreatedAt   string   `json:"created_at"`
	TimeToRead  int      `json:"time_to_read"`
	TotalViews  int      `json:"total_views"`
	User        UserOutput `json:"user"`
}

type BlogListOutput struct {
	Blogs []BlogOutput `json:"blogs"`
	User UserOutput `json:"user"`
}

type TagOutput struct {
	Name  string `json:"name"`
	BlogCount int    `json:"blog_count"`
}