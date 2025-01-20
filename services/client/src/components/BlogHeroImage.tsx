export const BlogHeroImage = (post: {image: string, title: string}) => {
    return (
      <img
        src={post.image}
        alt={post.title}
        className="w-full h-72 object-cover rounded-xl shadow-md"
      />
    );
}