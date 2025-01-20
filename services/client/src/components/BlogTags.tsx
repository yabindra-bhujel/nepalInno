
export const BlogTags = (tag:  { name: string } ) => {
  return (
    <>
      <span
        key={tag.name}
        className="text-sm bg-blue-100 text-blue-800 px-3 py-1  font-medium"
      >
        {tag.name}
      </span>
    </>
  );
};