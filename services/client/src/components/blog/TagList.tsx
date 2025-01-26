import instance from "../../config/instance";
import { useEffect, useState } from "react";

export const TagList = () => {
  const [tags, setTags] = useState<string[]>([]);

  const fetchTags = async () => {
    try {
      const response = await instance.get("blog/tags");
      setTags(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  return (
    <div>
      <h3 className="text-xl mt-6 text-gray-600 font-semibold">Tags</h3>
      <div className="flex flex-wrap gap-3 mt-4">
        {tags.map((tag, index) => (
          <button
            key={index}
            className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-600 rounded-md text-sm font-medium hover:bg-blue-200 transition"
          >
            #{tag}
            <span className="text-gray-500 text-xs">
              ({Math.floor(Math.random() * 100)})
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
