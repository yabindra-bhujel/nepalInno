import { Navigation } from "./Navigation";
import { CommentList } from "../component/CommentList";
import { BlogFooter } from "../component/BlogFooter";
import { BlogContent } from "../component/BlogContent";
import { BlogAuthor } from "../component/BlogAuthor";
import { blogData } from "./BlogData";
import { BlogHeroImage } from "../component/BlogHeroImage";
import { BlogTags } from "../component/BlogTags";
import { BlogType, RelatedBlogPost } from "../types/BlogType";

export const Blog = () => {
  return (
    <Navigation>
      <div className="bg-gray-100 py-10">
        <div className="flex justify-between max-w-8xl mx-auto">
          {/* Left */}
          <div className="hidden lg:block w-1/6">
          <Advertisement />
          </div>

          {/* Center */}
          <div className="w-full lg:max-w-[800px] px-4 sm:px-6 lg:px-8 bg-white">
            {blogData.map((post) => BlogPost(post))}
          </div>

          {/* Right */}
          <div className="hidden lg:block w-1/3">
          <p className="ml-20">関連記事</p>
            {blogData.map(
              (post) =>
                post.relatedPosts &&
                post.relatedPosts.map((relatedPost) => RelatedBlog(relatedPost))
            )}
          </div>
        </div>
      </div>
    </Navigation>
  );
};


const RelatedBlog = (post: RelatedBlogPost) => {
  return (
    <div className="p-4 bg-white  transition-shadow duration-300 border-b">
      {/* author */}
      <BlogAuthor
        name={post.author.name}
        image={post.author.image}
        occupation={post.author.occupation}
      />

      <div className="flex flex-col mt-4">
        <h3 className="text-gray-900 hover:text-blue-600 transition-colors duration-200 text-lg font-semibold">
          {post.title.length > 80
            ? post.title.slice(0, 80) + "..."
            : post.title}
        </h3>
      </div>

      <div className="flex items-center mt-2 text-gray-600 text-sm">
        {post.postDate && <p>{post.postDate}</p>}
        {post.timeToRead && <p className="ml-2">| {post.timeToRead}</p>}
      </div>
    </div>
  );
};

const Advertisement = () => {
  return (
    <div className="p-6 bg-white shadow-lg rounded-xl border border-gray-200 transition-shadow duration-300 hover:shadow-2xl">
      <h3 className="text-gray-900 hover:text-blue-600 transition-colors duration-200 text-2xl font-semibold mb-3">
        Advertisement
      </h3>
      <div className="bg-gray-100 h-40 rounded-lg mb-4">
        {/* Image placeholder for advertisement */}
        <img
          src="https://via.placeholder.com/500x200"
          alt="Advertisement"
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
      <p className="text-gray-600 text-sm mb-4">
        Discover great deals and offers. Don't miss out on our latest products
        and services!
      </p>
      <button className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200">
        Learn More
      </button>
    </div>
  );
};








const BlogPost = (post: BlogType) => {
  return (
    <article key={post.title} className="space-y-8">
      {/* Hero Image */}
      {post.image && <BlogHeroImage image={post.image} title={post.title} />}

      {/* Title */}
      <h1 className="text-4xl font-bold text-gray-900">{post.title}</h1>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {post.tags &&
          post.tags.map((tag) => <BlogTags key={tag.name} name={tag.name} />)}
      </div>

      {/* Author and Date */}
      <div className="flex items-center space-x-3 text-gray-600 text-sm">
        {/* Author Section */}
        <BlogAuthor name={post.author.name} image={post.author.image}
        occupation={post.author.occupation}
        showFollowButton={true} />
      </div>

      {/* Blog Content */}
      <BlogContent content={post.content} />

      {/* Likes and Comments */}
      <div className="mt-6 flex justify-between items-center border-t pt-4">
        <BlogFooter id={post.id} likes={post.likes} comments={post.comments} />
      </div>
      {CommentList(post.commentsData)}
    </article>
  );
};
