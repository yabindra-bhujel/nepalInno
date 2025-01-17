interface LinkItemProps {
  href: string;
  text: string;
}

export const LinkItem: React.FC<LinkItemProps> = ({ href, text }) => {
  return (
      <a href={href} className="hover:text-gray-300">
        {text}
      </a>
  );
};
