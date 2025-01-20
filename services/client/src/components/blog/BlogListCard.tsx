import { BlogAuthor } from "../BlogAuthor";
import { useNavigate } from "react-router-dom";
import { BlogPost } from "../../types/interface/blog-interface";

export const BlogListCard = ({ blog }: { blog: BlogPost }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    // TODO: Handle to add total views
    navigate(`/blog/${blog.id}`);
  };

  return (
    <div
      className="border border-gray-300 rounded-xl shadow-md bg-white hover:shadow-2xl hover:bg-gray-50 
      transition-transform duration-300 overflow-hidden max-w-md cursor-pointer"
    >
      {/* Blog Content */}
      <div className="p-5 flex flex-col space-y-4">
        {/* Title */}
        <h3
          onClick={handleCardClick}
          className="text-lg font-bold text-gray-900 truncate hover:text-blue-500 hover:underline transition"
        >
          {blog.title}
        </h3>

        {/* Author & Meta Info */}
        <div className="flex items-center justify-between text-gray-600 text-sm">
          <div className="cursor-pointer">
            <BlogAuthor
              name={blog.user.name}
              image={blog.user.image}
              // TODO: Change this to the actual occupation
              occupation={["Software Developer"]}
            />
          </div>
          <p>⏳ {blog.time_to_read} min read</p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {blog.tags.length > 0 &&
            blog.tags.map((tag) => (
              <span
                className="text-xs bg-blue-100 text-blue-800 px-3 py-1 
                rounded-full font-medium hover:bg-blue-200 transition"
                key={tag}
              >
                #{tag}
              </span>
            ))}
        </div>

        {/* Blog Stats */}
        <div className="flex justify-between text-xs text-gray-500">
          <p>📅 {new Date(blog.created_at).toLocaleDateString()}</p>
          <p>👀 {blog.total_views} views</p>
        </div>
      </div>
    </div>
  );
};
