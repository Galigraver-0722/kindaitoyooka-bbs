/** Kinjo branding within the original AQUA POP and SIGNAL layouts. */
export const logoCss = `
:is(.tw-d,.tw-b) .brand-mark{display:block;width:32px;height:32px;flex:none}
.tw-b .brand-mark{width:28px;height:28px}
.tw-b .kinjo-bubble{fill:var(--cyan)}
:is(.tw-d,.tw-b) .skip-link{position:fixed;top:8px;left:12px;z-index:200;padding:10px 16px;background:var(--cyan);color:#062330;border:2px solid #062330;border-radius:8px;transform:translateY(-160%);font-weight:700}
:is(.tw-d,.tw-b) .skip-link:focus{transform:none}
@media(max-width:520px){:is(.tw-d,.tw-b) .brand-mark{width:28px;height:28px}}
`;
