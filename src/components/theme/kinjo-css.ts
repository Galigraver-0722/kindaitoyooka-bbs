/** Kinjo's neighborhood layer sits on the rounded campus commons design. */
export const kinjoCss = `
.tw-d{--bg:#f8f9f5;--hero:#e8f2e8;--cyan:#afe5bf;--sky:#e6f3e8;--cyan-deep:#28634b;--focus-ring:#28634b;--line:#dce5dc}
.tw-b{--hero:#18322e;--cyan:#ade5bd;--sky:#233f35;--cyan-deep:#ade5bd;--focus-ring:#ade5bd}
:is(.tw-d,.tw-b) .kinjo-wordmark{font-size:28px;letter-spacing:-.06em;font-weight:750;line-height:1}
:is(.tw-d,.tw-b) .brand-sub{font-size:10px;letter-spacing:.01em;font-weight:450;line-height:1.3;margin-top:6px}
:is(.tw-d,.tw-b) .brand-symbol{background:var(--cyan);border-radius:50% 50% 12px 12px;transform:none;width:42px;height:44px;font-size:22px}
:is(.tw-d,.tw-b) .cover{margin:28px 0 36px;padding:30px 38px;gap:36px;border:0;border-radius:18px;background:var(--hero);grid-template-columns:minmax(0,1.5fr) minmax(220px,.8fr)}
:is(.tw-d,.tw-b) .cover h1{font-size:clamp(30px,3.3vw,43px);line-height:1.28;letter-spacing:-.035em}
:is(.tw-d,.tw-b) .hero-stats{border-top:0;padding-top:0;margin-top:20px;gap:16px}
:is(.tw-d,.tw-b) .kinjo-village{position:relative;isolation:isolate;height:220px;min-width:0}
:is(.tw-d,.tw-b) .village-sun{position:absolute;right:12%;top:8%;width:36px;height:36px;background:#e8d5a9;border-radius:50%}
:is(.tw-d,.tw-b) .village-path{position:absolute;inset:0;width:100%;height:100%;overflow:visible;z-index:-1}
:is(.tw-d,.tw-b) .village-path path{fill:none;stroke:var(--cyan-deep);stroke-width:1.5;opacity:.2}
:is(.tw-d,.tw-b) .village-house{position:absolute;border-radius:5px 5px 10px 10px;box-shadow:0 5px 10px -7px #183e3a40;border:1px solid #142d3815}
:is(.tw-d,.tw-b) .house-one{left:9%;bottom:27px;width:96px;height:105px;background:#fffaf0;z-index:2}
:is(.tw-d,.tw-b) .house-two{left:49%;bottom:25px;width:83px;height:116px;background:#b6d3da;z-index:3}
:is(.tw-d,.tw-b) .house-three{left:33%;bottom:42px;width:70px;height:114px;background:#d2dfbe;z-index:1}
:is(.tw-d,.tw-b) .house-roof{position:absolute;left:-11%;width:122%;height:55px;top:-39px;background:#658c7d;clip-path:polygon(50% 0,100% 85%,100% 100%,0 100%,0 85%)}
:is(.tw-d,.tw-b) .house-two .house-roof{background:#467482}
:is(.tw-d,.tw-b) .house-three .house-roof{background:#a6b28a}
:is(.tw-d,.tw-b) .house-windows{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;padding:20px 20px 0}
:is(.tw-d,.tw-b) .house-windows i{height:18px;background:#f1dca6;border:3px solid #fff8;box-shadow:inset 1px 0 #183e3a20;border-radius:3px}
:is(.tw-d,.tw-b) .house-door{position:absolute;bottom:0;left:37%;height:33%;width:25%;border-radius:20px 20px 0 0;background:#658c7d}
:is(.tw-d,.tw-b) .house-door::after{content:"";position:absolute;right:4px;top:55%;width:3px;height:3px;background:#f5e8b9;border-radius:50%}
:is(.tw-d,.tw-b) .village-tree{position:absolute;width:34px;height:70px;overflow:visible}
:is(.tw-d,.tw-b) .tree-one{left:-4%;bottom:16px}
:is(.tw-d,.tw-b) .tree-two{right:-4%;bottom:20px;width:42px;height:82px}
:is(.tw-d,.tw-b) .neighborhood-dashboard{display:grid;grid-template-columns:1.25fr 1fr;gap:40px;margin:42px 0 0;padding-top:26px;border-top:1px solid var(--line)}
:is(.tw-d,.tw-b) .neighborhood-panel{padding:0;background:none;border:0;border-radius:0;min-width:0}
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
:is(.tw-d,.tw-b) .kinjo-day .kinjo-bar-track i{background:var(--cyan)}
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

:is(.tw-d,.tw-b) .kinjo-story{display:block;margin-top:36px;padding:26px 0 0;border:0;border-top:1px solid var(--line);border-radius:0;background:none}
:is(.tw-d,.tw-b) .kinjo-story a{display:inline-flex;align-items:center;gap:16px;font-size:12px;font-weight:650;color:var(--cyan-deep);margin-top:14px;text-decoration:underline;text-underline-offset:5px}
:is(.tw-d,.tw-b) main.kinjo-about{max-width:900px}
:is(.tw-d,.tw-b) .kinjo-quote{font-size:clamp(21px,3vw,30px);line-height:1.6;font-weight:600;letter-spacing:-.025em;border-left:3px solid var(--cyan-deep);padding:12px 24px;margin:36px 0;color:var(--cyan-deep)}
@media(prefers-reduced-motion:no-preference){
 :is(.tw-d,.tw-b) .kinjo-village{animation:commons-enter .7s both}
 :is(.tw-d,.tw-b) .village-path path{animation:none}
 :is(.tw-d,.tw-b) .kinjo-bar-track i{animation:kinjo-grow .5s var(--ease-out) both}
 :is(.tw-d,.tw-b) .board-chart-track i{animation:kinjo-width .7s .15s var(--ease-out) both}
}
@keyframes kinjo-grow{from{transform:scaleY(0)}to{transform:scaleY(1)}}
@keyframes kinjo-width{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@media(max-width:800px){
 :is(.tw-d,.tw-b) .cover{grid-template-columns:1fr 190px;gap:18px;padding:26px}
 :is(.tw-d,.tw-b) .kinjo-village{height:210px}
 :is(.tw-d,.tw-b) .village-house{scale:.8;transform-origin:bottom left}
 :is(.tw-d,.tw-b) .neighborhood-dashboard{gap:14px}
 :is(.tw-d,.tw-b) .neighborhood-panel{padding:0}
}
@media(max-width:580px){
 :is(.tw-d,.tw-b) .cover{grid-template-columns:1fr;padding:26px 22px}
 :is(.tw-d,.tw-b) .kinjo-village{height:150px;width:230px;max-width:100%;margin:4px auto 0}
 :is(.tw-d,.tw-b) .cover h1{font-size:29px}
 :is(.tw-d,.tw-b) .neighborhood-dashboard{grid-template-columns:1fr;gap:30px;margin-top:30px}
 :is(.tw-d,.tw-b) .kinjo-bars{gap:5px}
 :is(.tw-d,.tw-b) .kinjo-day-label{font-size:8px}
 :is(.tw-d,.tw-b) .kinjo-story{padding:22px 0 0}
 :is(.tw-d,.tw-b) .kinjo-wordmark{font-size:23px}
}
@media(prefers-reduced-motion:reduce){:is(.tw-d,.tw-b) *{animation:none!important;transition:none!important}}

:is(.tw-d,.tw-b) .tree-leaves{fill:#87a58b}
:is(.tw-d,.tw-b) .tree-trunk{fill:none;stroke:#55745e;stroke-width:2;stroke-linecap:round}
:is(.tw-d,.tw-b) .cover .lede{font-size:14px;line-height:1.85;max-width:46ch;margin-top:14px}
:is(.tw-d,.tw-b) .hero-eyebrow{font-size:11px;letter-spacing:.02em;font-weight:550}
:is(.tw-d,.tw-b) .hero-actions{margin-top:20px;gap:18px}
:is(.tw-d,.tw-b) .hero-actions .btn{min-height:40px;padding:9px 15px;font-size:12px}
:is(.tw-d,.tw-b) .card{min-height:195px;border-radius:13px;padding:20px 21px;box-shadow:none}
:is(.tw-d,.tw-b) .card-top{margin-bottom:12px}
:is(.tw-d,.tw-b) .card h3{font-size:17px;font-weight:650;letter-spacing:-.015em;line-height:1.6}
:is(.tw-d,.tw-b) .card-foot{border-top:0;padding-top:12px;gap:8px}
:is(.tw-d,.tw-b) .card .excerpt{font-size:13px;line-height:1.85}
:is(.tw-d,.tw-b) .card .tags{margin:10px 0}
:is(.tw-d,.tw-b) .card .bo{background:none;color:var(--cyan-deep);padding:0;font-size:11px;border-radius:0}
:is(.tw-d,.tw-b) .card .bo i{width:4px;height:4px;background:var(--cyan-deep);border-radius:50%;margin-right:2px}
:is(.tw-d,.tw-b) .card .who{font-size:11px}
:is(.tw-d,.tw-b) .card .act{background:none}
:is(.tw-d,.tw-b) .card .act:hover{background:var(--sky)}
:is(.tw-d,.tw-b) .feed-bar h2{font-size:20px}
:is(.tw-d,.tw-b) .kinjo-story h2{font-size:17px;font-weight:600;letter-spacing:-.015em}
:is(.tw-d,.tw-b) .kinjo-story p{font-size:13px;color:var(--muted);max-width:66ch;line-height:1.9;margin-top:9px}
:is(.tw-d,.tw-b) .kinjo-story a{margin-top:10px;font-weight:500}
:is(.tw-d,.tw-b) .commons-footer{padding-top:26px;padding-bottom:84px}
:is(.tw-d,.tw-b) .commons-footer strong{font-weight:650;letter-spacing:.02em}
@media(hover:hover) and (pointer:fine){:is(.tw-d,.tw-b) .card:hover{transform:translateY(-1px);box-shadow:0 4px 12px -8px #183e3a30;border-color:color-mix(in srgb,var(--cyan-deep) 35%,var(--line))}}
@media(prefers-reduced-motion:no-preference){
 :is(.tw-d,.tw-b) .cards>.card{animation:none}
 :is(.tw-d,.tw-b) .kinjo-village{animation:commons-enter .4s both}
}
@media(max-width:580px){
 :is(.tw-d,.tw-b) .cover{margin-top:18px;margin-bottom:26px;border-radius:14px;padding:24px 22px}
 :is(.tw-d,.tw-b) .village-house{scale:.65}
 :is(.tw-d,.tw-b) .house-one{bottom:15px}
 :is(.tw-d,.tw-b) .house-two{bottom:15px}
 :is(.tw-d,.tw-b) .house-three{bottom:24px}
 :is(.tw-d,.tw-b) .village-sun{width:28px;height:28px;right:14%}
 :is(.tw-d,.tw-b) .village-tree{scale:.75;bottom:8px}
 :is(.tw-d,.tw-b) .kinjo-bars{margin-top:18px}
 :is(.tw-d,.tw-b) .card{min-height:0;padding:19px;border-radius:13px}
}

:is(.tw-d,.tw-b) main.feed-only{padding-top:32px}
:is(.tw-d,.tw-b) .card .metric{display:inline-flex;align-items:center;gap:5px;font-size:11px;white-space:nowrap;padding:0;flex:none}
:is(.tw-d,.tw-b) .card .who{flex-wrap:wrap;overflow-wrap:anywhere;line-height:1.6}
:is(.tw-d,.tw-b) .side-title{font-family:var(--sans);font-size:12px;letter-spacing:0;font-weight:600}
@media(max-width:580px){
 :is(.tw-d,.tw-b) .kinjo-village{height:115px;margin-top:0}
 :is(.tw-d,.tw-b) .village-house{scale:.55}
 :is(.tw-d,.tw-b) .hero-stats{display:none}
 :is(.tw-d,.tw-b) .village-sun{width:24px;height:24px;top:0}
 :is(.tw-d,.tw-b) .card .who{flex-basis:100%}
 :is(.tw-d,.tw-b) .card-foot .acts{margin-left:auto}
}
`;
