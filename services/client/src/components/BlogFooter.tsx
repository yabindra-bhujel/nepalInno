
import { FcLike, FcComments } from "react-icons/fc";
import { FaBookmark } from "react-icons/fa";

export const BlogFooter = (
    post: { id: number, likes: number | undefined, comments: number | undefined }
) => {
    return (
      <div className="flex items-center space-x-4">
        <button className="flex items-center space-x-2 text-gray-700 hover:text-red-500 transition">
          <FcLike size={24} />
          <span className="font-semibold">{post.likes} Likes</span>
        </button>
        <button className="flex items-center space-x-2 text-gray-700 hover:text-blue-500 transition">
          <FcComments size={24} />
          <span className="font-semibold">{post.comments} Comments</span>
        </button>
        <button className="flex items-center space-x-2 text-gray-700 hover:text-green-500 transition">
          <FaBookmark size={24} />
          <span className="font-semibold">Make Bookmark</span>
        </button>
      </div>
    );
}