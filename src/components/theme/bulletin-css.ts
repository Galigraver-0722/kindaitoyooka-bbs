/** Kinjo bulletin: paper, ink, a kanji seal, and a direct reading stream. */
export const bulletinCss = `
.tw-d{--bg:#f7f6f0;--paper:#fffef9;--panel:#fffef9;--ink:#223c33;--text:#223c33;--ink-2:#4a5d54;--muted:#64746b;--line:#dce0d4;--line-soft:#e8eadf;--cyan:#d5e78e;--sky:#edf0dd;--cyan-deep:#31583f;--hero:#eeefe3;--focus-ring:#31583f}
.tw-b{--bg:#131e1a;--paper:#1a2822;--panel:#1a2822;--ink:#edf0e3;--text:#edf0e3;--ink-2:#bcc9ba;--muted:#a0b09f;--line:#35473a;--line-soft:#283b2e;--cyan:#d5e78e;--sky:#2c3e2c;--cyan-deep:#d5e78e;--hero:#24352a;--focus-ring:#d5e78e}
:is(.tw-d,.tw-b){--font-editorial:Georgia,"Yu Mincho","Hiragino Mincho ProN",serif}
:is(.tw-d,.tw-b) main{max-width:1420px;padding-left:clamp(20px,3.5vw,52px);padding-right:clamp(20px,3.5vw,52px)}
:is(.tw-d,.tw-b) .site-nav{max-width:1540px;min-height:80px;padding-top:15px;padding-bottom:15px;gap:34px}
:is(.tw-d,.tw-b) .site-brand{gap:10px;min-width:132px}
:is(.tw-d,.tw-b) .brand-mark{width:46px;height:46px;flex:none;transition:rotate .22s ease}
:is(.tw-d,.tw-b) .kanji-lockup{display:flex;align-items:baseline;gap:8px;color:var(--ink)}
:is(.tw-d,.tw-b) .kanji-lockup b{font-family:var(--font-editorial);font-size:26px;letter-spacing:.05em;font-weight:700}
:is(.tw-d,.tw-b) .kanji-lockup>span{font-family:var(--sans);font-size:12px;letter-spacing:.01em;font-weight:550}
:is(.tw-d,.tw-b) .nav-search{max-width:370px;border-radius:7px;background:transparent}
:is(.tw-d,.tw-b) :is(.ann-btn,.inbox-btn,.theme-btn,.ava){border-radius:8px;background:transparent}
:is(.tw-d,.tw-b) .scroll-header{background:var(--bg);backdrop-filter:none}
:is(.tw-d,.tw-b) .kinjo-home .cover{display:grid;grid-template-columns:minmax(0,1fr) 240px;align-items:center;margin:0 0 32px;padding:34px 0 30px;background:none;border:0;border-bottom:1px solid var(--line);border-radius:0;gap:48px;min-height:255px}
:is(.tw-d,.tw-b) .kinjo-home .cover h1{font-family:var(--font-editorial);font-size:clamp(30px,3.15vw,44px);line-height:1.23;font-weight:500;letter-spacing:-.035em;margin-top:12px}
:is(.tw-d,.tw-b) .kinjo-home .cover h1 em{color:var(--ink);font-style:italic}
:is(.tw-d,.tw-b)[lang=ja] .kinjo-home .cover h1{letter-spacing:.015em;line-height:1.45;font-weight:600}
:is(.tw-d,.tw-b)[lang=ja] .kinjo-home .cover h1 em{font-style:normal}
:is(.tw-d,.tw-b) .kinjo-home .cover .lede{max-width:54ch;font-size:13px;line-height:1.9;margin-top:14px}
:is(.tw-d,.tw-b) .hero-eyebrow{font-family:var(--mono);font-size:10px;letter-spacing:.04em;color:var(--muted)}
:is(.tw-d,.tw-b) .hero-eyebrow>span{width:5px;height:5px;border-radius:1px;background:var(--cyan-deep)}
:is(.tw-d,.tw-b) .hero-actions{margin-top:18px;gap:20px}
:is(.tw-d,.tw-b) .hero-actions .btn{background:var(--ink);color:var(--bg);border-color:var(--ink);border-radius:6px;min-height:38px;font-size:12px}
:is(.tw-d,.tw-b) .hero-stats{font-family:var(--mono);font-size:10px;margin-top:18px;color:var(--muted)}
:is(.tw-d,.tw-b) .masthead-mark{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;align-self:stretch;border-left:1px solid var(--line);padding-left:36px}
:is(.tw-d,.tw-b) .masthead-symbol{width:112px;height:112px;rotate:-4deg}
:is(.tw-d,.tw-b) .mark-registration{font-family:var(--mono);font-size:9px;letter-spacing:.14em;color:var(--muted)}
:is(.tw-d,.tw-b) .mark-caption{font-size:10px;color:var(--muted);text-align:center}
:is(.tw-d,.tw-b) .kinjo-home .feed-cols{display:grid;grid-template-columns:172px minmax(0,1fr) 260px;gap:30px;align-items:start}
:is(.tw-d,.tw-b) .kinjo-home .feed-side{display:block;position:sticky;top:106px}
:is(.tw-d,.tw-b) .kinjo-home .board-nav a{border:0;border-radius:5px;background:none;padding:10px;font-size:12px;box-shadow:none}
:is(.tw-d,.tw-b) .kinjo-home .board-nav a.on{background:var(--sky);color:var(--ink)}
:is(.tw-d,.tw-b) .kinjo-home .board-nav a.off{border:0}
:is(.tw-d,.tw-b) .kinjo-home .board-nav a.comm{border:0}
:is(.tw-d,.tw-b) .kinjo-home .board-nav .bn-create{border:1px solid var(--line);border-radius:5px}
:is(.tw-d,.tw-b) .kinjo-home .bn-label{margin-top:14px;margin-left:10px;font-size:9px;letter-spacing:.03em}
:is(.tw-d,.tw-b) .side-title{font-size:11px;font-weight:650;letter-spacing:.02em}
:is(.tw-d,.tw-b) .kinjo-home .feed-bar{margin-bottom:15px;align-items:center}
:is(.tw-d,.tw-b) .kinjo-home .feed-bar h2{font-family:var(--font-editorial);font-size:24px;font-weight:500}
:is(.tw-d,.tw-b) .kinjo-home .hub-sort{background:none;border:0;border-radius:0;padding:0;gap:4px}
:is(.tw-d,.tw-b) .kinjo-home .hub-sort a{padding:5px 7px;font-size:10px}
:is(.tw-d,.tw-b) .kinjo-home .hub-sort a.on{background:var(--sky);color:var(--ink);border-radius:4px}
:is(.tw-d,.tw-b) .kinjo-home .hub-tabs{margin-bottom:0;gap:22px}
:is(.tw-d,.tw-b) .kinjo-home .hub-tabs a{font-size:12px;padding-bottom:12px}
:is(.tw-d,.tw-b) .kinjo-home .cards{display:flex;flex-direction:column;gap:0}
:is(.tw-d,.tw-b) .kinjo-home .card{display:grid;grid-template-columns:minmax(0,1fr);gap:0;min-height:0;border:0;border-bottom:1px solid var(--line);border-radius:0;background:none;padding:22px 0;box-shadow:none;transition:background-color .2s ease}
:is(.tw-d,.tw-b) .kinjo-home .card-top{margin-bottom:9px}
:is(.tw-d,.tw-b) .kinjo-home .card .bo{font-size:10px;color:var(--muted);font-weight:500}
:is(.tw-d,.tw-b) .kinjo-home .card h3{font-size:18px;line-height:1.65;font-weight:600;letter-spacing:-.015em}
:is(.tw-d,.tw-b) .kinjo-home .card .excerpt{max-width:none;font-size:13px;color:var(--ink-2);line-height:1.85;margin-top:6px}
:is(.tw-d,.tw-b) .kinjo-home .card .tags{margin:9px 0 0;gap:7px}
:is(.tw-d,.tw-b) .kinjo-home .card .tag{background:var(--sky);color:var(--muted);border-radius:3px;font-size:10px;padding:1px 5px}
:is(.tw-d,.tw-b) .kinjo-home .card-foot{margin-top:12px;padding-top:0;gap:9px;flex-wrap:wrap}
:is(.tw-d,.tw-b) .kinjo-home .card .who{font-size:10px;gap:5px;flex-basis:auto}
:is(.tw-d,.tw-b) .kinjo-home .card .who .dot{width:21px;height:21px;font-size:9px}
:is(.tw-d,.tw-b) .kinjo-home .card .metric{font-size:10px}
:is(.tw-d,.tw-b) .kinjo-home .card .act{font-size:10px;padding:4px 7px;min-height:30px}
:is(.tw-d,.tw-b) .kinjo-home .card .acts{margin-left:auto}
:is(.tw-d,.tw-b) .kinjo-home .neighborhood-dashboard{display:flex;flex-direction:column;position:sticky;top:106px;margin:0;padding:0 0 0 24px;border:0;border-left:1px solid var(--line);gap:26px}
:is(.tw-d,.tw-b) .kinjo-home .neighborhood-panel{width:100%;padding:0;background:none;border:0;border-radius:0}
:is(.tw-d,.tw-b) .neighborhood-panel h3{font-size:12px;font-weight:650}
:is(.tw-d,.tw-b) .kinjo-home .neighborhood-panel-head{gap:10px}
:is(.tw-d,.tw-b) .kinjo-home .chart-range{border:0;padding:0;background:none;gap:1px}
:is(.tw-d,.tw-b) .kinjo-home .chart-range button{padding:3px 7px;font-size:9px;border-radius:4px;min-height:30px}
:is(.tw-d,.tw-b) .kinjo-home .chart-total{margin-top:14px}
:is(.tw-d,.tw-b) .kinjo-home .chart-total b{font-family:var(--font-editorial);font-size:29px;font-weight:500}
:is(.tw-d,.tw-b) .kinjo-home .kinjo-bars{height:82px;margin:22px 0 8px;gap:3px}
:is(.tw-d,.tw-b) .kinjo-home .kinjo-day-label{font-size:8px}
:is(.tw-d,.tw-b) .kinjo-home .kinjo-bar-track i{width:60%;border-radius:2px 2px 0 0;background:var(--cyan-deep);opacity:.7}
:is(.tw-d,.tw-b) .kinjo-home .chart-caption{font-size:10px}
:is(.tw-d,.tw-b) .kinjo-home .board-chart{border-top:1px solid var(--line);padding-top:22px}
:is(.tw-d,.tw-b) .kinjo-home .board-chart-row{font-size:11px;gap:5px 8px}
:is(.tw-d,.tw-b) .kinjo-home .board-chart-track{height:3px;background:var(--line-soft)}
:is(.tw-d,.tw-b) .kinjo-home .board-chart-track i{background:var(--cyan-deep);opacity:.65}
:is(.tw-d,.tw-b) .kinjo-home .kinjo-story{display:block;max-width:750px;margin:40px 0 0 202px;padding:24px 0 0;border-top:1px solid var(--line)}
:is(.tw-d,.tw-b) .kinjo-story h2{font-family:var(--font-editorial);font-size:21px;font-weight:500}
:is(.tw-d,.tw-b) .btn{border-radius:6px}
:is(.tw-d,.tw-b) .fab{border-radius:7px;background:var(--ink);color:var(--bg);font-size:12px;box-shadow:0 4px 16px #0002}
:is(.tw-d,.tw-b) .footer-lockup{display:flex;align-items:center;gap:11px}
:is(.tw-d,.tw-b) .footer-mark{width:32px;height:32px;flex:none}
:is(.tw-d,.tw-b) .footer-lockup strong{font-family:var(--font-editorial);font-size:20px}
:is(.tw-d,.tw-b) .footer-lockup strong span{font-family:var(--sans);font-size:11px;margin-left:6px}
:is(.tw-d,.tw-b) .commons-footer{max-width:1316px;padding-left:0;padding-right:0;margin-left:auto;margin-right:auto}
@media(hover:hover) and (pointer:fine){
 :is(.tw-d,.tw-b) .site-brand:hover .brand-mark{rotate:-5deg}
 :is(.tw-d,.tw-b) .kinjo-home .card:hover{transform:none;box-shadow:none;border-color:var(--line);background:color-mix(in srgb,var(--sky) 35%,transparent)}
}
@media(max-width:1200px){
 :is(.tw-d,.tw-b) .kinjo-home .feed-cols{grid-template-columns:150px minmax(0,1fr) 222px;gap:22px}
 :is(.tw-d,.tw-b) .kinjo-home .neighborhood-dashboard{padding-left:18px}
 :is(.tw-d,.tw-b) .kinjo-home .feed-bar{flex-direction:column;align-items:start;gap:10px}
 :is(.tw-d,.tw-b) .kinjo-home .kinjo-story{margin-left:172px}
 :is(.tw-d,.tw-b) .commons-footer{margin-left:32px;margin-right:32px}
}
@media(max-width:1000px){
 :is(.tw-d,.tw-b) .site-nav{gap:18px}
 :is(.tw-d,.tw-b) .kinjo-home .feed-cols{grid-template-columns:165px minmax(0,1fr)}
 :is(.tw-d,.tw-b) .kinjo-home .neighborhood-dashboard{grid-column:2;position:static;display:grid;grid-template-columns:1fr 1fr;border:0;border-top:1px solid var(--line);padding:24px 0 0;margin-top:18px}
 :is(.tw-d,.tw-b) .kinjo-home .board-chart{border:0;padding-top:0}
 :is(.tw-d,.tw-b) .kinjo-home .kinjo-story{margin-left:187px}
}
@media(max-width:700px){
 :is(.tw-d,.tw-b) .kinjo-home .feed-cols{grid-template-columns:minmax(0,1fr)}
 :is(.tw-d,.tw-b) .kinjo-home .feed-side{display:none}
 :is(.tw-d,.tw-b) .kinjo-home .neighborhood-dashboard{grid-column:1}
 :is(.tw-d,.tw-b) .kinjo-home .cover{grid-template-columns:minmax(0,1fr) 125px;padding:26px 0;gap:18px;min-height:0;margin-bottom:24px}
 :is(.tw-d,.tw-b) .kinjo-home .cover h1{font-size:31px}
 :is(.tw-d,.tw-b) .masthead-mark{padding-left:15px;gap:12px}
 :is(.tw-d,.tw-b) .masthead-symbol{width:88px;height:88px}
 :is(.tw-d,.tw-b) .mark-registration{font-size:8px}
 :is(.tw-d,.tw-b) .mark-caption{font-size:9px}
 :is(.tw-d,.tw-b) .kinjo-home .kinjo-story{margin-left:0}
 :is(.tw-d,.tw-b) .kinjo-home .feed-bar{flex-direction:row;align-items:center}
}
@media(max-width:580px){
 :is(.tw-d,.tw-b) main{padding-left:20px;padding-right:20px}
 :is(.tw-d,.tw-b) .site-nav{padding:12px 20px;gap:9px 6px;min-height:0}
 :is(.tw-d,.tw-b) .site-brand{min-width:0;gap:6px}
 :is(.tw-d,.tw-b) .brand-mark{width:32px;height:32px}
 :is(.tw-d,.tw-b) .kanji-lockup{gap:5px}
 :is(.tw-d,.tw-b) .kanji-lockup b{font-size:19px;letter-spacing:0}
 :is(.tw-d,.tw-b) .kanji-lockup>span{display:none}
 :is(.tw-d,.tw-b) .kinjo-home .cover{grid-template-columns:minmax(0,1fr) 78px;gap:14px;padding:25px 0 22px}
 :is(.tw-d,.tw-b) .kinjo-home .cover h1{font-size:28px;line-height:1.3;margin-top:12px}
 :is(.tw-d,.tw-b)[lang=ja] .kinjo-home .cover h1{font-size:27px;line-height:1.5}
 :is(.tw-d,.tw-b) .kinjo-home .cover .lede{font-size:12px;line-height:1.85}
 :is(.tw-d,.tw-b) .masthead-mark{padding-left:0;border:0;align-self:start;margin-top:30px}
 :is(.tw-d,.tw-b) .masthead-symbol{width:68px;height:68px}
 :is(.tw-d,.tw-b) .mark-registration,:is(.tw-d,.tw-b) .mark-caption{display:none}
 :is(.tw-d,.tw-b) .hero-actions{flex-direction:column;align-items:start;gap:12px;margin-top:16px}
 :is(.tw-d,.tw-b) .hero-actions .btn{min-height:38px;font-size:12px}
 :is(.tw-d,.tw-b) .hero-browse{font-size:11px}
 :is(.tw-d,.tw-b) .kinjo-home .card{padding:20px 0}
 :is(.tw-d,.tw-b) .kinjo-home .card h3{font-size:17px}
 :is(.tw-d,.tw-b) .kinjo-home .card-foot{gap:7px}
 :is(.tw-d,.tw-b) .kinjo-home .card .who{flex-basis:100%}
 :is(.tw-d,.tw-b) .kinjo-home .neighborhood-dashboard{grid-template-columns:1fr;gap:24px}
 :is(.tw-d,.tw-b) .kinjo-home .board-chart{border-top:1px solid var(--line);padding-top:22px}
 :is(.tw-d,.tw-b) .kinjo-home .kinjo-bars{height:95px}
 :is(.tw-d,.tw-b) .commons-footer{margin-left:20px;margin-right:20px}
 :is(.tw-d,.tw-b) .fab{height:44px;padding:0 13px;right:18px;bottom:max(18px,env(safe-area-inset-bottom))}
 :is(.tw-d,.tw-b) .fab span{display:none}
}
@media(prefers-reduced-motion:reduce){:is(.tw-d,.tw-b) .site-brand:hover .brand-mark{rotate:none}}

:is(.tw-d,.tw-b) .kinjo-home.feed-only .feed-cols{grid-template-columns:172px minmax(0,1fr)}
@media(max-width:1100px){:is(.tw-d,.tw-b) .nav-search{max-width:none}}
@media(max-width:1000px){:is(.tw-d,.tw-b) .kinjo-home.feed-only .feed-cols{grid-template-columns:165px minmax(0,1fr)}}
@media(max-width:700px){:is(.tw-d,.tw-b) .kinjo-home.feed-only .feed-cols{grid-template-columns:minmax(0,1fr)}}
`;
