import MarkdownEditor from "@uiw/react-markdown-editor";
import { FaImage } from "react-icons/fa";
import { useRef } from "react";

type BlogEditerProps = {
  formData: any;
  setFormData: any;
  validationError: any;
  handleFileChange: any;
};

export const BlogEditer = ({
  formData,
  setFormData,
  validationError,
handleFileChange,
}: BlogEditerProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleCustomImageClick = () => {
    // handle custom image click
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="mb-6">
      <label htmlFor="content" className="text-lg font-medium text-gray-700">
        Content
      </label>
      {validationError?.content && (
        <p className="text-red-500 text-sm">{validationError.content}</p>
      )}
      <div
        data-color-mode="light"
        className="mt-2 bg-gray-100 rounded-lg shadow-sm p-4"
      >
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
              execute: handleCustomImageClick,
            },
          ]}
          toolbarsMode={["preview"]}
        />
      </div>
    </div>
  );
};
