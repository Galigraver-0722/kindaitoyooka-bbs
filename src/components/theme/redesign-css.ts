/** Campus commons: shared geometry with independent day and night palettes. */
export const redesignCss = `
.tw-d{--bg:#f5f7f8;--paper:#fff;--panel:#fff;--ink:#142d38;--text:#142d38;--ink-2:#405c68;--muted:#526e79;--cyan:#76e0cb;--cyan-deep:#086d61;--sky:#e2f5ef;--line:#d6e2e6;--line-soft:#e8eef0;--focus-ring:#087b68;--shadow:0 12px 32px -20px #23485430;--hero:#e4f4ef}
.tw-b{--bg:#0c171e;--paper:#14252f;--panel:#14252f;--panel2:#1b303b;--ink:#e8f3f5;--text:#e8f3f5;--ink-2:#b7cbd2;--muted:#9ab5c0;--cyan:#8be6cf;--cyan-deep:#8be6cf;--teal:#8be6cf;--sky:#213d40;--line:#2c444e;--line-soft:#223740;--focus-ring:#8be6cf;--shadow:0 16px 36px -20px #0008;--hero:#142c30}
:is(.tw-d,.tw-b){background:var(--bg);color:var(--ink);font-size:15px;line-height:1.7;min-height:calc(100vh - 200px)}
.tw-b::after{display:none}
:is(.tw-d,.tw-b) main{width:100%;max-width:1280px;margin:0 auto;padding:0 clamp(20px,4vw,56px) 88px}
:is(.tw-d,.tw-b) .scroll-header{position:sticky;top:0;z-index:100;transform:none;will-change:auto;background:color-mix(in srgb,var(--bg) 94%,transparent);backdrop-filter:blur(18px);border-bottom:1px solid var(--line)}
:is(.tw-d,.tw-b) .scroll-header:focus-within{transform:none}
:is(.tw-d,.tw-b) .site-nav{max-width:1440px;margin:auto;display:flex;align-items:center;gap:26px;min-height:82px;padding:16px clamp(20px,3vw,42px)}
:is(.tw-d,.tw-b) .site-brand{display:flex;align-items:center;gap:11px;flex:none;font-size:16px;font-weight:800;letter-spacing:.1em;line-height:1.2}
:is(.tw-d,.tw-b) .brand-symbol{display:grid;place-items:center;width:42px;height:42px;background:var(--cyan);color:#142d38;border-radius:14px 14px 4px 14px;font-size:21px;letter-spacing:0;transform:rotate(-5deg)}
:is(.tw-d,.tw-b) .brand-sub{display:block;font-size:8px;color:var(--muted);letter-spacing:.13em;margin-top:6px;font-weight:600}
:is(.tw-d,.tw-b) .nav-search{display:flex;align-items:center;gap:10px;flex:1;max-width:440px;min-width:100px;padding:9px 14px;border:1px solid var(--line);border-radius:12px;background:var(--paper);color:var(--muted)}
:is(.tw-d,.tw-b) .nav-search:focus-within{border-color:var(--focus-ring);box-shadow:0 0 0 3px color-mix(in srgb,var(--cyan) 20%,transparent)}
:is(.tw-d,.tw-b) .nav-search input{width:100%;background:none;border:0;font:inherit;font-size:14px;color:var(--ink);outline:0;box-shadow:none;padding:0}
:is(.tw-d,.tw-b) .nav-search kbd{flex:none;font-size:10px;border:1px solid var(--line);padding:0 5px;border-radius:4px}
:is(.tw-d,.tw-b) .nav-controls{display:flex;align-items:center;gap:10px;margin-left:auto;flex:none}
:is(.tw-d,.tw-b) :is(.ann-btn,.inbox-btn,.theme-btn,.ava){width:40px;height:40px;min-height:40px;border:1px solid var(--line);border-radius:12px;background:var(--paper);color:var(--ink);box-shadow:none;display:flex;align-items:center;justify-content:center;padding:0;flex:none}
:is(.tw-d,.tw-b) .theme-btn span{display:none}
:is(.tw-d,.tw-b) .theme-btn svg{width:18px;height:18px}
:is(.tw-d,.tw-b) .lang{border:1px solid var(--line);border-radius:10px;box-shadow:none;padding:3px;background:var(--paper)}
:is(.tw-d,.tw-b) .lang button{min-height:30px;padding:4px 6px;font-size:11px;border-radius:7px}
:is(.tw-d,.tw-b) .lang button.on{background:var(--sky);color:var(--ink)}
:is(.tw-d,.tw-b) .adm-entry{font-size:11px;padding:8px;border:0;box-shadow:none}
:is(.tw-d,.tw-b) .board-menu summary{display:flex;align-items:center;gap:8px;cursor:pointer;font-size:12px;font-weight:700;min-height:40px;list-style:none}
:is(.tw-d,.tw-b) .board-menu summary::-webkit-details-marker{display:none}
:is(.tw-d,.tw-b) .board-menu-panel{position:absolute;right:24px;top:calc(100% + 8px);width:min(360px,calc(100vw - 40px));max-height:70vh;overflow:auto;background:var(--paper);border:1px solid var(--line);border-radius:18px;padding:18px;box-shadow:var(--shadow);animation:panel-reveal .2s ease}
:is(.tw-d,.tw-b) .skip-link{position:fixed;top:8px;left:12px;z-index:300;padding:12px 20px;background:var(--cyan);color:#142d38;border-radius:8px;transform:translateY(-150%)}
:is(.tw-d,.tw-b) .skip-link:focus{transform:none}
:is(.tw-d,.tw-b) #page-content{scroll-margin-top:100px}
:is(.tw-d,.tw-b) .cover{position:relative;display:grid;grid-template-columns:minmax(0,1.3fr) minmax(260px,.8fr);align-items:center;gap:24px;margin:34px 0 44px;padding:clamp(28px,4vw,54px);border:1px solid var(--line);border-radius:28px;background:radial-gradient(ellipse at 90% 10%,color-mix(in srgb,var(--cyan) 20%,transparent),transparent 65%),var(--hero);overflow:hidden;max-width:none}
:is(.tw-d,.tw-b) .hero-eyebrow{display:flex;align-items:center;gap:9px;font-size:10px;font-weight:700;letter-spacing:.13em;color:var(--cyan-deep)}
:is(.tw-d,.tw-b) .hero-eyebrow>span{width:7px;height:7px;background:var(--cyan-deep);border-radius:50%}
:is(.tw-d,.tw-b) .cover h1{font-size:clamp(32px,4.2vw,54px);font-weight:800;line-height:1.23;letter-spacing:-.05em;margin:20px 0 0}
:is(.tw-d,.tw-b) .cover h1 em{font-style:normal;color:var(--cyan-deep)}
:is(.tw-d,.tw-b) .cover .lede{font-size:14px;line-height:1.9;max-width:42ch;color:var(--ink-2);margin-top:18px}
:is(.tw-d,.tw-b) .hero-actions{display:flex;flex-wrap:wrap;align-items:center;gap:24px;margin-top:26px}
:is(.tw-d,.tw-b) .hero-browse{font-size:12px;font-weight:600;display:flex;gap:12px;align-items:center}
:is(.tw-d,.tw-b) .hero-stats{display:flex;flex-wrap:wrap;gap:18px;color:var(--muted);font-size:11px;margin-top:26px}
:is(.tw-d,.tw-b) .community-art{position:relative;height:300px;isolation:isolate}
:is(.tw-d,.tw-b) .art-orbit{position:absolute;inset:15px;border:1px dashed color-mix(in srgb,var(--cyan-deep) 35%,transparent);border-radius:50%;transform:rotate(-25deg)}
:is(.tw-d,.tw-b) .orbit-two{inset:45px -15px;transform:rotate(35deg)}
:is(.tw-d,.tw-b) .art-note{position:absolute;width:220px;height:200px;left:50%;top:50%;padding:24px;border-radius:18px;box-shadow:0 20px 45px -22px #06233050;display:flex;flex-direction:column;border:1px solid #142d381a}
:is(.tw-d,.tw-b) .note-back{background:#b6d7f1;color:#23485c;transform:translate(-35%,-63%) rotate(13deg)}
:is(.tw-d,.tw-b) .note-front{background:#fffdf5;color:#142d38;transform:translate(-65%,-35%) rotate(-9deg)}
:is(.tw-d,.tw-b) .art-note>span{font-family:var(--mono);font-size:8px;letter-spacing:.1em}
:is(.tw-d,.tw-b) .art-note b{font-size:35px;letter-spacing:-.06em;margin-top:16px;font-weight:800}
:is(.tw-d,.tw-b) .art-dot{font-size:18px;margin-left:10px;color:#169c87}
:is(.tw-d,.tw-b) .art-lines{display:grid;gap:7px;margin-top:12px}
:is(.tw-d,.tw-b) .art-lines i{display:block;width:85%;height:5px;border-radius:4px;background:#dce6e2}
:is(.tw-d,.tw-b) .art-lines i:nth-child(2){width:65%}
:is(.tw-d,.tw-b) .art-lines i:nth-child(3){width:40%}
:is(.tw-d,.tw-b) .art-avatars{display:flex;margin-top:14px}
:is(.tw-d,.tw-b) .art-avatars i{font-style:normal;display:grid;place-items:center;width:28px;height:28px;border-radius:50%;background:#76e0cb;border:2px solid #fffdf5;font-size:10px;margin-right:-5px}
:is(.tw-d,.tw-b) .art-avatars i:nth-child(2){background:#b6d7f1}
:is(.tw-d,.tw-b) .art-star{position:absolute;right:0;top:0;font-size:76px;line-height:1;color:var(--cyan-deep)}
:is(.tw-d,.tw-b) .art-label{position:absolute;right:0;bottom:-10px;font-family:var(--mono);font-size:8px;letter-spacing:.15em;color:var(--muted)}
:is(.tw-d,.tw-b) .feed-cols{display:grid;grid-template-columns:210px minmax(0,1fr);gap:36px;align-items:start;scroll-margin-top:110px}
:is(.tw-d,.tw-b) .feed-side{position:sticky;top:108px}
:is(.tw-d,.tw-b) .side-title{font-size:11px;font-weight:700;letter-spacing:.08em;margin-bottom:16px;color:var(--muted)}
:is(.tw-d,.tw-b) .board-nav{display:flex;flex-direction:column;gap:5px;margin:0;padding:0}
:is(.tw-d,.tw-b) .board-nav a{display:flex;justify-content:space-between;align-items:center;padding:11px 12px;min-height:44px;border:1px solid transparent;border-radius:10px;background:transparent;box-shadow:none;font-size:12px;color:var(--ink-2);font-weight:600}
:is(.tw-d,.tw-b) .board-nav a.on{background:var(--sky);color:var(--cyan-deep);border-color:transparent}
:is(.tw-d,.tw-b) .board-nav a.on i{color:var(--cyan-deep)}
:is(.tw-d,.tw-b) .board-nav a.comm{border:1px solid transparent;color:var(--ink-2)}
:is(.tw-d,.tw-b) .board-nav a:hover{background:var(--paper);box-shadow:none;transform:none;border-color:var(--line)}
:is(.tw-d,.tw-b) .board-nav .bn-create{border:1px dashed var(--line);justify-content:center;margin-top:12px;color:var(--cyan-deep)}
:is(.tw-d,.tw-b) .bn-label{font-size:9px;letter-spacing:.1em;margin:18px 0 7px 12px}
:is(.tw-d,.tw-b) .feed-bar{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:16px;margin-bottom:18px}
:is(.tw-d,.tw-b) .feed-bar h2{font-size:22px;letter-spacing:-.03em;font-weight:750}
:is(.tw-d,.tw-b) .feed-bar .tick{display:none}
:is(.tw-d,.tw-b) .hub-sort{margin-left:0;display:flex;gap:3px;border:1px solid var(--line);border-radius:10px;padding:3px;background:var(--paper)}
:is(.tw-d,.tw-b) .feed-bar .hub-sort a{font-family:var(--sans);padding:7px 10px;border-radius:7px;font-size:11px;letter-spacing:0;color:var(--muted)}
:is(.tw-d,.tw-b) .feed-bar .hub-sort a.on{background:var(--sky);color:var(--cyan-deep)}
:is(.tw-d,.tw-b) .hub-tabs{display:flex;gap:18px;border-bottom:1px solid var(--line);margin:0 0 22px;padding:0;flex-wrap:wrap}
:is(.tw-d,.tw-b) .hub-tabs a{border:0;border-bottom:2px solid transparent;border-radius:0;background:none;color:var(--muted);padding:0 1px 12px;font-size:13px;font-weight:600;box-shadow:none}
:is(.tw-d,.tw-b) .hub-tabs a.on{border-bottom-color:var(--cyan-deep);color:var(--ink);background:none}
:is(.tw-d,.tw-b) .cards{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}
:is(.tw-d,.tw-b) .card{display:flex;flex-direction:column;background:var(--paper);border:1px solid var(--line);border-radius:18px;box-shadow:0 2px 3px #00000003;padding:23px;min-height:235px;transition:transform .25s var(--ease-out),box-shadow .25s ease,border-color .25s ease}
:is(.tw-d,.tw-b) .card-top{display:flex;justify-content:space-between;gap:10px;margin-bottom:16px}
:is(.tw-d,.tw-b) .bo{display:inline-flex;align-items:center;gap:6px;border:0;border-radius:6px;background:var(--sky);color:var(--cyan-deep);font-size:10px;font-weight:600;padding:4px 8px}
:is(.tw-d,.tw-b) .bo.cy{background:var(--sky)}
:is(.tw-d,.tw-b) .card h3{font-size:17px;line-height:1.6;font-weight:700;letter-spacing:-.02em}
:is(.tw-d,.tw-b) .excerpt{color:var(--ink-2);font-size:13px;line-height:1.8;margin-top:9px}
:is(.tw-d,.tw-b) .tags{display:flex;gap:6px;flex-wrap:wrap;margin:14px 0}
:is(.tw-d,.tw-b) .tag{border:0;background:var(--bg);border-radius:5px;color:var(--muted);font-size:10px;padding:2px 7px}
:is(.tw-d,.tw-b) .card-foot{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:auto;padding-top:16px;border-top:1px solid var(--line-soft)}
:is(.tw-d,.tw-b) .card .who{display:flex;align-items:center;gap:6px;width:auto;height:auto;border:0;color:var(--muted);font-family:var(--sans);font-size:10px}
:is(.tw-d,.tw-b) .who .dot{display:grid;place-items:center;width:25px;height:25px;background:var(--sky);color:var(--ink);border:1px solid var(--line);border-radius:50%;font-size:10px;animation:none;box-shadow:none}
:is(.tw-d,.tw-b) .act{min-height:32px;min-width:32px;border:1px solid transparent;border-radius:8px;background:var(--bg);padding:6px 9px;font-size:11px;color:var(--muted);box-shadow:none}
:is(.tw-d,.tw-b) .act.on{background:var(--sky);color:var(--cyan-deep);border-color:var(--line)}
:is(.tw-d,.tw-b) .act.save{border:1px solid transparent;border-radius:8px;padding:6px 9px}
:is(.tw-d,.tw-b) .btn{min-height:44px;padding:10px 18px;border:1px solid var(--line);border-radius:10px;background:var(--paper);color:var(--ink);box-shadow:none;font-family:var(--sans);font-size:13px;font-weight:650;letter-spacing:0;transition:background .18s,transform .18s}
:is(.tw-d,.tw-b) .btn-p{background:var(--cyan);border-color:var(--cyan);color:#142d38;gap:20px}
:is(.tw-d,.tw-b) .btn:hover{box-shadow:none;transform:translateY(-1px);border-color:var(--focus-ring)}
:is(.tw-d,.tw-b) .fab{width:auto;height:52px;padding:0 20px;display:flex;gap:10px;align-items:center;justify-content:center;bottom:max(24px,env(safe-area-inset-bottom));right:24px;border:1px solid #142d381a;border-radius:16px;background:var(--cyan);color:#142d38;box-shadow:0 8px 24px #06233025;font-size:13px;font-weight:700}
:is(.tw-d,.tw-b) .fab:hover{transform:translateY(-3px);box-shadow:0 12px 30px #06233030}
:is(.tw-d,.tw-b) .page-head{margin:42px 0 28px}
:is(.tw-d,.tw-b) .page-head h1{font-size:clamp(28px,4vw,44px);font-weight:750;letter-spacing:-.04em;line-height:1.3}
:is(.tw-d,.tw-b) .crumb{font-size:11px;letter-spacing:0}
:is(.tw-d,.tw-b) :is(.form-card,.root-post,.post,.profile-banner,.banner,.profile-reply,.confirm-card){background:var(--paper);border:1px solid var(--line);border-radius:20px;box-shadow:var(--shadow);padding:clamp(20px,3vw,32px)}
:is(.tw-d,.tw-b) :is(.form-card input:not([type=checkbox]):not([type=hidden]),.form-card select,.form-card textarea,.reply-form textarea,.drawer-form textarea){border:1px solid var(--line);border-radius:10px;background:var(--bg);color:var(--ink);font-size:16px;line-height:1.6;padding:12px 14px}
:is(.tw-d,.tw-b) .field-label{font-size:13px;letter-spacing:0;font-weight:650;margin-top:20px;color:var(--ink)}
:is(.tw-d,.tw-b) .form-card .hint{font-family:var(--sans);font-size:12px;color:var(--muted)}
:is(.tw-d,.tw-b) .form-card .form-foot{margin-top:24px;gap:16px}
:is(.tw-d,.tw-b) .form-card h2{font-size:18px;font-weight:700}
:is(.tw-d,.tw-b) main.auth-page{max-width:680px}
:is(.tw-d,.tw-b) .notice{border:1px solid var(--line);border-left:3px solid var(--cyan-deep);background:var(--paper);border-radius:10px;box-shadow:none;font-size:13px;padding:14px 18px}
:is(.tw-d,.tw-b) .notice.error{border-left-color:#db756d;background:color-mix(in srgb,#db756d 9%,var(--paper));color:var(--ink)}
:is(.tw-d,.tw-b) .root-body{font-size:16px;line-height:1.95}
:is(.tw-d,.tw-b) .cmt-body{font-size:15px;line-height:1.9}
:is(.tw-d,.tw-b) .cmt-tree>.cmt{padding:22px 0;border-top:1px solid var(--line)}
:is(.tw-d,.tw-b) .cmt-kids{border-left:2px solid var(--line);padding-left:18px}
:is(.tw-d,.tw-b) :is(.cmt-no,.root-no){border:0;background:var(--sky);color:var(--cyan-deep);box-shadow:none;border-radius:6px}
:is(.tw-d,.tw-b) .cmt-fold{width:28px;height:28px;border:1px solid var(--line);border-radius:8px;background:var(--paper)}
:is(.tw-d,.tw-b) .board-stats .bs{background:var(--bg);border:1px solid var(--line);box-shadow:none;border-radius:12px;padding:14px}
:is(.tw-d,.tw-b) .board-stats b{font-size:23px}
:is(.tw-d,.tw-b) .board-stats span{font-size:10px}
:is(.tw-d,.tw-b) .empty{padding:48px 24px;border:1px dashed var(--line);background:var(--paper);border-radius:18px;font-size:14px}
:is(.tw-d,.tw-b) .empty a{color:var(--cyan-deep);text-decoration:underline;text-underline-offset:4px}
:is(.tw-d,.tw-b) :is(.ann-panel,.inbox-panel){background:var(--paper);border:1px solid var(--line);border-radius:18px;box-shadow:0 20px 60px #0003}
:is(.tw-d,.tw-b) :is(.ann-head,.inbox-head){background:var(--paper);border-bottom:1px solid var(--line);padding:14px 18px}
:is(.tw-d,.tw-b) .ann-body{color:var(--ink-2);font-size:14px;line-height:1.85}
:is(.tw-d,.tw-b) :is(.ann-list li,.inbox-list a){padding:16px 18px}
:is(.tw-d,.tw-b) .inbox-excerpt{color:var(--muted);font-size:12px}
:is(.tw-d,.tw-b) :is(.doc-body p,.doc-body li){font-size:15px;line-height:1.95;color:var(--ink-2)}
:is(.tw-d,.tw-b) .doc-body h2{font-size:21px;margin-bottom:16px}
:is(.tw-d,.tw-b) .doc-body section{padding:28px 0;border-color:var(--line)}
:is(.tw-d,.tw-b) :is(.doc-toc a,.doc-links a){font-size:13px;color:var(--muted)}
:is(.tw-d,.tw-b) .pager a,:is(.tw-d,.tw-b) .pager span{border:1px solid var(--line);background:var(--paper);border-radius:9px;padding:9px 15px;box-shadow:none;font-size:12px}
:is(.tw-d,.tw-b) .pager span{background:var(--sky);color:var(--cyan-deep)}
:is(.tw-d,.tw-b) .trow{padding:20px 12px;border-color:var(--line)}
:is(.tw-d,.tw-b) .thead{font-size:10px;color:var(--muted)}
:is(.tw-d,.tw-b) .auth-link{color:var(--cyan-deep)}
@media(hover:hover) and (pointer:fine){:is(.tw-d,.tw-b) .card:hover{transform:translateY(-4px);box-shadow:var(--shadow);border-color:var(--focus-ring)}}
@media(prefers-reduced-motion:no-preference){
 :is(.tw-d,.tw-b) .cover-copy{animation:commons-enter .5s both}
 :is(.tw-d,.tw-b) .community-art{animation:commons-enter .7s .08s both}
 :is(.tw-d,.tw-b) .cards>.card{animation:commons-enter .45s both}
 :is(.tw-d,.tw-b) .cards>.card:nth-child(2){animation-delay:40ms}
 :is(.tw-d,.tw-b) .cards>.card:nth-child(3){animation-delay:80ms}
 :is(.tw-d,.tw-b) .cards>.card:nth-child(4){animation-delay:120ms}
 :is(.tw-d,.tw-b) .reply-box[open]>.reply-form{animation:commons-enter .2s both}
}
@keyframes commons-enter{from{opacity:0;translate:0 12px}to{opacity:1;translate:0 0}}
@media(max-width:1100px){
 :is(.tw-d,.tw-b) .site-nav{gap:16px;flex-wrap:wrap}
 :is(.tw-d,.tw-b) .nav-search{order:3;max-width:none;flex:1 0 100%}
 :is(.tw-d,.tw-b) .feed-cols{grid-template-columns:185px minmax(0,1fr);gap:24px}
 :is(.tw-d,.tw-b) .feed-side{top:160px}
 :is(.tw-d,.tw-b) .cover{grid-template-columns:minmax(0,1fr) 250px}
}
@media(max-width:800px){
 :is(.tw-d,.tw-b) .feed-cols{grid-template-columns:1fr}
 :is(.tw-d,.tw-b) .feed-side{display:none}
 :is(.tw-d,.tw-b) .cover{grid-template-columns:1fr;padding:32px;margin:24px 0 32px}
 :is(.tw-d,.tw-b) .community-art{display:none}
 :is(.tw-d,.tw-b) .cover h1{font-size:42px}
 :is(.tw-d,.tw-b) .cover .lede{max-width:50ch}
}
@media(max-width:580px){
 :is(.tw-d,.tw-b) main{padding:0 16px 96px}
 :is(.tw-d,.tw-b) .site-nav{padding:12px 16px;gap:12px}
 :is(.tw-d,.tw-b) .site-brand{font-size:13px;gap:8px}
 :is(.tw-d,.tw-b) .brand-symbol{width:34px;height:34px;font-size:18px;border-radius:10px}
 :is(.tw-d,.tw-b) .brand-sub{font-size:7px}
 :is(.tw-d,.tw-b) .nav-controls{gap:6px;flex-wrap:wrap;justify-content:flex-end}
 :is(.tw-d,.tw-b) .site-brand{flex:1}
 :is(.tw-d,.tw-b) .nav-controls{display:contents}
 :is(.tw-d,.tw-b) .board-menu{order:3}
 :is(.tw-d,.tw-b) .board-menu summary{font-size:11px;min-height:32px}
 :is(.tw-d,.tw-b) .lang{order:3;margin-left:auto}
 :is(.tw-d,.tw-b) .adm-entry{order:3}
 :is(.tw-d,.tw-b) .nav-search{order:4;flex-basis:100%;padding:10px 12px}
 :is(.tw-d,.tw-b) :is(.ann-btn,.inbox-btn,.theme-btn,.ava){width:36px;height:36px;min-height:36px;border-radius:10px}
 :is(.tw-d,.tw-b) .cover{padding:26px 22px;border-radius:20px}
 :is(.tw-d,.tw-b) .cover h1{font-size:34px}
 :is(.tw-d,.tw-b) .hero-eyebrow{font-size:9px}
 :is(.tw-d,.tw-b) .hero-actions{gap:16px}
 :is(.tw-d,.tw-b) .hero-stats{gap:12px;font-size:10px}
 :is(.tw-d,.tw-b) .cards{grid-template-columns:1fr}
 :is(.tw-d,.tw-b) .card{min-height:0;padding:20px}
 :is(.tw-d,.tw-b) .feed-bar h2{font-size:20px}
 :is(.tw-d,.tw-b) .fab{height:48px;padding:0 16px;right:16px;bottom:max(16px,env(safe-area-inset-bottom));font-size:12px}
 :is(.tw-d,.tw-b) .cmt-kids{margin-left:3px;padding-left:10px}
 :is(.tw-d,.tw-b) .cmt-kids>.cmt::before{display:none}
 :is(.tw-d,.tw-b) .page-head{margin-top:28px}
}
@media(prefers-reduced-motion:reduce){:is(.tw-d,.tw-b) *{animation:none!important;transition:none!important;scroll-behavior:auto!important}:is(.tw-d,.tw-b) .card:hover{transform:none}}

:is(.tw-d,.tw-b) .commons-footer{display:flex;justify-content:space-between;align-items:start;gap:36px;max-width:1168px;margin:0 auto;padding:32px 20px 100px;border-top:1px solid var(--line);color:var(--muted)}
:is(.tw-d,.tw-b) .commons-footer strong{font-size:12px;letter-spacing:.12em;color:var(--ink)}
:is(.tw-d,.tw-b) .commons-footer p{font-size:11px;max-width:55ch;line-height:1.9;margin-top:12px}
:is(.tw-d,.tw-b) .commons-footer nav{display:flex;flex-wrap:wrap;gap:14px;max-width:320px;margin:0}
:is(.tw-d,.tw-b) .commons-footer nav a{border:0;padding:0;font-size:12px;font-weight:500;box-shadow:none;border-radius:0}
:is(.tw-d,.tw-b) .commons-footer nav a:hover{color:var(--cyan-deep);background:none;text-decoration:underline;text-underline-offset:4px}
:is(.tw-d,.tw-b) .adm-tabs{gap:6px;border-bottom:1px solid var(--line);padding-bottom:16px}
:is(.tw-d,.tw-b) .adm-tabs a{border:1px solid var(--line);border-radius:9px;background:var(--paper);font-family:var(--sans);font-size:12px;padding:9px 13px;letter-spacing:0}
:is(.tw-d,.tw-b) .adm-tabs a.on{background:var(--sky);color:var(--cyan-deep);border-color:var(--focus-ring)}
:is(.tw-d,.tw-b) .adm-row{border:1px solid var(--line);border-radius:14px;padding:18px;background:var(--paper)}
:is(.tw-d,.tw-b) .adm-row.is-suspended{background:color-mix(in srgb,#dd9b75 8%,var(--paper))}
:is(.tw-d,.tw-b) .adm-acts .btn{box-shadow:none;min-height:38px}
:is(.tw-d,.tw-b) :is(.adm-search,.adm-suspend,.adm-role) :is(input,select){background:var(--paper);border:1px solid var(--line);border-radius:9px;color:var(--ink);font:inherit;font-size:14px;padding:9px 12px}
@media(max-width:580px){:is(.tw-d,.tw-b) .commons-footer{flex-direction:column;gap:24px;margin:0 16px;padding-left:0;padding-right:0}}

:is(.tw-d,.tw-b)[data-active="new"] .fab{display:none}
@media(max-width:580px){
 :is(.tw-d,.tw-b) .site-nav{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:10px 6px}
 :is(.tw-d,.tw-b) .site-brand{grid-column:span 2;font-size:11px;letter-spacing:.04em;gap:6px}
 :is(.tw-d,.tw-b) .brand-symbol{flex:none;width:28px;height:30px;font-size:16px}
 :is(.tw-d,.tw-b) .brand-sub{display:none}
 :is(.tw-d,.tw-b) .nav-controls{display:contents}
 :is(.tw-d,.tw-b) :is(.ann,.inbox,.theme-btn,.ava){justify-self:end}
 :is(.tw-d,.tw-b) .board-menu{grid-column:span 2;order:3}
 :is(.tw-d,.tw-b) .adm-entry{grid-column:span 2;order:3;text-align:center;justify-content:center}
 :is(.tw-d,.tw-b) .lang{grid-column:span 2;justify-self:end;order:3}
 :is(.tw-d,.tw-b) .nav-search{grid-column:1 / -1;order:4;max-width:none}
}
`;
