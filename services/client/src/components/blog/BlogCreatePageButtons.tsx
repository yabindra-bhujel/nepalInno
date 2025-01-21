type BlogCreatePageButtonsProps = {
  handleSave: () => void;
  handleSubmit: () => void;
  handleShowPreviewChange: () => void;
};

export const BlogCreatePageButtons = ({
  handleSave,
  handleSubmit,
  handleShowPreviewChange,
}: BlogCreatePageButtonsProps) => {
  return (
    <>
      <div className="flex justify-end space-x-4 mb-4">
        <button
          onClick={handleSave}
          className="px-3 py-2 text-sm bg-indigo-500 text-white rounded-lg shadow-md hover:bg-indigo-600 
  focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Save Blog
        </button>

        <button
          onClick={handleSubmit}
          className="px-4 py-2 text-sm bg-gray-500 text-white rounded-lg shadow-md 
  hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Post
        </button>

        <button
          onClick={handleShowPreviewChange}
          className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg shadow-md 
  hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Preview
        </button>
      </div>
    </>
  );
};
