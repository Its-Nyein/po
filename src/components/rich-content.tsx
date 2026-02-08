import { Link } from "react-router-dom";

interface RichContentProps {
  content: string;
}

const tokenRegex = /(#\w+|@\w+)/g;

export function RichContent({ content }: RichContentProps) {
  const parts = content.split(tokenRegex);

  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("#")) {
          const tag = part.slice(1).toLowerCase();
          return (
            <Link
              key={i}
              to={`/hashtag/${tag}`}
              className="text-primary hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {part}
            </Link>
          );
        }
        if (part.startsWith("@")) {
          const username = part.slice(1).toLowerCase();
          return (
            <Link
              key={i}
              to={`/user/${username}`}
              className="text-primary hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {part}
            </Link>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}
