

export const BlogAuthor = (author: {
   name: string; 
   image: string | undefined;
   occupation?: string[];
   showFollowButton?: boolean;
  }) => {
  const { showFollowButton = false } = author;
  return (
    <div className="flex items-center space-x-3">
      {author.image ? (
        <img
          src={author.image}
          alt={author.name}
          className="w-12 h-12 rounded-full border-2 border-gray-300"
        />
      ) : (
        <div className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center text-2xl text-gray-600 font-semibold">
          {author.name.slice(0, 2).toUpperCase()}
        </div>
      )}
      <div>
        <p className="font-semibold text-gray-800">{author.name}</p>
        <p className="text-sm text-gray-500">
          {author.occupation && author.occupation.length > 0
            ? author.occupation.map((occupation) => (
                <span key={occupation} className="mr-2">
                  {occupation}
                </span>
              ))
            : null}
        </p>
        {showFollowButton && (
          <div className="flex space-x-6 mt-2">
            <button className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-md font-medium">
              Follow
            </button>
          </div>
        )}
      </div>
    </div>
  );
};