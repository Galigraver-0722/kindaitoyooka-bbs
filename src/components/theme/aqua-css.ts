/** Original AQUA POP styling applied to the existing Kinjo page structure. */
export const aquaCss = `
.tw-d{--bg:#F0FBFE;--paper:#fff;--panel:#fff;--ink:#062330;--text:#062330;--ink-2:#355c6b;--muted:#4B7180;--cyan:#12BFD1;--cyan-deep:#087587;--sky:#A9E5FF;--line:#062330;--line-soft:#cce2eb;--hero:#E3F8FE;--focus-ring:#087587;--shadow:4px 4px 0 #062330}
.tw-b{--bg:#040F16;--paper:#071A23;--panel:#071A23;--panel2:#08202B;--ink:#DCF6F8;--text:#DCF6F8;--ink-2:#9CC3CB;--muted:#8AB0BA;--cyan:#5AE6EC;--cyan-deep:#5AE6EC;--teal:#2FA9BE;--sky:#0c3541;--line:rgba(104,231,236,.24);--line-soft:rgba(104,231,236,.11);--hero:#08202B;--focus-ring:#5AE6EC}
.tw-d{background-image:radial-gradient(rgba(6,35,48,.11) 1px,transparent 1px);background-size:22px 22px}
.tw-b{background-image:radial-gradient(ellipse at 80% 0,rgba(90,230,236,.07),transparent 60%),linear-gradient(var(--line-soft) 1px,transparent 1px),linear-gradient(90deg,var(--line-soft) 1px,transparent 1px);background-size:auto,64px 64px,64px 64px}
.tw-d .scroll-header{background:rgba(240,251,254,.97);border-bottom:2px solid var(--line)}
.tw-b .scroll-header{background:rgba(4,15,22,.96)}
.tw-d .site-nav{min-height:80px}
.tw-d .brand-mark{filter:drop-shadow(2px 2px 0 rgba(6,35,48,.2))}
.tw-d .kanji-lockup b{color:var(--ink)}
.tw-d .nav-search{border:2px solid var(--line);border-radius:999px;background:var(--paper);box-shadow:3px 3px 0 var(--line)}
.tw-d .nav-search:focus-within{border-color:var(--line);box-shadow:3px 3px 0 var(--cyan)}
.tw-d :is(.ann-btn,.inbox-btn,.theme-btn,.ava){border:2px solid var(--line);border-radius:11px;background:var(--paper);box-shadow:2px 2px 0 var(--line)}
.tw-d .ava{background:var(--sky)}
.tw-d .lang{border:2px solid var(--line);border-radius:999px;box-shadow:2px 2px 0 var(--line)}
.tw-d .lang button{border-radius:999px}
.tw-d .lang button.on{background:var(--ink);color:var(--paper)}
.tw-d .adm-entry{border:2px solid var(--line);border-radius:999px;background:var(--cyan);padding:6px 12px;box-shadow:2px 2px 0 var(--line);color:var(--ink);font-weight:750}
.tw-d .board-menu-panel{border:2px solid var(--line);box-shadow:5px 5px 0 var(--line)}
.tw-d .cover{background:var(--hero);border:2px solid var(--line);border-radius:22px;box-shadow:6px 6px 0 var(--line);padding:30px 34px;gap:30px;margin-bottom:36px}
.tw-d .cover h1{font-weight:800;letter-spacing:-.04em;font-size:clamp(30px,3.5vw,46px);line-height:1.3}
.tw-d .cover h1 em{background:var(--cyan);color:var(--ink);padding:0 .08em;box-shadow:0 3px 0 var(--ink);box-decoration-break:clone;-webkit-box-decoration-break:clone}
.tw-d .hero-eyebrow{color:var(--ink);font-family:var(--mono);font-size:10px;letter-spacing:.06em}
.tw-d .hero-eyebrow>span{background:var(--cyan);border:1px solid var(--ink);width:7px;height:7px}
.tw-d .cover .lede{color:var(--ink-2);line-height:1.9}
.tw-d .village-house{border:1.5px solid var(--line);box-shadow:3px 4px 0 rgba(6,35,48,.15)}
.tw-d .house-one{background:#fff}
.tw-d .house-two{background:var(--sky)}
.tw-d .house-three{background:#b7eced}
.tw-d .house-roof{background:#0d8197}
.tw-d .house-two .house-roof{background:#062330}
.tw-d .house-three .house-roof{background:#12AFC1}
.tw-d .house-door{background:#0d8197}
.tw-d .village-sun{background:#ffe5a5}
.tw-d .tree-leaves{fill:#5bc8c2}
.tw-d .tree-trunk{stroke:#0d6574}
.tw-d .side-title{font-family:var(--mono);font-size:10px;letter-spacing:.08em}
.tw-d .board-nav{gap:8px}
.tw-d .board-nav a{border:2px solid var(--line);border-radius:11px;background:var(--paper);box-shadow:2px 2px 0 var(--line);color:var(--ink);font-weight:700;padding:10px 12px}
.tw-d .board-nav a.off{border-left:6px solid var(--cyan)}
.tw-d .board-nav a.comm{border:2px dashed var(--line);color:var(--muted)}
.tw-d .board-nav a.on,.tw-d .board-nav a.comm.on{background:var(--ink);border-color:var(--ink);color:var(--bg)}
.tw-d .board-nav a.on i{color:var(--sky)}
.tw-d .board-nav .bn-create{border:2px dashed var(--line);color:var(--ink);background:var(--paper)}
.tw-d .feed-bar h2{font-weight:800;letter-spacing:-.025em}
.tw-d .hub-sort{border:2px solid var(--line);border-radius:999px;padding:3px;box-shadow:2px 2px 0 var(--line)}
.tw-d .feed-bar .hub-sort a{border-radius:999px;font-weight:700}
.tw-d .feed-bar .hub-sort a.on{background:var(--ink);color:var(--paper)}
.tw-d .hub-tabs{gap:8px;border-bottom:0;margin-bottom:20px}
.tw-d .hub-tabs a{border:2px solid var(--line);border-radius:999px;background:var(--paper);font-weight:700;padding:5px 12px}
.tw-d .hub-tabs a.on{border-color:var(--ink);background:var(--ink);color:var(--paper)}
.tw-d .cards{gap:18px}
.tw-d .card{border:2px solid var(--line);border-radius:18px;box-shadow:5px 5px 0 var(--line);padding:21px;min-height:210px;background:var(--paper)}
.tw-d .card h3{font-weight:800;font-size:18px;line-height:1.6}
.tw-d .card .bo{padding:3px 9px;background:var(--sky);color:var(--ink);border:1.5px solid var(--line);border-radius:999px;font-weight:750;font-size:10px}
.tw-d .card .bo.cy{background:var(--cyan)}
.tw-d .card .bo i{background:var(--ink)}
.tw-d .tag{background:var(--bg);border:1px solid var(--line);border-radius:999px;color:var(--ink-2)}
.tw-d .card-foot{padding-top:13px}
.tw-d .card .act{background:var(--bg);border:1.5px solid var(--line);border-radius:999px;font-size:10px;padding:5px 8px}
.tw-d .card .act.on{background:var(--cyan);color:var(--ink)}
.tw-d .btn{border:2px solid var(--line);border-radius:10px;box-shadow:3px 3px 0 var(--line);font-weight:750}
.tw-d .btn-p{border-color:var(--line);background:var(--cyan);color:var(--ink)}
.tw-d :is(.form-card,.root-post,.post,.profile-banner,.banner,.profile-reply,.confirm-card){border:2px solid var(--line);border-radius:18px;box-shadow:5px 5px 0 var(--line);background:var(--paper)}
.tw-d :is(.form-card input:not([type=checkbox]):not([type=hidden]),.form-card select,.form-card textarea,.reply-form textarea){border:2px solid var(--line);border-radius:10px}
.tw-d .board-stats .bs{border:2px solid var(--line);box-shadow:2px 2px 0 var(--line)}
.tw-d :is(.ann-panel,.inbox-panel){border:2px solid var(--line);box-shadow:5px 5px 0 var(--line)}
.tw-d :is(.ann-head,.inbox-head){border-bottom:2px solid var(--line)}
.tw-d .neighborhood-dashboard{border-top:0;padding-top:0;gap:22px}
.tw-d .neighborhood-panel{border:2px solid var(--line);border-radius:18px;background:var(--paper);box-shadow:4px 4px 0 var(--line);padding:22px}
.tw-d .neighborhood-panel h3{font-weight:800}
.tw-d .chart-range{border:1.5px solid var(--line);border-radius:999px;background:var(--bg)}
.tw-d .chart-range button{border-radius:999px}
.tw-d .chart-range button[aria-pressed=true]{background:var(--ink);color:var(--paper)}
.tw-d .chart-total b{font-weight:800}
.tw-d .kinjo-bar-track i{border:0;box-shadow:inset 0 0 0 1.5px var(--line);background:var(--cyan);border-radius:4px 4px 0 0}
.tw-d .board-chart-track{height:6px;background:var(--bg);border:1px solid var(--line);border-radius:4px}
.tw-d .board-chart-track i{background:var(--cyan)}
.tw-d .kinjo-story{border-top:2px solid var(--line);padding-top:24px}
.tw-d .kinjo-story h2{font-weight:800}
.tw-d .fab{background:var(--cyan);color:var(--ink);border:2px solid var(--line);border-radius:999px;box-shadow:4px 4px 0 var(--line)}
.tw-d .commons-footer{border-top:2px solid var(--line)}
.tw-b .card{border:1px solid var(--line);border-radius:6px;background:rgba(7,26,35,.9)}
.tw-b .card .bo{background:var(--sky);border:1px solid var(--line);border-radius:3px;padding:2px 7px;color:var(--cyan)}
.tw-b .card .act{border:1px solid var(--line);border-radius:4px;background:rgba(90,230,236,.025)}
.tw-b .cover{border:1px solid var(--line);border-radius:8px;background:linear-gradient(120deg,rgba(90,230,236,.035),transparent),var(--hero)}
.tw-b .neighborhood-panel{padding:22px;border:1px solid var(--line);border-radius:6px;background:rgba(7,26,35,.8)}
.tw-b .neighborhood-dashboard{padding-top:0;border:0;gap:22px}
.tw-b .chart-range button[aria-pressed=true]{background:var(--cyan);color:#040F16}
.tw-b .fab{border-radius:5px;background:var(--cyan);color:#040F16;box-shadow:0 8px 24px -10px rgba(90,230,236,.5)}
@media(hover:hover) and (pointer:fine){
 .tw-d .card:hover{transform:translate(-2px,-3px);box-shadow:7px 8px 0 var(--cyan);border-color:var(--line)}
 .tw-d .board-nav a:hover{border-color:var(--line);background:var(--sky);box-shadow:3px 3px 0 var(--line)}
 .tw-d .btn:hover{border-color:var(--line);transform:translate(-1px,-1px);box-shadow:4px 4px 0 var(--line)}
 .tw-d .card .act:hover{background:var(--sky)}
}
@media(max-width:580px){
 .tw-d .cover{padding:24px 21px;border-radius:18px;box-shadow:4px 4px 0 var(--line)}
 .tw-d .cover h1{font-size:28px;line-height:1.4}
 .tw-d .site-nav{min-height:0}
 .tw-d .card{padding:19px;min-height:0;box-shadow:4px 4px 0 var(--line)}
 .tw-d .neighborhood-panel,.tw-b .neighborhood-panel{padding:20px}
 .tw-d .fab{box-shadow:3px 3px 0 var(--line)}
}
@media(prefers-reduced-motion:reduce){.tw-d .card:hover,.tw-d .btn:hover{transform:none}}
`;
