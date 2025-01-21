import React, { useState, useEffect } from "react";
import { Navigation } from "./Navigation";
import instance from "../config/instance";
import { handleImageStorage } from "./UploadImage";
import { BlogPost } from "../types/interface/blog-interface";
import { BlogPreview } from "../components/blog/BlogPreview";
import { useUser } from "../hooks/useUsers";
import { BlogForm } from "../components/blog/BlogForm";
import { BlogEditer } from "../components/blog/BlogEditer";
import { BlogCreatePageButtons } from "../components/blog/BlogCreatePageButtons";
import { useNavigate } from "react-router-dom";


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
    const navigate = useNavigate();
  const [showBlogPreview, setShowBlogPreview] = useState<boolean>(false);
  const localStorageName = "blog";
  const { user } = useUser();
  const [message, setMessage] = useState<Message>({
    type: MessageType.INFO,
    message: "",
  });
  const [validationError, setValidationError] = useState<Record<string, string>>()

 

  const [formData, setFormData] = React.useState<CreateBlogType>({
    title: "",
    content: "",
    tags: [],
    image: "",
  });


  
  const blogPost: BlogPost = {
    id: crypto.randomUUID(),
    title: formData.title,
    content: formData.content,
    tags: formData.tags,
    thumbnail: formData.image,
    is_published: false,
    created_at: new Date().toISOString(),
    time_to_read: 0,
    total_views: 0,
    user: {
      id: user.id,
      email: user.email,
      name: user.full_name,
      image: user.image,
    },
  };


  const handleShowPreviewChange = () => {
    localStorage.setItem(localStorageName, JSON.stringify(formData));
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


  const handleValidation = () => {
    if (!formData.title) {
      setValidationError({ "title": "Please enter a title" });
     
      return false;
    }

    if (!formData.content) {
      setValidationError({ "content": "Please enter a content" });
      return false;
    }

    if (!formData.tags.length) {
      setValidationError({ "tags": "Please enter a tag" });
      return false;
    }

    return true;
  }

  const handleSubmit = async () => {
    if (!handleValidation()) {
      return;
    }
    
    try {
      await instance.post("/blog", formData);
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
        setShowBlogPreview(false);
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
    if (!handleValidation()) {
      return;
    }

    try {
       await instance.post("/blog/save", formData);
        setMessage({
          type: MessageType.INFO,
          message: "Blog saved successfully.",
        });
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleImageUpload(file);
      }
    };

    setTimeout(() => {
      setValidationError({});
    }, 5000);

  return (
    <Navigation>
      <div className="bg-white py-8 px-4 sm:px-6 lg:px-8 ">
        <BlogCreatePageButtons
          handleSave={handleSave}
          handleSubmit={handleSubmit}
          handleShowPreviewChange={handleShowPreviewChange}
        />

        {/* Title */}
        <BlogForm
          formData={formData}
          validationError={validationError}
          handleInputChange={handleInputChange}
          handleTagChange={handleTagChange}
          removeTag={removeTag}
         />

        {/* Content */}
        <BlogEditer
          formData={formData}
          setFormData={setFormData}
          validationError={validationError}
          handleFileChange={handleFileChange}
        />
      </div>

      {showBlogPreview && (
        <BlogPreview
          isOpen={showBlogPreview}
          onClose={handleShowPreviewChange}
          onPublish={handleSubmit}
          blogData={blogPost}
        />
      )}
    </Navigation>
  );
};