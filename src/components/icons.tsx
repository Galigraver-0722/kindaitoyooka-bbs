type IconProps = {
  size?: number;
  filled?: boolean;
  className?: string;
};

export function HeartIcon({ size = 14, filled = false, className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.35"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M8 13.1S2.6 9.8 2.6 5.9A2.85 2.85 0 0 1 8 4.05a2.85 2.85 0 0 1 5.4 1.85C13.4 9.8 8 13.1 8 13.1Z" />
    </svg>
  );
}

export function BookmarkIcon({ size = 14, filled = false, className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      width={size - 1}
      height={size}
      viewBox="0 0 16 16"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.35"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3.6 2.4h8.8v11.2L8 10.5l-4.4 3.1V2.4Z" />
    </svg>
  );
}

export function ReplyIcon({ size = 13, className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.35"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 3.5h10v7H7.2L4.5 13v-2.5H3v-7Z" />
    </svg>
  );
}

export function SearchIcon({ size = 14, className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      className={className}
    >
      <circle cx="7" cy="7" r="4.3" />
      <path d="m10.2 10.2 3 3" />
    </svg>
  );
}

export function PlusIcon({ size = 18, className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      className={className}
    >
      <path d="M8 3v10M3 8h10" />
    </svg>
  );
}
