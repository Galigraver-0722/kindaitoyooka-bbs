export const pagesDCss = `
.tw-d{--ink-2:#3A5E6C;--accent:var(--cyan)}
.tw-d .page-head{margin:44px 0 26px}
.tw-d .crumb{display:flex;flex-wrap:wrap;align-items:center;gap:8px;font-family:var(--mono);font-size:10px;letter-spacing:.12em;color:var(--muted)}
.tw-d .crumb a{color:var(--cyan-deep);font-weight:600}
.tw-d .page-head h1{margin-top:14px;font-size:clamp(30px,4vw,46px);line-height:1.14;letter-spacing:-.04em;word-break:auto-phrase}
.tw-d .page-head .lede{margin-top:12px;max-width:60ch;color:var(--ink-2)}
.tw-d .page-head .row-meta{display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin-top:16px;font-family:var(--mono);font-size:10.5px;color:var(--muted)}
.tw-d .page-head .row-meta .pill{border:1.5px solid var(--line);border-radius:999px;padding:3px 10px;background:var(--paper)}
.tw-d .empty{border:2px dashed var(--line);border-radius:18px;padding:34px 22px;text-align:center;color:var(--muted);font-size:14px}
.tw-d .pager{display:flex;flex-wrap:wrap;gap:8px;margin-top:22px}
.tw-d .pager a,.tw-d .pager span{border:2px solid var(--line);border-radius:999px;padding:6px 14px;font-family:var(--mono);font-size:11px;background:var(--paper);box-shadow:2px 2px 0 var(--line)}
.tw-d .pager span{background:var(--cyan);font-weight:700}
.tw-d .post{position:relative;background:var(--paper);border:2px solid var(--line);border-radius:18px;box-shadow:5px 5px 0 var(--line);padding:18px 20px;margin-top:16px}
.tw-d .post-head{display:flex;flex-wrap:wrap;align-items:center;gap:10px;font-size:12px;color:var(--muted)}
.tw-d .post-head .who{display:inline-flex;align-items:center;gap:7px;font-weight:800;color:var(--ink);font-size:12.5px}
.tw-d .post-head .dot{width:24px;height:24px;border-radius:50%;background:var(--sky);border:1.5px solid var(--line);display:grid;place-items:center;font-size:9px;font-weight:800}
.tw-d .post-body{margin-top:12px;font-size:15.5px;line-height:1.95;white-space:pre-wrap;word-break:break-word}
.tw-d .post-foot{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin-top:14px;padding-top:12px;border-top:1.5px solid var(--line-soft)}
.tw-d .post-foot .metric{border:1.5px solid var(--line);border-radius:999px;padding:3px 10px;font-family:var(--mono);font-size:10.5px;background:var(--bg)}
.tw-d .post-foot .metric.liked{background:rgba(18,191,209,.16);font-weight:700}
.tw-d .form-card{background:var(--paper);border:2px solid var(--line);border-radius:18px;box-shadow:5px 5px 0 var(--line);padding:18px 20px;margin-top:22px}
.tw-d .form-card h2{font-size:16px;font-weight:800}
.tw-d .form-card textarea,.tw-d .form-card input,.tw-d .form-card select{width:100%;margin-top:12px;border:2px solid var(--line);border-radius:12px;background:var(--bg);padding:10px 12px;font:inherit;font-size:14px}
.tw-d .form-card textarea{min-height:120px;resize:vertical}
.tw-d .form-card .form-foot{display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin-top:12px}
.tw-d .form-card .hint{font-size:11px;color:var(--muted)}
.tw-d .notice{border:2px solid var(--line);border-radius:14px;padding:12px 16px;margin-top:18px;background:var(--paper);font-size:13px;box-shadow:3px 3px 0 var(--line)}
.tw-d .notice.error{background:#FFF1EF}
.tw-d .detail-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:18px}
.tw-d .field-label{display:block;margin-top:16px;font-size:12px;font-weight:800;letter-spacing:.02em}
.tw-d .hub-search{display:flex;gap:10px;margin:20px 0 14px}
.tw-d .hub-search input{flex:1;min-width:0;border:2px solid var(--line);border-radius:999px;background:var(--paper);padding:12px 18px;font:inherit;font-size:14px;box-shadow:3px 3px 0 var(--line)}
.tw-d .hub-search button{border:2px solid var(--line);border-radius:999px;background:var(--cyan);padding:0 22px;font-size:13px;font-weight:800;box-shadow:3px 3px 0 var(--line)}
.tw-d .hub-tabs{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:6px 0 22px}
.tw-d .hub-tabs a{border:2px solid var(--line);border-radius:999px;padding:5px 13px;font-size:12px;font-weight:700;background:var(--paper)}
.tw-d .hub-tabs a.on{background:var(--ink);color:var(--bg)}
.tw-d .hub-sort{margin-left:auto;display:flex;gap:4px;font-family:var(--mono);font-size:10px}
.tw-d .hub-sort a{padding:5px 9px}
.tw-d .home-nav{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
.tw-d .home-nav a{position:relative;display:block;background:var(--paper);border:2px solid var(--line);border-radius:18px;box-shadow:5px 5px 0 var(--line);padding:20px 22px;transition:transform .16s,box-shadow .16s}
.tw-d .home-nav a:hover{transform:translate(-2px,-2px);box-shadow:8px 8px 0 var(--accent)}
.tw-d .home-nav .n{font-family:var(--mono);font-size:9px;letter-spacing:.14em;color:var(--cyan-deep)}
.tw-d .home-nav h3{margin-top:8px;font-size:19px;font-weight:800;letter-spacing:-.02em}
.tw-d .home-nav p{margin-top:4px;font-size:12.5px;color:var(--ink-2)}
.tw-d .home-nav .go{position:absolute;right:18px;top:16px;font-family:var(--mono);font-size:14px;color:var(--cyan-deep)}
@media (max-width:720px){.tw-d .home-nav{grid-template-columns:1fr}.tw-d .hub-search{flex-wrap:wrap}.tw-d .hub-search button{height:44px}}
.tw-d .board-dir{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin-top:6px}
.tw-d .board-dir>a{position:relative;display:flex;flex-direction:column;gap:6px;background:var(--paper);border:2px solid var(--line);border-radius:18px;box-shadow:5px 5px 0 var(--line);padding:20px 22px;transition:transform .16s,box-shadow .16s}
.tw-d .board-dir>a:hover{transform:translate(-2px,-2px);box-shadow:8px 8px 0 var(--cyan)}
.tw-d .board-dir .n{font-family:var(--mono);font-size:9px;letter-spacing:.14em;color:var(--cyan-deep)}
.tw-d .board-dir h2{font-size:22px;font-weight:800;letter-spacing:-.02em}
.tw-d .board-dir p{font-size:12.5px;color:var(--ink-2);max-width:46ch;line-height:1.85}
.tw-d .board-dir .c{font-family:var(--mono);font-size:10px;color:var(--muted);margin-top:2px}
.tw-d .board-dir .go{position:absolute;right:20px;top:18px;font-family:var(--mono);font-size:14px;color:var(--cyan-deep)}
@media (max-width:1040px){
  .tw-d .top-in{flex-wrap:wrap;gap:10px 16px}
  .tw-d .tools{order:2}
  .tw-d .top-in nav{display:flex;order:3;width:100%;margin-left:0;gap:6px;overflow-x:auto;padding-bottom:2px;scrollbar-width:none}
  .tw-d .top-in nav::-webkit-scrollbar{display:none}
  .tw-d .top-in nav a{white-space:nowrap;flex:none}
}
@media (max-width:720px){.tw-d .board-dir{grid-template-columns:1fr}}
.tw-d .cover{padding:clamp(28px,4vw,46px) 0 20px;max-width:70ch}
.tw-d .cover h1{font-size:clamp(32px,4.6vw,50px);line-height:1.14;margin-top:16px}
.tw-d .cover .lede{margin-top:12px}
.tw-d .feed-cols{display:grid;grid-template-columns:236px minmax(0,1fr);gap:clamp(20px,3vw,40px);align-items:start}
.tw-d .feed-side{position:sticky;top:96px}
.tw-d .side-title{font-family:var(--mono);font-size:9.5px;letter-spacing:.16em;color:var(--muted);margin-bottom:10px}
.tw-d .board-nav{display:flex;flex-direction:column;gap:6px}
.tw-d .board-nav a{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:9px 12px;border:2px solid var(--line);border-radius:12px;background:var(--paper);font-size:12.5px;font-weight:700;box-shadow:2px 2px 0 var(--line);transition:.14s}
.tw-d .board-nav a:hover{background:var(--sky);transform:translate(-1px,-1px);box-shadow:3px 3px 0 var(--line)}
.tw-d .board-nav a.on{background:var(--ink);color:var(--bg);border-color:var(--ink)}
.tw-d .board-nav i{font-family:var(--mono);font-size:10px;font-style:normal;font-weight:500;color:var(--muted)}
.tw-d .board-nav a.on i{color:var(--sky)}
.tw-d .feed-bar{display:flex;align-items:baseline;justify-content:space-between;gap:12px;margin-bottom:12px}
.tw-d .feed-bar h2{display:flex;align-items:center;gap:10px;font-size:20px;font-weight:800;letter-spacing:-.02em}
.tw-d .feed-bar h2 .tick{width:11px;height:11px;border-radius:3px;background:var(--cyan);border:2px solid var(--line);display:inline-block}
.tw-d .feed-bar .hub-sort a{border:0;background:none;padding:4px 8px;font-family:var(--mono);font-size:10px;font-weight:700;color:var(--muted);border-radius:999px}
.tw-d .feed-bar .hub-sort a.on{background:var(--ink);color:var(--bg)}
.tw-d .hub-clear{margin-left:auto;font-size:11px;font-weight:700;color:var(--cyan-deep)}
.tw-d .banner{margin:26px 0 20px;background:var(--paper);border:2px solid var(--line);border-radius:22px;box-shadow:7px 7px 0 var(--line);padding:clamp(18px,2.6vw,26px)}
.tw-d .banner .page-head{margin:0}
.tw-d .pill-action{background:var(--cyan);font-weight:800;color:var(--ink)}
.tw-d .bd-drawer{display:none}
@media (max-width:1040px){
  .tw-d .bd-drawer{display:block;position:static}
  .tw-d .bd-drawer summary{list-style:none;cursor:pointer;padding:7px 12px;border:2px solid var(--line);border-radius:999px;background:var(--paper);font-size:12px;font-weight:800;box-shadow:2px 2px 0 var(--line)}
  .tw-d .bd-drawer summary::-webkit-details-marker{display:none}
  .tw-d .bd-drawer[open] summary{background:var(--cyan)}
  .tw-d .bd-panel{position:absolute;top:calc(100% + 8px);left:12px;right:12px;z-index:90;min-width:0;display:flex;flex-direction:column;gap:2px;background:var(--paper);border:2px solid var(--line);border-radius:14px;box-shadow:5px 5px 0 var(--line);padding:8px}
  .tw-d .bd-panel a{display:flex;justify-content:space-between;gap:10px;padding:8px 10px;border-radius:9px;font-size:12.5px;font-weight:700}
  .tw-d .bd-panel a:hover{background:var(--sky)}
  .tw-d .bd-panel i{font-family:var(--mono);font-size:10px;font-style:normal;color:var(--muted)}
}
@media (max-width:900px){.tw-d .feed-cols{grid-template-columns:1fr}.tw-d .feed-side{display:none}.tw-d .feed-bar{flex-wrap:wrap}}
.tw-d .cover{display:grid;grid-template-columns:minmax(0,1fr) 300px;gap:clamp(20px,3vw,40px);align-items:center;max-width:none}
.tw-d .chart{background:var(--paper);border:2px solid var(--line);border-radius:18px;box-shadow:6px 6px 0 var(--line);padding:16px 18px 12px}
.tw-d .chart-head{display:flex;align-items:baseline;justify-content:space-between;font-family:var(--mono);font-size:9px;letter-spacing:.14em;color:var(--muted)}
.tw-d .chart-head b{font-size:26px;letter-spacing:-.03em;color:var(--ink)}
.tw-d .chart-bars{display:flex;align-items:flex-end;gap:8px;height:96px;margin:12px 0 8px}
.tw-d .chart-bar{flex:1;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;gap:6px;height:100%;min-width:0}
.tw-d .chart-bar i{display:block;width:100%;background:var(--cyan);border:2px solid var(--line);border-radius:4px 4px 0 0}
.tw-d .chart-bar span{font-family:var(--mono);font-size:8px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}
.tw-d .chart-foot{font-family:var(--mono);font-size:9px;letter-spacing:.1em;color:var(--muted);border-top:1.5px solid var(--line-soft);padding-top:8px}
.tw-d .lang{display:flex;flex:none;gap:2px;border:2px solid var(--line);border-radius:999px;background:var(--paper);padding:2px;box-shadow:2px 2px 0 var(--line)}
.tw-d .lang form{display:contents}
.tw-d .lang button{font-family:var(--mono);font-size:10px;font-weight:700;letter-spacing:.08em;padding:4px 8px;border-radius:999px;color:var(--muted)}
.tw-d .lang button.on{background:var(--ink);color:var(--bg)}
.tw-d .acts{display:flex;gap:6px;margin-left:auto}
.tw-d .act{display:inline-flex;align-items:center;gap:5px;border:1.5px solid var(--line);border-radius:999px;padding:3px 9px;font-family:var(--mono);font-size:11px;background:var(--bg);transition:.14s;line-height:1.2;color:var(--ink)}
.tw-d .act:hover{background:var(--sky);transform:translate(-1px,-1px);box-shadow:2px 2px 0 var(--line)}
.tw-d .act.on{background:var(--cyan)}
.tw-d .act.on svg{fill:var(--ink)}
.tw-d .act.save{display:inline-flex;width:auto;height:auto;padding:3px 9px;border:1.5px solid var(--line);border-radius:999px;background:var(--bg)}
.tw-d .act.save.on{background:var(--cyan);border-color:var(--line)}
.tw-d .act-lg.save{padding:8px 14px;border-width:2px;border-radius:12px;height:auto}
.tw-d .act-lg{padding:8px 14px;font-size:12px;border-radius:12px;border-width:2px;box-shadow:3px 3px 0 var(--line)}
.tw-d .act-lg svg{width:16px;height:16px}
.tw-d .bn-group{display:flex;flex-direction:column;gap:6px;margin-top:12px}
.tw-d .bn-label{display:flex;align-items:center;gap:6px;font-family:var(--mono);font-size:9px;letter-spacing:.14em;color:var(--muted);margin:0 0 2px 4px}
.tw-d .bn-dot{width:7px;height:7px;border-radius:50%;background:var(--cyan);border:1.5px solid var(--line)}
.tw-d .bn-dot.comm{background:var(--paper)}
.tw-d .board-nav a.off{border-left:6px solid var(--cyan)}
.tw-d .board-nav a.comm{border-style:dashed;color:var(--muted)}
.tw-d .bn-empty{font-size:10.5px;color:var(--muted);padding:4px 12px}
.tw-d .top-in .board-nav{overflow:visible;width:auto;order:0;padding-bottom:0}
.tw-d .pill.kind{background:var(--ink);color:var(--bg);font-weight:700}
.tw-d .pill.kind.comm{background:var(--paper);color:var(--muted)}
@media (max-width:1040px){.tw-d .cover{grid-template-columns:1fr}.tw-d .chart{display:none}}
.tw-d .act svg{flex:none}
.tw-d .root-post{background:var(--paper);border:2px solid var(--line);border-radius:18px;box-shadow:5px 5px 0 var(--line);padding:20px 22px;margin-top:8px}
.tw-d .root-head{display:flex;flex-wrap:wrap;align-items:center;gap:10px;font-family:var(--mono);font-size:10.5px;color:var(--muted)}
.tw-d .root-no{display:inline-grid;place-items:center;width:28px;height:28px;border:2px solid var(--line);border-radius:9px;background:var(--cyan);font-weight:800;font-size:12px;color:var(--ink);box-shadow:2px 2px 0 var(--line)}
.tw-d .root-tag{margin-left:auto;font-family:var(--mono);font-size:9px;letter-spacing:.14em;border:1.5px solid var(--line);border-radius:999px;padding:2px 8px;background:var(--bg)}
.tw-d .root-body{margin-top:14px;font-size:16px;line-height:1.95;white-space:pre-wrap;word-break:break-word}
.tw-d .comments-head{margin-top:26px}
.tw-d .cmt-tree{display:flex;flex-direction:column;gap:12px;margin-top:12px}
.tw-d .cmt{background:none;border:0;border-radius:0;box-shadow:none;padding:0}
.tw-d .cmt-tree > .cmt{border-top:2px solid var(--line-soft);padding:16px 0}
.tw-d .cmt-tree > .cmt:first-child{border-top:0;padding-top:4px}
.tw-d .cmt-head{display:flex;flex-wrap:wrap;align-items:center;gap:9px;font-family:var(--mono);font-size:10.5px;color:var(--muted)}
.tw-d .cmt-no{font-weight:800;font-size:11px;color:var(--ink);background:var(--sky);border:1.5px solid var(--line);border-radius:6px;padding:1px 7px}
.tw-d .cmt-who{display:inline-flex;align-items:center;gap:6px;font-weight:700;color:var(--ink);font-size:12px}
.tw-d .cmt-who .dot{width:20px;height:20px;border-radius:50%;background:var(--sky);border:1.5px solid var(--line);display:grid;place-items:center;font-size:8px;font-weight:800}
.tw-d .cmt-body{margin-top:9px;font-size:14.5px;line-height:1.85;white-space:pre-wrap;word-break:break-word}
.tw-d .cmt-acts{margin-top:10px}
.tw-d .cmt-kids{margin-top:10px;margin-left:10px;padding-left:16px;border-left:2px solid rgba(6,35,48,.22);display:flex;flex-direction:column;gap:12px}
.tw-d .cmt-kids > .cmt{position:relative}
.tw-d .cmt-kids > .cmt::before{content:"";position:absolute;left:-18px;top:16px;width:12px;height:2px;background:rgba(6,35,48,.22)}
.tw-d .cmt-fold{display:grid;place-items:center;width:20px;height:20px;flex:none;border:2px solid var(--line);border-radius:6px;background:var(--paper);font-family:var(--mono);font-size:12px;font-weight:800;line-height:1;color:var(--ink);cursor:pointer}
.tw-d .cmt-fold:hover{background:var(--sky)}
.tw-d .cmt.folded{opacity:.85}
.tw-d .cmt.folded .cmt-head{padding:2px 0}
.tw-d .cmt-folded{border:2px dashed var(--line);border-radius:999px;padding:2px 10px;font-size:10.5px;font-weight:700;color:var(--cyan-deep);background:var(--paper);cursor:pointer}
.tw-d .cmt-folded:hover{background:var(--sky)}
.tw-d .reply-box{margin:0}
.tw-d .reply-box > summary{list-style:none}
.tw-d .reply-box > summary::-webkit-details-marker{display:none}
.tw-d .reply-box[open]{flex:1 0 100%;margin-top:8px}
.tw-d .reply-form{display:flex;flex-direction:column;gap:8px;width:100%}
.tw-d .reply-form textarea{border:2px solid var(--line);border-radius:12px;background:var(--bg);padding:10px 12px;font:inherit;font-size:13.5px;min-height:80px;resize:vertical}
.tw-d .reply-form .btn{align-self:flex-start}
.tw-d .bn-create{margin-top:8px;font-size:11.5px;font-weight:700;color:var(--cyan-deep);padding:7px 10px;border:2px dashed var(--line);border-radius:10px;text-align:center}
.tw-d .bn-create:hover{background:var(--sky)}
.tw-d .pill.role{background:var(--sky);font-weight:700}
.tw-d .nav-left{display:flex;gap:6px;flex:none}
.tw-d .scroll-header{position:sticky;top:0;z-index:50;transition:transform .24s ease;will-change:transform}
.tw-d .scroll-header.nav-hidden{transform:translateY(-100%)}
.tw-d .scroll-header > .top{position:static;top:auto}
.tw-d .top-in{padding:8px clamp(16px,3vw,32px)}
.tw-d .brand{font-size:15px}
.tw-d .brand .sq{width:28px;height:28px;font-size:13px}
.tw-d .search{padding:6px 12px}
.tw-d .ava{width:32px;height:32px}
.tw-d .profile-head{display:flex;align-items:center;gap:16px;margin-top:12px}
.tw-d .profile-ava{display:grid;place-items:center;width:72px;height:72px;flex:none;border:3px solid var(--line);border-radius:22px;font-size:28px;font-weight:800;box-shadow:4px 4px 0 var(--line)}
.tw-d .profile-ava.preview{width:44px;height:44px;font-size:17px;border-radius:14px;box-shadow:2px 2px 0 var(--line)}
.tw-d .profile-copy h1{margin-top:0}
.tw-d .profile-copy .lede{margin-top:6px;white-space:pre-wrap}
.tw-d .account-bar{display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin-top:16px;padding-top:14px;border-top:1.5px solid var(--line-soft)}
.tw-d .account-name{font-family:var(--mono);font-size:11px;color:var(--muted);margin-right:auto}
.tw-d .profile-form{margin-top:22px}
.tw-d .color-row{display:flex;flex-wrap:wrap;align-items:flex-end;gap:18px;margin-top:14px}
.tw-d .color-field{display:flex;flex-direction:column;gap:6px}
.tw-d .color-field .field-label{margin-top:0}
.tw-d .color-field input[type="color"]{width:64px;height:38px;padding:3px;border:2px solid var(--line);border-radius:10px;background:var(--paper);cursor:pointer}

.tw-d .theme-btn,.tw-d .ava{flex:none}
.tw-d .nav-btn{display:grid;place-items:center;width:34px;height:34px;border:2px solid var(--line);border-radius:10px;background:var(--paper);color:var(--ink);box-shadow:2px 2px 0 var(--line);cursor:pointer;transition:.14s}
.tw-d .nav-btn:hover{background:var(--sky);transform:translate(-1px,-1px);box-shadow:3px 3px 0 var(--line)}
@keyframes act-pop{0%{transform:scale(1)}40%{transform:scale(1.16)}100%{transform:scale(1)}}
.tw-d .act.pulse{animation:act-pop .34s ease}
@media (prefers-reduced-motion: reduce){.tw-d .act.pulse{animation:none}}

`;

export const pagesBCss = `
.tw-b{--ink:#DCF6F8;--ink-2:#9CC3CB;--accent:var(--cyan)}
.tw-b .page-head{margin:40px 0 24px}
.tw-b .crumb{display:flex;flex-wrap:wrap;align-items:center;gap:8px;font-family:var(--mono);font-size:10px;letter-spacing:.08em;color:var(--muted)}
.tw-b .crumb a{color:var(--cyan);font-weight:500}
.tw-b .page-head h1{margin-top:12px;font-size:clamp(26px,3.4vw,38px);line-height:1.2;letter-spacing:-.02em;font-weight:600;color:var(--ink)}
.tw-b .page-head .lede{margin-top:10px;max-width:60ch;color:var(--ink-2);font-size:13.5px}
.tw-b .page-head .row-meta{display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin-top:14px;font-family:var(--mono);font-size:10px;letter-spacing:.06em;color:var(--muted)}
.tw-b .page-head .pill{border:1px solid var(--line);border-radius:3px;padding:3px 9px}
.tw-b .empty{border:1px dashed var(--line);border-radius:6px;padding:30px 20px;text-align:center;color:var(--muted);font-size:13px}
.tw-b .pager{display:flex;flex-wrap:wrap;gap:8px;margin-top:20px}
.tw-b .pager a,.tw-b .pager span{border:1px solid var(--line);border-radius:4px;padding:6px 12px;font-family:var(--mono);font-size:10.5px;color:var(--muted)}
.tw-b .pager span{color:var(--accent);border-color:rgba(90,230,236,.5)}
.tw-b .post{position:relative;background:rgba(7,26,35,.72);border:1px solid var(--line);border-radius:6px;padding:16px 18px;margin-top:12px}
.tw-b .post-head{display:flex;flex-wrap:wrap;align-items:center;gap:12px;font-family:var(--mono);font-size:10px;color:var(--muted)}
.tw-b .post-head .who{display:inline-flex;align-items:center;gap:7px;font-weight:500;color:var(--ink);font-size:11px}
.tw-b .post-head .dot{width:24px;height:24px;flex:none;border-radius:4px;border:1px solid rgba(90,230,236,.45);background:rgba(90,230,236,.1);display:grid;place-items:center;font-size:9px;font-weight:600;color:var(--accent)}
.tw-b .post-body{margin-top:12px;font-size:14px;line-height:1.85;white-space:pre-wrap;word-break:break-word;color:var(--ink)}
.tw-b .post-foot{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin-top:12px;padding-top:10px;border-top:1px solid var(--line-soft)}
.tw-b .post-foot .metric{border:1px solid var(--line);border-radius:3px;padding:3px 8px;font-family:var(--mono);font-size:10px;color:var(--muted)}
.tw-b .post-foot .metric.liked{color:var(--accent);border-color:rgba(90,230,236,.45)}
.tw-b .form-card{background:rgba(7,26,35,.72);border:1px solid var(--line);border-radius:6px;padding:16px 18px;margin-top:20px}
.tw-b .form-card h2{font-size:13px;font-weight:600;letter-spacing:.02em}
.tw-b .form-card textarea,.tw-b .form-card input,.tw-b .form-card select{width:100%;margin-top:12px;border:1px solid var(--line);border-radius:4px;background:rgba(4,15,22,.6);color:var(--ink);padding:10px 12px;font:inherit;font-size:13px}
.tw-b .form-card textarea{min-height:110px;resize:vertical}
.tw-b .form-card .form-foot{display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin-top:12px}
.tw-b .form-card .hint{font-family:var(--mono);font-size:10px;color:var(--muted)}
.tw-b .notice{border:1px solid var(--line);border-radius:4px;padding:10px 14px;margin-top:16px;background:rgba(7,26,35,.7);font-size:12px;color:var(--muted)}
.tw-b .notice.error{border-color:rgba(220,120,120,.4);color:#F2B8B8}
.tw-b .detail-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px}
.tw-b .field-label{display:block;margin-top:16px;font-family:var(--mono);font-size:10px;letter-spacing:.08em;color:var(--muted)}
.tw-b .hub-search{display:flex;gap:8px;margin:20px 0 14px}
.tw-b .hub-search input{flex:1;min-width:0;border:1px solid var(--line);border-radius:4px;background:rgba(90,230,236,.03);padding:10px 12px;font:inherit;font-family:var(--mono);font-size:12px;color:var(--ink)}
.tw-b .hub-search button{border:1px solid var(--line);border-radius:4px;background:var(--accent);color:#04121A;padding:0 16px;font-family:var(--mono);font-size:11px;font-weight:600}
.tw-b .hub-tabs{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin:4px 0 20px;font-family:var(--mono);font-size:10.5px}
.tw-b .hub-tabs a{border:1px solid var(--line);border-radius:3px;padding:4px 10px;color:var(--muted)}
.tw-b .hub-tabs a.on{color:#04121A;background:var(--accent);border-color:var(--accent)}
.tw-b .hub-sort{margin-left:auto;display:flex;gap:4px}
.tw-b .home-nav{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
.tw-b .home-nav a{position:relative;display:block;border:1px solid var(--line);border-radius:6px;background:rgba(7,26,35,.6);padding:16px 18px}
.tw-b .home-nav a:hover{border-color:rgba(90,230,236,.45);background:rgba(90,230,236,.05)}
.tw-b .home-nav .n{font-family:var(--mono);font-size:9px;letter-spacing:.14em;color:var(--teal)}
.tw-b .home-nav h3{margin-top:8px;font-size:15px;font-weight:600}
.tw-b .home-nav p{margin-top:3px;font-size:11.5px;color:var(--muted)}
.tw-b .home-nav .go{position:absolute;right:16px;top:14px;font-family:var(--mono);font-size:12px;color:var(--accent)}
@media (max-width:720px){.tw-b .home-nav{grid-template-columns:1fr}}
.tw-b .board-dir{border-top:1px solid var(--line)}
.tw-b .board-dir>a{display:grid;grid-template-columns:62px minmax(0,1fr) auto 18px;gap:16px;align-items:center;padding:16px 8px;border-bottom:1px solid var(--line-soft);transition:background .16s;position:relative}
.tw-b .board-dir>a:hover{background:rgba(90,230,236,.045)}
.tw-b .board-dir>a:hover::before{content:"";position:absolute;left:0;top:0;bottom:0;width:2px;background:var(--cyan)}
.tw-b .board-dir .n{font-family:var(--mono);font-size:10px;color:var(--teal);letter-spacing:.12em}
.tw-b .board-dir .body{display:flex;flex-direction:column;gap:4px;min-width:0}
.tw-b .board-dir .name{font-size:15.5px;font-weight:600;letter-spacing:-.005em}
.tw-b .board-dir .desc{font-size:12px;color:var(--muted);line-height:1.7}
.tw-b .board-dir .c{font-family:var(--mono);font-size:10.5px;color:var(--muted);text-align:right;white-space:nowrap}
.tw-b .board-dir .go{font-family:var(--mono);font-size:12px;color:var(--accent);text-align:right}
@media (max-width:900px){
  .tw-b .bar nav{display:flex;order:4;width:100%;margin-left:0;gap:2px;overflow-x:auto;padding-bottom:2px;scrollbar-width:none}
  .tw-b .bar nav::-webkit-scrollbar{display:none}
  .tw-b .bar nav a{white-space:nowrap;flex:none}
}
@media (max-width:720px){.tw-b .board-dir>a{grid-template-columns:52px minmax(0,1fr) 16px;gap:10px}.tw-b .board-dir .c{display:none}}
.tw-b .cover{padding:clamp(26px,3.6vw,42px) 0 16px;max-width:70ch}
.tw-b .cover h1{font-size:clamp(28px,3.8vw,44px);margin-top:12px}
.tw-b .cover .lede{margin-top:12px}
.tw-b .cover-stats{display:flex;flex-wrap:wrap;gap:10px 18px;margin-top:16px;font-family:var(--mono);font-size:10px;letter-spacing:.14em;color:var(--muted)}
.tw-b .cover-stats b{color:var(--cyan);font-size:14px;margin-right:4px}
.tw-b .feed-cols{display:grid;grid-template-columns:216px minmax(0,1fr);gap:32px;align-items:start}
.tw-b .feed-side{position:sticky;top:72px}
.tw-b .side-title{font-family:var(--mono);font-size:9.5px;letter-spacing:.18em;color:var(--teal);margin-bottom:10px}
.tw-b .board-nav{display:flex;flex-direction:column}
.tw-b .board-nav a{display:flex;justify-content:space-between;gap:10px;padding:7px 8px;border-left:1px solid transparent;font-family:var(--mono);font-size:11.5px;color:var(--muted)}
.tw-b .board-nav a:hover{color:var(--cyan);background:rgba(90,230,236,.05)}
.tw-b .board-nav a.on{color:var(--cyan);border-left-color:var(--cyan);background:rgba(90,230,236,.07)}
.tw-b .board-nav i{font-style:normal;font-size:10px;color:#5C7E88}
.tw-b .feed-bar{display:flex;align-items:baseline;justify-content:space-between;gap:12px;padding-bottom:10px;border-bottom:1px solid var(--line)}
.tw-b .feed-bar h2{display:flex;align-items:center;gap:9px;font-family:var(--mono);font-size:11px;letter-spacing:.14em;color:var(--teal);font-weight:500}
.tw-b .feed-bar h2 .tick{width:6px;height:6px;background:var(--cyan);border-radius:1px}
.tw-b .feed-bar .hub-sort a{font-family:var(--mono);font-size:10px;letter-spacing:.08em;color:var(--muted);padding:3px 7px;border-radius:3px}
.tw-b .feed-bar .hub-sort a.on{color:#04121A;background:var(--cyan)}
.tw-b .hub-clear{margin-left:auto;font-family:var(--mono);font-size:10px;color:var(--cyan)}
.tw-b .banner{margin:22px 0 18px;border:1px solid var(--line);border-radius:6px;background:rgba(7,26,35,.6);padding:clamp(16px,2.4vw,22px)}
.tw-b .banner .page-head{margin:0}
.tw-b .pill-action{color:var(--cyan);border-color:rgba(90,230,236,.5);font-weight:600}
.tw-b .bd-drawer{display:none}
@media (max-width:900px){
  .tw-b .bd-drawer{display:block;position:static;order:2}
  .tw-b .bd-drawer summary{list-style:none;cursor:pointer;border:1px solid var(--line);border-radius:4px;padding:6px 9px;font-family:var(--mono);font-size:10px;letter-spacing:.14em;color:var(--muted)}
  .tw-b .bd-drawer summary::-webkit-details-marker{display:none}
  .tw-b .bd-drawer[open] summary{color:#04121A;background:var(--cyan);border-color:var(--cyan)}
  .tw-b .bd-panel{position:absolute;top:calc(100% + 6px);left:8px;right:8px;z-index:90;min-width:0;display:flex;flex-direction:column;background:#071A23;border:1px solid var(--line);border-radius:4px;padding:6px;box-shadow:0 24px 50px -24px rgba(0,0,0,.85)}
  .tw-b .bd-panel a{display:flex;justify-content:space-between;gap:10px;padding:6px 8px;font-family:var(--mono);font-size:11px;color:var(--muted)}
  .tw-b .bd-panel a:hover{color:var(--cyan);background:rgba(90,230,236,.08)}
  .tw-b .bd-panel i{font-style:normal;color:#5C7E88}
  .tw-b .feed-cols{grid-template-columns:1fr}
  .tw-b .feed-side{display:none}
  .tw-b .trow .num::before{content:"返信 "}
  .tw-b[lang="en"] .trow .num::before{content:"replies "}
  .tw-b .trow .acts .save{position:static}
}
.tw-b .cover{display:grid;grid-template-columns:minmax(0,1fr) 300px;gap:32px;align-items:center;max-width:none}
.tw-b .chart{border:1px solid var(--line);background:rgba(7,26,35,.72);padding:14px 16px 12px}
.tw-b .chart-head{display:flex;justify-content:space-between;align-items:baseline;font-family:var(--mono);font-size:9px;letter-spacing:.16em;color:var(--teal)}
.tw-b .chart-head b{font-size:22px;color:var(--cyan);letter-spacing:-.02em}
.tw-b .chart-bars{display:flex;align-items:flex-end;gap:6px;height:92px;margin:12px 0 8px}
.tw-b .chart-bar{flex:1;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;gap:5px;height:100%;min-width:0}
.tw-b .chart-bar i{display:block;width:100%;background:linear-gradient(180deg,var(--cyan),rgba(90,230,236,.25));border-radius:1px}
.tw-b .chart-bar span{font-family:var(--mono);font-size:8px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}
.tw-b .chart-foot{border-top:1px solid var(--line-soft);padding-top:8px;font-family:var(--mono);font-size:9px;color:var(--muted)}
.tw-b .lang{display:flex;flex:none;border:1px solid var(--line);border-radius:4px;overflow:hidden}
.tw-b .lang form{display:contents}
.tw-b .lang button{font-family:var(--mono);font-size:10px;letter-spacing:.1em;padding:5px 7px;color:var(--muted)}
.tw-b .lang button.on{background:var(--cyan);color:#04121A}
.tw-b .acts{display:flex;gap:6px;margin-left:auto}
.tw-b .act{display:inline-flex;align-items:center;gap:5px;border:1px solid var(--line);border-radius:3px;padding:3px 7px;font-family:var(--mono);font-size:10px;color:var(--muted);transition:.16s;line-height:1.2}
.tw-b .act:hover{color:var(--cyan);border-color:rgba(90,230,236,.45);background:rgba(90,230,236,.06)}
.tw-b .act.on{color:#04121A;background:var(--cyan);border-color:var(--cyan)}
.tw-b .act.on svg{fill:#04121A}
.tw-b .act.save{display:inline-flex;position:static;width:auto;height:auto;padding:3px 7px;border:1px solid var(--line);border-radius:3px;background:none;color:var(--muted)}
.tw-b .act.save.on{background:var(--cyan);border-color:var(--cyan);color:#04121A}
.tw-b .act-lg{padding:7px 11px;font-size:11px}
.tw-b .act-lg svg{width:15px;height:15px}
.tw-b .bn-group{display:flex;flex-direction:column;margin-top:8px}
.tw-b .bn-label{display:flex;align-items:center;gap:6px;font-family:var(--mono);font-size:9px;letter-spacing:.14em;color:var(--teal);padding:2px 8px 4px}
.tw-b .bn-dot{width:5px;height:5px;background:var(--cyan);border-radius:1px}
.tw-b .bn-dot.comm{background:var(--muted)}
.tw-b .board-nav a.off{color:var(--text)}
.tw-b .board-nav a.comm{color:var(--muted);font-style:italic}
.tw-b .bn-empty{font-family:var(--mono);font-size:10px;color:#5C7E88;padding:2px 8px}
.tw-b .bar .board-nav{overflow:visible;width:auto;order:0;padding-bottom:0}
.tw-b .pill.kind{color:#04121A;background:var(--cyan);border-color:var(--cyan)}
.tw-b .pill.kind.comm{background:transparent;color:var(--muted);border-color:var(--line)}
.tw-b .thead,.tw-b .trow{grid-template-columns:56px max-content minmax(24px,1fr) 104px 54px 50px 104px}
.tw-b .thead span:nth-child(n+5){text-align:right}
@media (max-width:900px){.tw-b .cover{grid-template-columns:1fr}.tw-b .chart{display:none}}
.tw-b .act svg{flex:none}
.tw-b .root-post{position:relative;border:1px solid var(--line);background:rgba(7,26,35,.72);padding:18px 20px;margin-top:8px}
.tw-b .root-post::before{content:"";position:absolute;left:0;top:0;bottom:0;width:2px;background:var(--cyan)}
.tw-b .root-head{display:flex;flex-wrap:wrap;align-items:center;gap:10px;font-family:var(--mono);font-size:10px;color:var(--muted)}
.tw-b .root-no{color:var(--cyan);font-size:12px;border:1px solid rgba(90,230,236,.4);border-radius:3px;padding:0 6px}
.tw-b .root-tag{margin-left:auto;font-family:var(--mono);font-size:9px;letter-spacing:.16em;color:var(--teal);border:1px solid var(--line);padding:1px 6px;border-radius:3px}
.tw-b .root-body{margin-top:14px;font-size:14.5px;line-height:1.9;white-space:pre-wrap;word-break:break-word;color:var(--text)}
.tw-b .comments-head{margin-top:26px}
.tw-b .cmt-tree{display:flex;flex-direction:column;gap:10px;margin-top:10px}
.tw-b .cmt{position:relative;border:0;border-radius:0;padding:0;background:none}
.tw-b .cmt-tree > .cmt{border-top:1px solid var(--line-soft);padding:14px 0}
.tw-b .cmt-tree > .cmt:first-child{border-top:0;padding-top:4px}
.tw-b .cmt-head{display:flex;flex-wrap:wrap;align-items:center;gap:9px;font-family:var(--mono);font-size:10px;color:var(--muted)}
.tw-b .cmt-no{color:#04121A;background:var(--cyan);border-radius:2px;padding:0 5px;font-size:10px;font-weight:600}
.tw-b .cmt-who{display:inline-flex;align-items:center;gap:6px;color:var(--text);font-size:11px}
.tw-b .cmt-who .dot{width:18px;height:18px;border-radius:3px;border:1px solid rgba(90,230,236,.4);background:rgba(90,230,236,.14);display:grid;place-items:center;font-size:8px;color:var(--cyan)}
.tw-b .cmt-body{margin-top:8px;font-size:13.5px;line-height:1.85;white-space:pre-wrap;word-break:break-word;color:var(--text)}
.tw-b .cmt-acts{margin-top:9px}
.tw-b .cmt-kids{margin-top:10px;margin-left:10px;padding-left:16px;border-left:2px solid rgba(90,230,236,.3);display:flex;flex-direction:column;gap:10px}
.tw-b .cmt-kids > .cmt{position:relative}
.tw-b .cmt-kids > .cmt::before{content:"";position:absolute;left:-18px;top:14px;width:12px;height:1px;background:rgba(90,230,236,.3)}
.tw-b .cmt-fold{display:grid;place-items:center;width:18px;height:18px;flex:none;border:1px solid var(--line);border-radius:3px;background:rgba(90,230,236,.05);font-family:var(--mono);font-size:11px;line-height:1;color:var(--cyan);cursor:pointer}
.tw-b .cmt-fold:hover{background:rgba(90,230,236,.16)}
.tw-b .cmt.folded{opacity:.8}
.tw-b .cmt.folded .cmt-head{padding:2px 0}
.tw-b .cmt-folded{border:1px dashed rgba(90,230,236,.45);border-radius:3px;padding:2px 8px;font-family:var(--mono);font-size:10px;color:var(--cyan);background:none;cursor:pointer}
.tw-b .cmt-folded:hover{background:rgba(90,230,236,.1)}
.tw-b .reply-box{margin:0}
.tw-b .reply-box > summary{list-style:none}
.tw-b .reply-box > summary::-webkit-details-marker{display:none}
.tw-b .reply-box[open]{flex:1 0 100%;margin-top:6px}
.tw-b .reply-form{display:flex;flex-direction:column;gap:8px;width:100%}
.tw-b .reply-form textarea{border:1px solid var(--line);border-radius:4px;background:rgba(4,15,22,.6);color:var(--text);padding:9px 11px;font:inherit;font-size:13px;min-height:74px;resize:vertical}
.tw-b .reply-form .btn{align-self:flex-start}
.tw-b .bn-create{margin-top:8px;font-family:var(--mono);font-size:10.5px;letter-spacing:.08em;color:var(--teal);padding:6px 8px;border:1px dashed var(--line);border-radius:3px;text-align:center}
.tw-b .bn-create:hover{color:var(--cyan);border-color:rgba(90,230,236,.5)}
.tw-b .pill.role{color:var(--teal);border-color:rgba(90,230,236,.3)}
.tw-b .nav-left{display:flex;gap:5px;flex:none}
.tw-b .scroll-header{position:sticky;top:0;z-index:50;transition:transform .24s ease;will-change:transform}
.tw-b .scroll-header.nav-hidden{transform:translateY(-100%)}
.tw-b .scroll-header > .bar{position:static;top:auto}
.tw-b .profile-head{display:flex;align-items:center;gap:16px;margin-top:12px}
.tw-b .profile-ava{display:grid;place-items:center;width:70px;height:70px;flex:none;border:1px solid var(--line);border-radius:6px;font-family:var(--mono);font-size:24px;color:#04121A}
.tw-b .profile-ava.preview{width:40px;height:40px;font-size:15px}
.tw-b .profile-copy .lede{margin-top:6px;white-space:pre-wrap}
.tw-b .account-bar{display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin-top:16px;padding-top:12px;border-top:1px solid var(--line-soft)}
.tw-b .account-name{font-family:var(--mono);font-size:10px;letter-spacing:.1em;color:var(--muted);margin-right:auto}
.tw-b .account-bar .btn{border:1px solid var(--line);padding:8px 13px;color:var(--text);background:rgba(90,230,236,.04);font-family:var(--mono);font-size:11px;letter-spacing:.08em}
.tw-b .account-bar .btn:hover{border-color:rgba(90,230,236,.5);color:var(--cyan)}
.tw-b .account-bar .btn-p{background:var(--cyan);color:#04121A;border-color:var(--cyan);font-weight:600}
.tw-b .color-row{display:flex;flex-wrap:wrap;align-items:flex-end;gap:18px;margin-top:14px}
.tw-b .color-field{display:flex;flex-direction:column;gap:6px}
.tw-b .color-field .field-label{margin-top:0}
.tw-b .color-field input[type="color"]{width:60px;height:34px;padding:2px;border:1px solid var(--line);border-radius:4px;background:rgba(4,15,22,.6);cursor:pointer}

.tw-b .theme-btn,.tw-b .who{flex:none}
.tw-b .nav-btn{display:grid;place-items:center;width:28px;height:28px;border:1px solid var(--line);border-radius:4px;background:rgba(90,230,236,.04);color:var(--muted);cursor:pointer;transition:.16s}
.tw-b .nav-btn:hover{color:var(--cyan);border-color:rgba(90,230,236,.5)}
.tw-b .act.pulse{animation:act-pop .34s ease}
@media (prefers-reduced-motion: reduce){.tw-b .act.pulse{animation:none}}

`;
