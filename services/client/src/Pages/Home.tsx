import { useState, useEffect } from "react";
import { Navigation } from "./Navigation";
import instance from "../config/instance";
import { BlogListCard } from "../components/blog/BlogListCard";
import { BlogPost } from "../types/interface/blog-interface";
import { TagList } from "../components/blog/TagList";

export const Home = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [search, setSearch] = useState("");


  const fetchBlogs = async () => {
    try {
      const response = await instance.get("/blog");
      setBlogs([]);
      setBlogs(response.data.blogs);
    } catch (error) {
      console.error(error);
    }
  };

  const searchBlogs = async (param: string) => {
    try {
      const response = await instance.get(
        `/blog/search?query=${encodeURIComponent(param)}`
      );
      // 重複データを排除する
      const uniqueBlogs = Array.from(
        new Set(response.data.blogs.map((blog: { id: string; }) => blog.id))
      ).map((id) => response.data.blogs.find((blog: { id: string; }) => blog.id === id));

      setBlogs(uniqueBlogs);
    } catch (error) {
      console.error(error);
    }
  };

useEffect(() => {
  if (search) {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        searchBlogs(search);
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }
}, [search]);




  useEffect(() => {
    if (!search) {
      fetchBlogs();
    }
  }, [search]);


  const handleTagClick = (tag: string) => {
    setSearch(tag);
    searchBlogs(tag);
  };


  return (
    <Navigation>
      <div className="bg-gray-100 mb-4">
        <div className="flex justify-between max-w-8xl mx-auto ml-5">
          {/* Left */}
          <div className="hidden lg:block w-1/6">
            <div className="bg-white border-b">
              <h3 className="text-xl mt-6 text-gray-400">show something</h3>
            </div>
          </div>

          {/* Center */}
          <div className="w-full lg:max-w-[1000px] px-4 sm:px-6 lg:px-8 bg-white">
            {/* search bar */}
            <div className="hidden lg:block flex justify-center mb-4">
              <div className="w-full">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  type="text"
                  placeholder="Search for blogs"
                  className="w-full px-4 py-2 text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
              {Array.isArray(blogs) &&
                blogs.map((blog) => (
                  <BlogListCard
                    key={blog.id}
                    blog={blog}
                    handleTagClick={handleTagClick}
                  />
                ))}
            </div>
          </div>

          {/* Right */}
          <div className="hidden lg:block w-1/6">
            <div className="bg-white">
              <TagList handleTagClick={handleTagClick} />
            </div>
          </div>
        </div>
      </div>
    </Navigation>
  );
};
