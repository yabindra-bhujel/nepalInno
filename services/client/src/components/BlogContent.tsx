import MarkdownEditor from "@uiw/react-markdown-editor";



export const BlogContent = ({ content }: { content: string }) => {
  return (
    <div data-color-mode="light" className="lg:prose-xl mt-4">
      <MarkdownEditor.Markdown source={content}
      style={{
        padding: "20px",
      }}
       />
    </div>
  );
};
