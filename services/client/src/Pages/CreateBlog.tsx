import React, { useState, useEffect, useRef } from "react";
import { Navigation } from "./Navigation";
import MarkdownEditor from "@uiw/react-markdown-editor";
import instance from "../config/instance";
// import { BlogPreview } from "./BlogPreview";
// import { AlertMessage } from "../component/messages/AlertMessage";
import { FaImage } from "react-icons/fa";
import { handleImageStorage } from "./UploadImage";

export type CreateBlogType = {
  title: string;
  content: string;
  tags: string[];
  image?: string;
};

export enum MessageType {
  SUCCESS = "success",
  ERROR = "error",
  INFO = "info",
}

export type Message = {
  type: MessageType;
  message: string;
};

export const CreateBlog = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showBlogPreview, setShowBlogPreview] = useState<boolean>(false);
  const localStorageName = "blog";
  const [message, setMessage] = useState<Message>({
    type: MessageType.INFO,
    message: "",
  });
  const [formData, setFormData] = React.useState<CreateBlogType>({
    title: "",
    content: "",
    tags: [],
    image: "",
  });

  const handleShowPreviewChange = () => {
    setShowBlogPreview(!showBlogPreview);
  };

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

  const removeLocalStorage = () => {
    localStorage.removeItem(localStorageName);
  };

  const saveInLocalStorage = () => {
    localStorage.setItem(localStorageName, JSON.stringify(formData));
  };

  const handleSubmit = async () => {
    try {
      const res = await instance.post("/blog", formData);
      if (res.status === 201) {
        removeLocalStorage();
        setFormData({
          title: "",
          content: "",
          tags: [],
          image: "",
        });
        setMessage({
          type: MessageType.SUCCESS,
          message: "Blog posted successfully.",
        });
      }
    } catch (error) {
      setMessage({
        type: MessageType.ERROR,
        message: "An error occurred while posting the blog. Please try again.",
      });
    } finally {
      setTimeout(() => {
        setMessage({
          type: MessageType.INFO,
          message: "",
        });
      }, 5000);
    }
  };

  const handleSave = async () => {
    try {
      const res = await instance.post("/blog/save", formData);
      if (res.status === 201) {
        setMessage({
          type: MessageType.INFO,
          message: "Blog saved successfully.",
        });
      }
    } catch (error) {
      setMessage({
        type: MessageType.ERROR,
        message: "An error occurred while saving the blog. Please try again.",
      });

      saveInLocalStorage();
    } finally {
      setTimeout(() => {
        setMessage({
          type: MessageType.INFO,
          message: "",
        });
      }, 5000);
    }
  };

  useEffect(() => {
    const blog = localStorage.getItem(localStorageName);
    console.log(blog);
    if (blog) {
      setFormData(JSON.parse(blog));
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      saveInLocalStorage();
    }, 30000);

    return () => clearInterval(interval);
  }, [formData]);


    const handleImageUpload = async (file: File) => {
      const imageUrl = await handleImageStorage(file);
      const imageMarkdown = `![${imageUrl}](${imageUrl})`;

      // Insert image markdown at the current cursor position
      setFormData((prev) => ({
        ...prev,
        content: prev.content + "\n" + imageMarkdown,
      }));
    };

    const handleCustomImageClick = () => {
      fileInputRef.current?.click(); // Open file selector
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleImageUpload(file);
      }
    };

  return (
    <Navigation>
      <div className="bg-white py-8 px-4 sm:px-6 lg:px-8 ">
        <div className="flex justify-end space-x-4 mb-4">
          {/* {message.message && <AlertMessage message={message} />} */}

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
            {/* <MarkdownEditor
              data-color-mode="light"
              value={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
              className="rounded-lg shadow-sm min-h-[500px] max-h-full h-auto"
            /> */}

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <MarkdownEditor
              data-color-mode="light"
              value={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
              className="rounded-lg shadow-sm min-h-[500px] max-h-full h-auto"
              toolbars={[
                "bold",
                "italic",
                "header",
                "quote",
                "code",
                "link",
                {
                  name: "image",
                  keyCommand: "image",
                  icon: (
                    <span
                      style={{
                        fontWeight: "bold",
                        cursor: "pointer",
                        color: "blue",
                      }}
                    >
                      <FaImage />
                    </span>
                  ),
                  execute: handleCustomImageClick
                },
              ]}
              toolbarsMode={["preview"]}
            />
          </div>
        </div>
      </div>

      {/* Blog Preview */}
      {/* {showBlogPreview && (
        <BlogPreview
          onClose={handleShowPreviewChange}
          blog={formData}
          onPublish={handleSubmit}
        /> */}
      {/* )} */}
    </Navigation>
  );
};