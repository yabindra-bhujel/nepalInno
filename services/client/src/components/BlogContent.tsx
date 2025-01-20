import MarkdownEditor from "@uiw/react-markdown-editor";



export const BlogContent = ({ content }: { content: string }) => {
  return (
    <div data-color-mode="light" className="prose lg:prose-xl">
      <MarkdownEditor.Markdown source={content} />
    </div>
  );
};
