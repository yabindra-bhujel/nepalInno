import React from "react";
import { Navigation } from "./Navigation";
import MarkdownEditor from "@uiw/react-markdown-editor";

type CreateBlog = {
  title: string;
  content: string;
  tags: string[];
  image?: string;
};

export const CreateBlog = () => {
  const [formData, setFormData] = React.useState<CreateBlog>({
    title: "",
    content: "",
    tags: [],
    image: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTagChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " " || e.key === "Enter") {
      const tag = e.currentTarget.value.trim();
      if (tag && !formData.tags.includes(tag)) {
        setFormData({
          ...formData,
          tags: [...formData.tags, tag],
        });
        e.currentTarget.value = ""; // Clear input after tag is added
      }
    }
  };

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    });
  };

  return (
    <Navigation>
      <div className="bg-white py-8 px-4 sm:px-6 lg:px-8 ">
        {/* Action Buttons - aligned to the right */}
        <div className="flex justify-end space-x-4 mb-4">
          <button
            className="px-8 py-3 bg-indigo-500 text-white rounded-lg shadow-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onClick={() => alert("Blog saved!")}
          >
            Save Blog
          </button>
          <button
            className="px-8 py-3 bg-gray-500 text-white rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
            onClick={() => alert("Post will be published!")}
          >
            Post
          </button>
          <button
            className="px-8 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => alert("Preview your blog!")}
          >
            Preview
          </button>
        </div>

        {/* Title */}
        <div className="mb-6">
          <label htmlFor="title" className="text-lg font-medium text-gray-700">
            Blog Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter your blog title"
            className="w-full p-4 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            aria-label="Blog Title"
          />
        </div>

        {/* Tags */}
        <div className="mb-4">
          <label htmlFor="tags" className="text-lg font-medium text-gray-700">
            Tags
          </label>
          <div className="relative">
            <input
              type="text"
              onKeyDown={handleTagChange}
              placeholder="Add tags (press Space or Enter)"
              className="w-full p-4 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <div className="flex flex-wrap mt-3 gap-2">
              {formData.tags.map((tag, index) => (
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
        </div>

        {/* Content */}
        <div className="mb-6">
          <label
            htmlFor="content"
            className="text-lg font-medium text-gray-700"
          >
            Content
          </label>
          <div
            data-color-mode="light"
            className="mt-2 bg-gray-100 rounded-lg shadow-sm p-4"
          >
            <MarkdownEditor
              data-color-mode="light"
              value={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
              className="rounded-lg shadow-sm min-h-[500px] max-h-full h-auto"
            />
          </div>
        </div>
      </div>
    </Navigation>
  );
};
