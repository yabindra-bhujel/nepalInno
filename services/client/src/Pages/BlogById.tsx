import { useState, useEffect } from "react";
import { BlogContent } from "../components/BlogContent";
import { BlogAuthor } from "../components/BlogAuthor";
import { BlogHeroImage } from "../components/BlogHeroImage";
import { BlogTags } from "../components/BlogTags";
import instance from "../config/instance";
import { BlogPost as BlogPostInterface } from "../types/interface/blog-interface";
import { useParams } from "react-router-dom";
import { BlogContentMenu } from "./BlogContentMenu";
import { generateTableOfContents } from "../utils/generate-table-of-contents";

export const Blog = () => {
  const [blogData, setBlogData] = useState<BlogPostInterface[]>([]);
  const { id } = useParams<{ id: string }>();
  const [contentTOC, setContentTOC] = useState<Record<string, string>>({});

  const fetchBlogData = async () => {
    try {
      const response = await instance.get(`/blog/${id}`);
      setBlogData([response.data]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchBlogData();
  }, [id]);

  useEffect(() => {
    if (blogData.length > 0) {
      setContentTOC(generateTableOfContents(blogData[0].content));
    }
  }, [blogData]);

  return (
    <div className="bg-gray-100 min-h-screen py-5 fixed">
      <div className="flex justify-between max-w-8xl mx-auto">
        {/* Left Sidebar */}
        <div className="hidden lg:block w-1/5 ml-4 h-[90vh] overflow-y-auto min-w-[300px]">
        {/* only show if have toc */}
        {Object.keys(contentTOC).length > 0 && (
          <BlogContentMenu tocList={contentTOC} />
        )}
        </div>

        {/* Center Content (スクロール可能) */}
        <div className="w-full px-4 sm:px-6 lg:px-8 bg-white h-[calc(100vh-2rem)] overflow-y-auto mb-4">
          {blogData.map((post) => (
            <BlogPost key={post.id} post={post} />
          ))}
          {blogData.length > 0 && <BlogContent content={blogData[0].content} />}
        </div>

        {/* Right Sidebar */}
        <div className="hidden lg:block w-1/5">
          <p className="ml-20">関連記事</p>
        </div>
      </div>
    </div>
  );
};


const BlogPost = ({ post }: { post: BlogPostInterface }) => {
  console.log(post);
  return (
    <article key={post.title} className="space-y-8">
      {/* Hero Image */}
      {post.thumbnail && <BlogHeroImage image={post.thumbnail} title={post.title} />}

      {/* Title */}
      <h1 className="text-4xl font-bold text-gray-900">{post.title}</h1>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {post.tags &&
          post.tags.map((tag) => <BlogTags key={tag} name={tag} />)}
      </div>

      {/* Author and Date */}
      <div className="flex items-center space-x-3 text-gray-600 text-sm">
        {/* Author Section */}
        <BlogAuthor
          name={post.user.name}
          image={post.user.image}
          occupation={["Author"]}
          showFollowButton={true}
        />
      </div>
    </article>
  );
};
