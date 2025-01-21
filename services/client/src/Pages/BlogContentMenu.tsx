import { useState, useEffect } from "react";

type BlogContentMenuProps = {
  tocList: Record<string, string>;
};

export const BlogContentMenu = ({ tocList }: BlogContentMenuProps) => {
  const [activeAnchor, setActiveAnchor] = useState("");

  // Update active anchor based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      let found = false;
      Object.entries(tocList).forEach(([, anchorLink]) => {
        const section = document.querySelector(anchorLink);
        if (section) {
          const rect = section.getBoundingClientRect();
          // Check if the section is in the viewport (within a threshold)
          if (rect.top >= 0 && rect.top <= window.innerHeight / 2) {
            setActiveAnchor(anchorLink); // Set active TOC item based on current section
            found = true;
          }
        }
      });
      // If no active section found, clear the active state
      if (!found) setActiveAnchor("");
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [tocList]);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
        目次
      </h3>
      <ol className="relative border-l-2 border-gray-200 dark:border-gray-700">
        {Object.entries(tocList).map(([headerText, anchorLink], index) => {
          // Skip rendering for the first item
          if (index === 0) return null;

          const tocText = headerText.slice(0, 50);

          return (
            <li
              className={`mb-8 ms-4 ${
                activeAnchor === anchorLink ? "font-bold text-indigo-600" : ""
              }`}
              key={index}
            >
              <div
                className={`absolute w-3 h-3 rounded-full mt-1.5 -start-1.5 border border-white 
                  ${
                    activeAnchor === anchorLink
                      ? "bg-indigo-600"
                      : "bg-indigo-500 dark:bg-indigo-400"
                  }`}
              ></div>
              <a
                href={anchorLink}
                className={`text-sm font-medium 
    ${activeAnchor === anchorLink ? "text-indigo-600" : "text-white"} 
    dark:${activeAnchor === anchorLink ? "text-indigo-600" : "text-gray-300"} 
    hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline transition-all`}
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector(anchorLink)?.scrollIntoView({
                    behavior: "smooth",
                  });
                  setActiveAnchor(anchorLink); // Manually set active on click
                }}
              >
                {tocText}
                {tocText.length === headerText.length ? "" : "..."}
              </a>
            </li>
          );
        })}
      </ol>
    </div>
  );
};
