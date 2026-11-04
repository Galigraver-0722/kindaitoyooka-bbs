/** Keep the approved kanji identity independent of the page layout. */
export const logoCss = `
:is(.tw-d,.tw-b) .brand-mark{width:42px;height:42px;flex:none}
:is(.tw-d,.tw-b) .kanji-lockup{display:flex;align-items:baseline;gap:8px;color:var(--ink)}
:is(.tw-d,.tw-b) .kanji-lockup b{font-family:"Yu Mincho","Hiragino Mincho ProN",serif;font-size:26px;letter-spacing:.05em;font-weight:700}
:is(.tw-d,.tw-b) .kanji-lockup>span{font-family:var(--sans);font-size:12px;letter-spacing:.01em;font-weight:550}
:is(.tw-d,.tw-b) .footer-lockup{display:flex;align-items:center;gap:11px}
:is(.tw-d,.tw-b) .footer-mark{width:32px;height:32px;flex:none}
:is(.tw-d,.tw-b) .footer-lockup strong{font-family:"Yu Mincho","Hiragino Mincho ProN",serif;font-size:20px}
:is(.tw-d,.tw-b) .footer-lockup strong span{font-family:var(--sans);font-size:11px;margin-left:6px}
@media(max-width:580px){
 :is(.tw-d,.tw-b) .brand-mark{width:30px;height:30px}
 :is(.tw-d,.tw-b) .kanji-lockup{gap:5px}
 :is(.tw-d,.tw-b) .kanji-lockup b{font-size:19px;letter-spacing:0}
 :is(.tw-d,.tw-b) .kanji-lockup>span{display:none}
}
`;
