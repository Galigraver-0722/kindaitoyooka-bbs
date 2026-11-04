/** Original vector lettering for 近; no font is needed for the small mark. */
export function KinjoMark({ className = "" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 72 72" fill="none" aria-hidden="true" focusable="false">
    <rect x="2" y="2" width="68" height="68" rx="15" fill="#204a3b" />
    <g stroke="#f7f5ed" strokeWidth="4.5" strokeLinecap="square" strokeLinejoin="round">
      <path d="M49 13 32 18" />
      <path d="M32 18v15c0 8-2 12-6 16" />
      <path d="M32 28h23" />
      <path d="M45 29v21" />
      <path d="M15 16l7 6" />
      <path d="M12 32h10l-5 13h6l-6 9c10 7 22 7 40 5" />
    </g>
    <rect x="59" y="5" width="8" height="8" rx="2" fill="#d5e78e" />
  </svg>;
}
