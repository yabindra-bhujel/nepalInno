
type BlogFormProps = {
    formData: any;
    validationError: any;
    handleInputChange: any;
    handleTagChange: any;
    removeTag: any;
}
export const BlogForm = (
    { formData, validationError, handleInputChange, handleTagChange, removeTag }: BlogFormProps
) => {
    return (
      <div>
        {/* Title */}
        <div className="mb-6">
          <label htmlFor="title" className="text-lg font-medium text-gray-700">
            Blog Title
          </label>
          <input
            required
            type="text"
            name="title"
            id="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter your blog title"
            className="w-full p-4 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            aria-label="Blog Title"
          />
          {validationError?.title && (
            <p className="text-red-500 text-sm">{validationError.title}</p>
          )}
        </div>

        {/* Tags */}
        <div className="mb-4">
          <label htmlFor="tags" className="text-lg font-medium text-gray-700">
            Tags
          </label>
          <div className="relative">
            <input
              required
              type="text"
              onKeyDown={handleTagChange}
              placeholder="Add tags (press Space or Enter)"
              className="w-full p-4 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />

            <div className="flex flex-wrap mt-3 gap-2">
              {formData.tags.map((tag: string , index: React.Key) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-indigo-500 text-white rounded-md cursor-pointer hover:bg-indigo-600"
                  onClick={() => removeTag(tag)}
                >
                  {tag} ×
                </span>
              ))}
            </div>
          </div>
          {validationError?.tags && (
            <p className="text-red-500 text-sm">{validationError.tags}</p>
          )}
        </div>
      </div>
    );

}