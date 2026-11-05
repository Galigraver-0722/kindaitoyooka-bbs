/** Shared interaction polish, appended after each theme's structural styles. */
export const polishCss = `
:is(.tw-d,.tw-b){--ease-out:cubic-bezier(.22,1,.36,1);--focus-ring:#087C90}
.tw-b{--focus-ring:#5AE6EC}
:is(.tw-d,.tw-b) :focus-visible{outline:3px solid var(--focus-ring);outline-offset:4px}
:is(.tw-d,.tw-b) :is(input,textarea,select){transition:border-color .2s ease,box-shadow .2s ease,background-color .2s ease}
:is(.tw-d,.tw-b) :is(input,textarea,select):focus-visible{outline-offset:2px;box-shadow:0 0 0 5px color-mix(in srgb,var(--focus-ring) 12%,transparent)}
:is(.tw-d,.tw-b) :is(button,a,input,textarea,select){-webkit-tap-highlight-color:transparent}
:is(.tw-d,.tw-b) :is(button,[type="submit"]):disabled{cursor:not-allowed;opacity:.5;transform:none;box-shadow:none}
:is(.tw-d,.tw-b) :is(.card,.board-dir>a,.trow){transition:transform .24s var(--ease-out),box-shadow .24s var(--ease-out),background-color .2s ease,border-color .2s ease}
:is(.tw-d,.tw-b) :is(.nav-btn,.ann-btn,.inbox-btn,.act,.fab,.board-nav a){transition:transform .2s var(--ease-out),box-shadow .2s var(--ease-out),background-color .2s ease,color .2s ease,border-color .2s ease}
.tw-d .card{box-shadow:4px 4px 0 var(--line),0 10px 24px -20px rgba(6,35,48,.25)}
.tw-b .card{background:linear-gradient(145deg,rgba(90,230,236,.035),transparent 65%),var(--panel);box-shadow:0 8px 24px -18px rgba(0,0,0,.8)}
:is(.tw-d,.tw-b) :is(.ann-panel,.inbox-panel,.bd-panel){transform-origin:top right;animation:panel-reveal .24s var(--ease-out) both}
:is(.tw-d,.tw-b) :is(.ann-panel,.inbox-panel).sheet{transform-origin:bottom center;animation:sheet-reveal .28s var(--ease-out) both}
:is(.tw-d,.tw-b) .drawer-backdrop{animation:backdrop-reveal .2s ease both;backdrop-filter:blur(4px)}
:is(.tw-d,.tw-b) .drawer{animation:drawer-reveal .32s var(--ease-out) both;overscroll-behavior:contain}
:is(.tw-d,.tw-b) :is(.ann-panel,.inbox-panel){overscroll-behavior:contain;scrollbar-width:thin;scrollbar-color:var(--muted) transparent}
:is(.tw-d,.tw-b) :is(.ann-head,.inbox-head){z-index:1}
:is(.tw-d,.tw-b) :is(.ann-close,.inbox-close){display:grid;place-items:center;min-width:32px;min-height:32px;border-radius:8px;transition:background-color .18s ease,color .18s ease}
:is(.tw-d,.tw-b) :is(.ann-close,.inbox-close):hover{background:color-mix(in srgb,var(--focus-ring) 12%,transparent);color:var(--focus-ring)}
@media (hover:hover) and (pointer:fine){
  .tw-d .card:hover{transform:translate(-2px,-3px);box-shadow:7px 8px 0 var(--line)}
  .tw-b .card:hover{transform:translateY(-3px);border-color:rgba(90,230,236,.5);box-shadow:0 12px 28px -14px rgba(0,0,0,.8),0 0 0 1px rgba(90,230,236,.07)}
  :is(.tw-d,.tw-b) :is(.nav-btn,.ann-btn,.inbox-btn,.fab):hover{transform:translateY(-2px)}
  :is(.tw-d,.tw-b) .board-nav a:hover{transform:translateX(3px)}
}
:is(.tw-d,.tw-b) :is(.nav-btn,.ann-btn,.inbox-btn,.act,.fab):active{transform:translateY(1px) scale(.97)}
@keyframes panel-reveal{from{opacity:0;transform:translateY(-8px) scale(.98)}to{opacity:1;transform:none}}
@keyframes sheet-reveal{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
@keyframes backdrop-reveal{from{opacity:0}to{opacity:1}}
@keyframes drawer-reveal{from{opacity:0;transform:translateX(36px)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){
  :is(.tw-d,.tw-b) *, :is(.tw-d,.tw-b) *::before, :is(.tw-d,.tw-b) *::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}
  :is(.tw-d,.tw-b) :is(.card,.board-dir>a,.nav-btn,.ann-btn,.inbox-btn,.act,.fab,.board-nav a):is(:hover,:active){transform:none}
}
`;
