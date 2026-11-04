/** Kinjo's neighborhood layer sits on the rounded campus commons design. */
export const kinjoCss = `
.tw-d{--bg:#f8f9f5;--hero:#e8f2e8;--cyan:#afe5bf;--sky:#e6f3e8;--cyan-deep:#28634b;--focus-ring:#28634b;--line:#dce5dc}
.tw-b{--hero:#18322e;--cyan:#ade5bd;--sky:#233f35;--cyan-deep:#ade5bd;--focus-ring:#ade5bd}
:is(.tw-d,.tw-b) .kinjo-wordmark{font-size:28px;letter-spacing:-.06em;font-weight:750;line-height:1}
:is(.tw-d,.tw-b) .brand-sub{font-size:7px;letter-spacing:.13em;font-weight:600;line-height:1.2;margin-top:7px}
:is(.tw-d,.tw-b) .brand-symbol{background:var(--cyan);border-radius:50% 50% 12px 12px;transform:none;width:42px;height:44px;font-size:22px}
:is(.tw-d,.tw-b) .cover{margin-bottom:24px;background:radial-gradient(ellipse at 85% 15%,color-mix(in srgb,var(--cyan) 35%,transparent),transparent 65%),var(--hero)}
:is(.tw-d,.tw-b) .cover h1{font-size:clamp(34px,4.3vw,56px);letter-spacing:-.045em}
:is(.tw-d,.tw-b) .hero-stats{border-top:1px solid color-mix(in srgb,var(--cyan-deep) 15%,transparent);padding-top:18px}
:is(.tw-d,.tw-b) .kinjo-village{position:relative;isolation:isolate;height:300px;min-width:0}
:is(.tw-d,.tw-b) .village-sun{position:absolute;right:18%;top:5%;width:62px;height:62px;background:#f2d99b;border-radius:50%;box-shadow:0 0 0 12px #f2d99b18}
:is(.tw-d,.tw-b) .village-ring{position:absolute;inset:6% -3%;border:1px dashed color-mix(in srgb,var(--cyan-deep) 23%,transparent);border-radius:50%;rotate:-18deg}
:is(.tw-d,.tw-b) .village-path{position:absolute;inset:0;width:100%;height:100%;overflow:visible;z-index:-1}
:is(.tw-d,.tw-b) .village-path path{fill:none;stroke:var(--cyan-deep);stroke-width:2;stroke-dasharray:4 8;opacity:.35}
:is(.tw-d,.tw-b) .village-house{position:absolute;border-radius:5px 5px 10px 10px;box-shadow:0 18px 30px -20px #183e3a80;border:1px solid #142d3815}
:is(.tw-d,.tw-b) .house-one{left:12%;top:39%;width:110px;height:124px;background:#fffaf0;rotate:-7deg;z-index:2}
:is(.tw-d,.tw-b) .house-two{left:48%;top:47%;width:90px;height:112px;background:#b6d3da;rotate:6deg;z-index:3}
:is(.tw-d,.tw-b) .house-three{left:38%;top:23%;width:76px;height:97px;background:#d2dfbe;rotate:2deg;z-index:1}
:is(.tw-d,.tw-b) .house-roof{position:absolute;left:-11%;width:122%;height:55px;top:-39px;background:#658c7d;clip-path:polygon(50% 0,100% 85%,100% 100%,0 100%,0 85%)}
:is(.tw-d,.tw-b) .house-two .house-roof{background:#467482}
:is(.tw-d,.tw-b) .house-three .house-roof{background:#a6b28a}
:is(.tw-d,.tw-b) .house-windows{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;padding:20px 20px 0}
:is(.tw-d,.tw-b) .house-windows i{height:18px;background:#f1dca6;border:3px solid #fff8;box-shadow:inset 1px 0 #183e3a20;border-radius:3px}
:is(.tw-d,.tw-b) .house-door{position:absolute;bottom:0;left:37%;height:33%;width:25%;border-radius:20px 20px 0 0;background:#658c7d}
:is(.tw-d,.tw-b) .house-door::after{content:"";position:absolute;right:4px;top:55%;width:3px;height:3px;background:#f5e8b9;border-radius:50%}
:is(.tw-d,.tw-b) .village-message{position:absolute;top:3%;left:0;padding:12px 15px;background:var(--paper);color:var(--ink);border:1px solid var(--line);border-radius:14px 14px 14px 3px;box-shadow:var(--shadow);font-size:12px;font-weight:650;rotate:-5deg;z-index:4}
:is(.tw-d,.tw-b) .village-message span{color:var(--cyan-deep);margin-left:8px}
:is(.tw-d,.tw-b) .village-tree{position:absolute;font-size:60px;line-height:1;color:#6e9a7d}
:is(.tw-d,.tw-b) .tree-one{left:0;bottom:13%;rotate:-15deg}
:is(.tw-d,.tw-b) .tree-two{right:3%;bottom:21%;font-size:76px;rotate:10deg}
:is(.tw-d,.tw-b) .village-caption{position:absolute;bottom:0;left:0;right:0;text-align:center;font-size:8px;letter-spacing:.15em;color:var(--muted)}
:is(.tw-d,.tw-b) .neighborhood-dashboard{display:grid;grid-template-columns:1.25fr 1fr;gap:20px;margin-bottom:44px}
:is(.tw-d,.tw-b) .neighborhood-panel{padding:24px;background:var(--paper);border:1px solid var(--line);border-radius:20px;min-width:0}
:is(.tw-d,.tw-b) .neighborhood-panel-head{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px}
:is(.tw-d,.tw-b) .neighborhood-panel h3{font-size:14px;font-weight:650;letter-spacing:-.02em}
:is(.tw-d,.tw-b) .chart-range{display:flex;padding:3px;gap:3px;background:var(--bg);border:1px solid var(--line);border-radius:9px}
:is(.tw-d,.tw-b) .chart-range button{font-size:10px;min-height:30px;padding:4px 9px;border-radius:6px;color:var(--muted)}
:is(.tw-d,.tw-b) .chart-range button[aria-pressed=true]{background:var(--sky);color:var(--cyan-deep);font-weight:700}
:is(.tw-d,.tw-b) .chart-total{margin-top:12px;font-size:11px;color:var(--muted)}
:is(.tw-d,.tw-b) .chart-total b{font-size:28px;line-height:1;letter-spacing:-.05em;color:var(--ink);font-weight:650;margin-right:4px}
:is(.tw-d,.tw-b) .kinjo-bars{display:flex;align-items:end;gap:8px;height:110px;margin:22px 0 12px}
:is(.tw-d,.tw-b) .kinjo-day{display:flex;flex-direction:column;align-items:center;flex:1;height:100%;gap:7px}
:is(.tw-d,.tw-b) .kinjo-bar-track{position:relative;width:100%;height:100%;display:flex;align-items:end;justify-content:center;border-bottom:1px solid var(--line);background:repeating-linear-gradient(to top,transparent 0 30px,var(--line-soft) 30px 31px);border-radius:5px 5px 0 0}
:is(.tw-d,.tw-b) .kinjo-bar-track i{display:block;width:70%;background:var(--cyan);border-radius:5px 5px 0 0;transform-origin:bottom}
:is(.tw-d,.tw-b) .kinjo-day:nth-child(3n) .kinjo-bar-track i{background:#b6d3da}
:is(.tw-d,.tw-b) .kinjo-bar-value{position:absolute;top:-19px;font-size:10px;color:var(--cyan-deep);opacity:0;transition:opacity .18s}
:is(.tw-d,.tw-b) .kinjo-bar-track:is(:hover,:focus-visible) .kinjo-bar-value{opacity:1}
:is(.tw-d,.tw-b) .kinjo-day-label{font-family:var(--mono);font-size:9px;color:var(--muted)}
:is(.tw-d,.tw-b) .chart-caption{font-size:11px;color:var(--muted);line-height:1.7;margin-top:10px}
:is(.tw-d,.tw-b) .board-chart-list{display:grid;gap:12px;margin-top:18px}
:is(.tw-d,.tw-b) .board-chart-row{display:grid;grid-template-columns:1fr auto;gap:5px 12px;font-size:11px;color:var(--ink-2)}
:is(.tw-d,.tw-b) .board-chart-row:hover{color:var(--cyan-deep)}
:is(.tw-d,.tw-b) .board-chart-row b{font-family:var(--mono);font-size:10px;font-weight:500}
:is(.tw-d,.tw-b) .board-chart-track{grid-column:1/-1;height:5px;background:var(--bg);border-radius:8px;overflow:hidden}
:is(.tw-d,.tw-b) .board-chart-track i{display:block;height:100%;background:var(--cyan);border-radius:8px;transform-origin:left}
:is(.tw-d,.tw-b) .board-chart-row:nth-child(2n) i{background:#b6d3da}
:is(.tw-d,.tw-b) .kinjo-story{display:flex;align-items:center;gap:28px;margin-top:56px;padding:32px;border:1px solid var(--line);border-radius:24px;background:var(--hero)}
:is(.tw-d,.tw-b) .story-symbol{display:grid;place-items:center;width:80px;height:90px;flex:none;background:var(--cyan);color:#234b3a;border-radius:50% 50% 18px 18px;font-size:40px;rotate:-5deg}
:is(.tw-d,.tw-b) .kinjo-story h2{font-size:24px;letter-spacing:-.035em;margin-top:10px}
:is(.tw-d,.tw-b) .kinjo-story p:not(.hero-eyebrow){font-size:13px;color:var(--ink-2);max-width:65ch;line-height:1.9;margin-top:10px}
:is(.tw-d,.tw-b) .kinjo-story a{display:inline-flex;align-items:center;gap:16px;font-size:12px;font-weight:650;color:var(--cyan-deep);margin-top:14px;text-decoration:underline;text-underline-offset:5px}
:is(.tw-d,.tw-b) main.kinjo-about{max-width:900px}
:is(.tw-d,.tw-b) .kinjo-quote{font-size:clamp(21px,3vw,30px);line-height:1.6;font-weight:600;letter-spacing:-.025em;border-left:3px solid var(--cyan-deep);padding:12px 24px;margin:36px 0;color:var(--cyan-deep)}
@media(prefers-reduced-motion:no-preference){
 :is(.tw-d,.tw-b) .kinjo-village{animation:commons-enter .7s both}
 :is(.tw-d,.tw-b) .village-message{animation:kinjo-float 5s ease-in-out 2}
 :is(.tw-d,.tw-b) .village-path path{animation:kinjo-path 4s linear 2}
 :is(.tw-d,.tw-b) .kinjo-bar-track i{animation:kinjo-grow .5s var(--ease-out) both}
 :is(.tw-d,.tw-b) .board-chart-track i{animation:kinjo-width .7s .15s var(--ease-out) both}
}
@keyframes kinjo-float{0%,100%{translate:0 0}50%{translate:0 -6px}}
@keyframes kinjo-path{to{stroke-dashoffset:-48}}
@keyframes kinjo-grow{from{transform:scaleY(0)}to{transform:scaleY(1)}}
@keyframes kinjo-width{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@media(max-width:800px){
 :is(.tw-d,.tw-b) .cover{grid-template-columns:1fr 220px;gap:12px;padding:28px}
 :is(.tw-d,.tw-b) .kinjo-village{height:240px}
 :is(.tw-d,.tw-b) .village-house{scale:.8;transform-origin:bottom left}
 :is(.tw-d,.tw-b) .village-message{font-size:10px;padding:8px 10px}
 :is(.tw-d,.tw-b) .neighborhood-dashboard{gap:14px}
 :is(.tw-d,.tw-b) .neighborhood-panel{padding:20px}
}
@media(max-width:580px){
 :is(.tw-d,.tw-b) .cover{grid-template-columns:1fr;padding:26px 22px}
 :is(.tw-d,.tw-b) .kinjo-village{height:210px;width:260px;max-width:100%;margin:18px auto 0}
 :is(.tw-d,.tw-b) .village-caption{font-size:7px;bottom:-8px}
 :is(.tw-d,.tw-b) .cover h1{font-size:34px}
 :is(.tw-d,.tw-b) .neighborhood-dashboard{grid-template-columns:1fr;margin-bottom:30px}
 :is(.tw-d,.tw-b) .kinjo-bars{gap:5px}
 :is(.tw-d,.tw-b) .kinjo-day-label{font-size:8px}
 :is(.tw-d,.tw-b) .kinjo-story{padding:24px;gap:16px;align-items:start}
 :is(.tw-d,.tw-b) .story-symbol{width:42px;height:50px;font-size:24px}
 :is(.tw-d,.tw-b) .kinjo-story h2{font-size:21px}
 :is(.tw-d,.tw-b) .kinjo-wordmark{font-size:23px}
}
@media(prefers-reduced-motion:reduce){:is(.tw-d,.tw-b) *{animation:none!important;transition:none!important}}
`;
