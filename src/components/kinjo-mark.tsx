/** Aqua conversation badge with original vector lettering for 近. */
export function KinjoMark({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 72 72" fill="none" aria-hidden="true" focusable="false">
      <path className="kinjo-bubble" d="M17 3h38a14 14 0 0 1 14 14v32a14 14 0 0 1-14 14H28L13 69v-7.6A14 14 0 0 1 3 48V17A14 14 0 0 1 17 3Z" fill="#12BFD1" stroke="#062330" strokeWidth="2.5" strokeLinejoin="round" />
      <g transform="translate(4 1) scale(.9)" stroke="#062330" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M49 13 32 18" />
      <path d="M32 18v15c0 8-2 12-6 16" />
      <path d="M32 28h23" />
      <path d="M45 29v21" />
      <path d="M15 16l7 6" />
      <path d="M12 32h10l-5 13h6l-6 9c10 7 22 7 40 5" />
      </g>
    </svg>
  );
}
