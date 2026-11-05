/** Shared motion for the original layouts; no changes to their visual structure. */
export const motionCss = `
:is(.tw-d,.tw-b){--motion-ease:cubic-bezier(.22,1,.36,1);--motion-fast:160ms;--motion-normal:240ms}
:is(.tw-d,.tw-b) :is(.card,.trow,.board-dir>a,.board-nav a,.btn,.nav-btn,.ann-btn,.inbox-btn,.theme-btn,.ava,.fab,.act,.bd-drawer summary,.hub-tabs a,.hub-sort a,.lang button,.drawer-close,.ann-close,.inbox-close){transition:transform var(--motion-normal) var(--motion-ease),box-shadow var(--motion-normal) var(--motion-ease),background-color var(--motion-fast) ease,border-color var(--motion-fast) ease,color var(--motion-fast) ease}
:is(.tw-d,.tw-b) :is(input,textarea,select){transition:border-color var(--motion-fast) ease,box-shadow var(--motion-fast) ease,background-color var(--motion-fast) ease}
:is(.tw-d,.tw-b) :focus-visible{outline-color:var(--cyan);outline-offset:4px}
:is(.tw-d,.tw-b) .scroll-header{transition:transform 300ms var(--motion-ease)}
:is(.tw-d,.tw-b) .scroll-header:focus-within{transform:none}
:is(.tw-d,.tw-b) :is(.ann-panel,.inbox-panel,.bd-drawer[open] .bd-panel){transform-origin:top right;animation:kinjo-panel-in 200ms var(--motion-ease) both;overscroll-behavior:contain}
:is(.tw-d,.tw-b) :is(.ann-panel,.inbox-panel).sheet{transform-origin:bottom center;animation-name:kinjo-sheet-in;animation-duration:260ms}
:is(.tw-d,.tw-b) .drawer-backdrop{animation:kinjo-fade-in 200ms ease both}
:is(.tw-d,.tw-b) .drawer{animation:kinjo-drawer-in 300ms var(--motion-ease) both}
:is(.tw-d,.tw-b) :is(.cover,.feed-cols){animation:kinjo-content-in 360ms var(--motion-ease) both}
:is(.tw-d,.tw-b) .act.pulse{animation:none}
:is(.tw-d,.tw-b) .act.pulse svg{animation:kinjo-reaction 320ms var(--motion-ease)}
:is(.tw-d,.tw-b) .act span{font-variant-numeric:tabular-nums}
:is(.tw-d,.tw-b) :is(.ann-panel,.inbox-panel){scrollbar-width:thin;scrollbar-color:var(--muted) transparent}
@media(hover:hover) and (pointer:fine){
 .tw-d .fab:hover{transform:translate(-2px,-2px)}
 .tw-b .fab:hover{transform:translateY(-2px)}
 :is(.tw-d,.tw-b) :is(.nav-btn,.ann-btn,.inbox-btn,.theme-btn,.ava):hover{transform:translateY(-1px)}
 :is(.tw-d,.tw-b) .hub-tabs a:not(.on):hover{background:color-mix(in srgb,var(--cyan) 12%,var(--bg))}
}
:is(.tw-d,.tw-b) :is(.btn,.nav-btn,.ann-btn,.inbox-btn,.theme-btn,.ava,.fab,.act,.bd-drawer summary):active{transform:translateY(1px) scale(.98);transition-duration:90ms}
@media(hover:none){
 :is(.tw-d,.tw-b) :is(.card,.trow,.board-dir>a,.board-nav a,.btn,.fab,.act):hover{transform:none}
 .tw-d .card:hover{box-shadow:5px 5px 0 var(--line)}
 .tw-d .fab:hover{box-shadow:5px 5px 0 var(--line)}
}
@keyframes kinjo-content-in{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
@keyframes kinjo-panel-in{from{opacity:0;transform:translateY(-6px) scale(.985)}to{opacity:1;transform:none}}
@keyframes kinjo-sheet-in{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
@keyframes kinjo-fade-in{from{opacity:0}to{opacity:1}}
@keyframes kinjo-drawer-in{from{opacity:0;transform:translateX(28px)}to{opacity:1;transform:none}}
@keyframes kinjo-reaction{0%,100%{transform:scale(1)}40%{transform:scale(1.2)}70%{transform:scale(.97)}}
@media(prefers-reduced-motion:reduce){
 :is(.tw-d,.tw-b) *,:is(.tw-d,.tw-b) *::before,:is(.tw-d,.tw-b) *::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}
 :is(.tw-d,.tw-b) :is(.card,.trow,.board-dir>a,.board-nav a,.btn,.nav-btn,.ann-btn,.inbox-btn,.theme-btn,.ava,.fab,.act):is(:hover,:active){transform:none}
}
`;
