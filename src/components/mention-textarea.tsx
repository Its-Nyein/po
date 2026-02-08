import { useFollowingUsers } from "@/api/queries/follow.queries";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { User } from "@/types/user";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

type MentionTextareaProps = React.ComponentProps<typeof Textarea>;

export const MentionTextarea = forwardRef<
  HTMLTextAreaElement,
  MentionTextareaProps
>(({ onChange, onKeyDown, ...props }, ref) => {
  const innerRef = useRef<HTMLTextAreaElement>(null);
  useImperativeHandle(ref, () => innerRef.current as HTMLTextAreaElement);

  const { data: users = [] } = useFollowingUsers();

  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const getMentionQuery = useCallback(() => {
    const textarea = innerRef.current;
    if (!textarea) return null;
    const text = textarea.value;
    const cursor = textarea.selectionStart;
    const beforeCursor = text.slice(0, cursor);
    const match = beforeCursor.match(/@(\w*)$/);
    return match ? match[1] : null;
  }, []);

  const updateDropdownPosition = useCallback(() => {
    const textarea = innerRef.current;
    if (!textarea) return;
    setDropdownPosition({
      top: textarea.offsetHeight + 4,
      left: 0,
    });
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const query = getMentionQuery();
      setMentionQuery(query);

      if (query !== null) {
        const q = query.toLowerCase();
        const matched = (users as User[]).filter(
          (u) =>
            u.username.toLowerCase().includes(q) ||
            u.name.toLowerCase().includes(q),
        );
        setFilteredUsers(matched);
        setHighlightIndex(0);
        updateDropdownPosition();
      } else {
        setFilteredUsers([]);
      }

      onChange?.(e);
    },
    [getMentionQuery, onChange, users, updateDropdownPosition],
  );

  const insertMention = useCallback((username: string) => {
    const textarea = innerRef.current;
    if (!textarea) return;
    const text = textarea.value;
    const cursor = textarea.selectionStart;
    const beforeCursor = text.slice(0, cursor);
    const afterCursor = text.slice(cursor);
    const matchStart = beforeCursor.lastIndexOf("@");
    const newText =
      beforeCursor.slice(0, matchStart) + `@${username} ` + afterCursor;
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLTextAreaElement.prototype,
      "value",
    )?.set;
    nativeInputValueSetter?.call(textarea, newText);
    textarea.dispatchEvent(new Event("input", { bubbles: true }));

    const newCursor = matchStart + username.length + 2;
    textarea.setSelectionRange(newCursor, newCursor);
    textarea.focus();

    setMentionQuery(null);
    setFilteredUsers([]);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (mentionQuery !== null && filteredUsers.length > 0) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setHighlightIndex((i) => Math.min(i + 1, filteredUsers.length - 1));
          return;
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          setHighlightIndex((i) => Math.max(i - 1, 0));
          return;
        }
        if (e.key === "Enter") {
          e.preventDefault();
          insertMention(filteredUsers[highlightIndex].username);
          return;
        }
      }
      if (e.key === "Escape" && mentionQuery !== null) {
        e.preventDefault();
        setMentionQuery(null);
        setFilteredUsers([]);
        return;
      }
      onKeyDown?.(e);
    },
    [mentionQuery, filteredUsers, highlightIndex, insertMention, onKeyDown],
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setMentionQuery(null);
        setFilteredUsers([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showDropdown = mentionQuery !== null && filteredUsers.length > 0;

  return (
    <div ref={containerRef} className="relative">
      <Textarea
        ref={innerRef}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        {...props}
      />
      {showDropdown && (
        <div
          className="absolute z-50 max-h-48 w-64 overflow-y-auto rounded-md border border-cyan-800/50 bg-[#0a0a0f] shadow-lg shadow-cyan-500/10"
          style={{ top: dropdownPosition.top, left: dropdownPosition.left }}
        >
          {filteredUsers.map((user, index) => (
            <button
              key={user.id}
              type="button"
              className={cn(
                "flex w-full flex-col px-3 py-2 text-left text-sm transition-colors",
                index === highlightIndex
                  ? "bg-cyan-500/20 text-cyan-300"
                  : "text-gray-300 hover:bg-cyan-500/10",
              )}
              onMouseDown={(e) => {
                e.preventDefault();
                insertMention(user.username);
              }}
              onMouseEnter={() => setHighlightIndex(index)}
            >
              <span className="font-medium">{user.name}</span>
              <span className="text-xs text-gray-500">@{user.username}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
});

MentionTextarea.displayName = "MentionTextarea";
