import { useState, useEffect } from "react";
import { Navigation } from "./Navigation";
import instance from "../config/instance";
import { BlogListCard } from "../components/blog/BlogListCard";
import { BlogPost } from "../types/interface/blog-interface";
import { TagList } from "../components/blog/TagList";

export const Home = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);

  const fetchBlogs = async () => {
    try {
      const response = await instance.get("/blog");
      setBlogs(response.data.blogs);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <Navigation>
      <div className="bg-gray-100 py-10">
        <div className="flex justify-between max-w-8xl mx-auto ml-5">
          {/* Left */}
          <div className="hidden lg:block w-1/6">
            <div className="bg-white border-b">
              <h3 className="text-xl mt-6 text-gray-400">show something</h3>
            </div>
          </div>

          {/* Center */}
          <div className="w-full lg:max-w-[1000px] px-4 sm:px-6 lg:px-8 bg-white">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
              {Array.isArray(blogs) &&
                blogs.map((blog) => <BlogListCard key={blog.id} blog={blog} />)}
            </div>
          </div>

          {/* Right */}
          <div className="hidden lg:block w-1/6">
            <div className="bg-white">
              <TagList />
            </div>
          </div>
        </div>
      </div>
    </Navigation>
  );
};
