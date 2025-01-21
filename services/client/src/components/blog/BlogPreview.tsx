import React from "react";
import { BlogContentMenu } from "../../Pages/BlogContentMenu";
import { BlogHeroImage } from "../BlogHeroImage";
import { BlogTags } from "../BlogTags";
import { BlogAuthor } from "../BlogAuthor";
import { BlogPost as BlogPostInterface } from "../../types/interface/blog-interface";
import { BlogContent } from "../BlogContent";
import { generateTableOfContents } from "../../utils/generate-table-of-contents";

type BlogPreviewProps = {
    isOpen: boolean;
    onClose: () => void;
    onPublish: () => void;
    blogData: any;
}
export const BlogPreview = ({
  isOpen,
  onClose,
  onPublish,
  blogData,
}: BlogPreviewProps) => {
  if (!isOpen) return null;

  const contentTOC = generateTableOfContents(blogData.content || "");

  return (
    <div className="fixed top-0 left-0 w-full h-full z-50 flex items-center justify-end">
      {/* Background overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-gray-800 opacity-50"></div>

      {/* Modal content */}
      <div className="relative w-full bg-white p-6 h-full pointer-events-auto">
        {/* top button */}
        <div className="flex justify-between m-5">
          <button
            className="text-gray-400 hover:text-gray-600 bg-red border border-red-500 rounded-md px-2 py-1"
            onClick={onClose}
          >
            戻る
          </button>
          <button
            onClick={onPublish}
            className="text-gray-400 hover:text-gray-600
            bg-green border border-green-500 rounded-md px-2 py-1"
          >
            公開
          </button>
        </div>

        {/* Blog preview */}
        <div className="flex justify-between max-w-8xl mx-auto">
          {/* Left */}
          <div
            className="hidden lg:block w-1/4 ml-4"
            style={{ height: "90vh", overflowY: "auto" }}
          >
            <BlogContentMenu tocList={contentTOC} />
          </div>

          {/* Center */}
          <div className="w-full lg:max-w-[800px] px-4 sm:px-6 lg:px-8 bg-white h-[calc(100vh-5rem)] overflow-y-auto">
            {blogData && <BlogPost key={blogData.id} post={blogData} />}

            <div className="mt-8">
              <BlogContent content={blogData.content} />
            </div>
          </div>

          {/* Right */}
          <div className="hidden lg:block w-1/3">
            <p className="ml-20">関連記事</p>
          </div>
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
          post.tags.filter((tag: React.Key | null | undefined): tag is string => tag !== null && tag !== undefined)
            .map((tag: string) => <BlogTags key={tag} name={tag} />)}
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


