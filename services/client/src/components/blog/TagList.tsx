import instance from "../../config/instance";
import { useEffect, useState } from "react";

type BlogTag = {
  id: string;
  name: string;
  count: number;
}




export const TagList = (
  props: {
    handleTagClick: (tag: string) => void;
  }

) => {
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [totalTags, setTotalTags] = useState<number>(0);

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

  useEffect(() => {
    setTotalTags(tags.reduce((acc, tag) => acc + tag.count, 0));
  }, [tags]);

  return (
    <div>
      <div className="flex flex-wrap gap-3 mt-4">
        <button
         onClick={() => props.handleTagClick("")}
         className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-600 rounded-md text-sm font-medium hover:bg-blue-200 transition">
          #All {totalTags}
        </button>
        {tags.map((tag, index) => (
          <button
            onClick={() => props.handleTagClick(tag.name)}
            key={index}
            className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-600 rounded-md text-sm font-medium hover:bg-blue-200 transition"
          >
            #{tag.name}
            <span className="text-gray-500 text-xs">
              ({tag.count})
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
