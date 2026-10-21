// Renders the hero's trading card art (public/brand/bahith-card-{en,ar}.webp) with headless Chrome.
// The card text is below in TEXT. Run with `npm run build:card` (set CHROME_PATH if Chrome isn't in the default place).
import { readFileSync } from "fs"
import puppeteer from "puppeteer-core"

const outDir = new URL("../public/brand", import.meta.url).pathname
const FONT = new URL("../node_modules/@fontsource-variable/baloo-bhaijaan-2/files", import.meta.url).pathname
const CHROME = process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

// Inlined: a page made with setContent can't load file:// fonts.
const font = (subset) => readFileSync(`${FONT}/baloo-bhaijaan-2-${subset}-wght-normal.woff2`).toString("base64")

const mark = `
  <path d="M16 36.5A16 16 0 0 1 48 36.5Z" fill="#0a0a0a"/>
  <path d="M10 40H54" stroke="#0a0a0a" stroke-width="7" stroke-linecap="round"/>
  <circle cx="25" cy="29.5" r="4.5" fill="#ffffff"/>
  <circle cx="23.5" cy="28.5" r="2.4" fill="#0a0a0a"/>
  <path d="M44.4 34.4C46.5 38.5 50 40.5 52.5 38.5" fill="none" stroke="#f5c542" stroke-width="1.2" stroke-linecap="round"/>
  <circle cx="39" cy="29" r="8.2" fill="#0a0a0a"/>
  <circle cx="39" cy="29" r="7.4" fill="#f5c542"/>
  <circle cx="39" cy="29" r="5.9" fill="#ffffff"/>
  <circle cx="37.3" cy="28" r="3.2" fill="#0a0a0a"/>`

const search = `<svg viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>`

const TEXT = {
  en: {
    dir: "ltr",
    stage: "BASIC",
    name: "Bahith",
    hp: "HP",
    dex: "No. 001 · Moment Finder · Watches every second",
    abilityTag: "Ability",
    ability: "Hidden Fact Finder",
    abilityText: "Reads every word said in your videos, in English or Arabic, and remembers when it was said.",
    attacks: [
      { name: "Jump Cut", text: "Skips straight to the second it was said.", dmg: "15s" },
      { name: "Exact Match", text: "Finds only the words you type. Join words with &.", dmg: "&" },
    ],
    weakness: "Weakness",
    weaknessValue: "Mumbling ×2",
    resistance: "Resistance",
    resistanceValue: "Long videos −30",
    retreat: "Rewind cost",
    retreatValue: "0",
    flavor: "It finds the hidden facts in any video, so you never have to rewind again.",
    footer: "001/001 ★",
  },
  ar: {
    dir: "rtl",
    stage: "أساسي",
    name: "باحث",
    hp: "طاقة",
    dex: "رقم 001 · صائد اللحظات · يشاهد كل ثانية",
    abilityTag: "قدرة",
    ability: "باحث عن الحقائق المخفية",
    abilityText: "يقرأ كل كلمة قيلت في فيديوهاتك، بالعربية أو الإنجليزية، ويتذكر متى قيلت.",
    attacks: [
      { name: "القفزة", text: "ينتقل مباشرة إلى الثانية التي قيلت فيها.", dmg: "15ث" },
      { name: "المطابقة التامة", text: "يجد الكلمات التي تكتبها فقط. اجمعها بـ &.", dmg: "&" },
    ],
    weakness: "نقطة ضعف",
    weaknessValue: "التمتمة ×2",
    resistance: "مقاومة",
    resistanceValue: "الفيديوهات الطويلة −30",
    retreat: "تكلفة الترجيع",
    retreatValue: "0",
    flavor: "يكشف الحقائق المخفية في أي فيديو، فلا تحتاج إلى الترجيع أبدًا.",
    footer: "001/001 ★",
  },
}

const html = (t) => `<!doctype html><html lang="${t.dir === "rtl" ? "ar" : "en"}" dir="${t.dir}"><head><meta charset="utf-8"><style>
@font-face{font-family:'Baloo';src:url(data:font/woff2;base64,${font("latin")}) format('woff2');font-weight:400 800}
@font-face{font-family:'Baloo';src:url(data:font/woff2;base64,${font("arabic")}) format('woff2');font-weight:400 800;unicode-range:U+0600-06FF,U+0750-077F,U+FB50-FDFF,U+FE70-FEFF}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:630px;height:880px;background:transparent}
body{font-family:'Baloo',sans-serif;color:#0a0a0a}
.card{position:relative;width:630px;height:880px;border-radius:34px;background:#f5c542;padding:22px;}
.inner{position:relative;height:100%;border-radius:20px;background:linear-gradient(160deg,#fff3c4 0%,#ffe48a 55%,#ffd65c 100%);border:5px solid #0a0a0a;padding:16px 20px 14px;display:flex;flex-direction:column}
.top{display:flex;align-items:center;gap:10px}
.stage{font-size:15px;font-weight:800;background:#0a0a0a;color:#f5c542;border-radius:999px;padding:1px 10px}
.name{font-size:40px;font-weight:800;line-height:1;margin-top:4px}
.hp{margin-inline-start:auto;display:flex;align-items:center;gap:8px;font-weight:800}
.hp small{font-size:16px}.hp b{font-size:38px;line-height:1}
.type{width:40px;height:40px;border-radius:50%;background:#f5c542;border:3px solid #0a0a0a;display:flex;align-items:center;justify-content:center}
.type svg{width:22px;height:22px}
.art{position:relative;margin-top:10px;height:300px;border:5px solid #0a0a0a;border-radius:14px;overflow:hidden;
  background:radial-gradient(circle at 50% 55%,#fff8e7 0%,#ffe48a 45%,#f5c542 75%);box-shadow:inset 0 0 0 4px #fff3c4}
.art:before{content:"";position:absolute;inset:0;background-image:radial-gradient(rgba(10,10,10,.13) 2px,transparent 2px);background-size:18px 18px}
.art svg{position:absolute;left:50%;top:54%;width:340px;transform:translate(-50%,-50%)}
.dex{margin-top:8px;text-align:center;font-size:14px;font-weight:700;background:#0a0a0a;color:#fff8e7;border-radius:999px;padding:2px 12px}
.ability{margin-top:12px;display:flex;flex-direction:column;gap:2px}
.ability .tag{align-self:flex-start;font-size:14px;font-weight:800;color:#fff;background:#e5484d;border:2px solid #0a0a0a;border-radius:999px;padding:0 10px}
.ability h3{font-size:22px;font-weight:800;color:#b42318;line-height:1.1}
.ability p,.attack p{font-size:15px;line-height:1.35;font-weight:500}
.attack{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:10px;margin-top:10px;padding-top:10px;border-top:2px solid rgba(10,10,10,.25)}
.energy{display:flex;gap:4px}.energy i{width:22px;height:22px;border-radius:50%;background:#f5c542;border:2.5px solid #0a0a0a;display:block}
.attack h4{font-size:22px;font-weight:800;line-height:1.1}
.dmg{font-size:28px;font-weight:800}
.stats{margin-top:auto;display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding-top:10px;border-top:2px solid rgba(10,10,10,.25);font-size:12px;font-weight:700;text-align:center}
.stats b{display:block;font-size:14px}
.flavor{margin-top:8px;font-size:13px;font-weight:600;font-style:italic;border:2px solid #0a0a0a;border-radius:10px;padding:4px 10px;background:#fff8e7}
.foot{margin-top:6px;display:flex;justify-content:space-between;font-size:12px;font-weight:800}
</style></head><body>
<div class="card"><div class="inner">
  <div class="top">
    <div><span class="stage">${t.stage}</span><div class="name">${t.name}</div></div>
    <div class="hp"><small>${t.hp}</small><b>120</b><span class="type">${search}</span></div>
  </div>
  <div class="art"><svg viewBox="4 16 56 30">${mark}</svg></div>
  <div class="dex">${t.dex}</div>
  <div class="ability"><span class="tag">${t.abilityTag}</span><h3>${t.ability}</h3><p>${t.abilityText}</p></div>
  ${t.attacks.map((a, i) => `<div class="attack"><div class="energy">${"<i></i>".repeat(i + 1)}</div><div><h4>${a.name}</h4><p>${a.text}</p></div><div class="dmg">${a.dmg}</div></div>`).join("")}
  <div class="stats">
    <div>${t.weakness}<b>${t.weaknessValue}</b></div>
    <div>${t.resistance}<b>${t.resistanceValue}</b></div>
    <div>${t.retreat}<b>${t.retreatValue}</b></div>
  </div>
  <div class="flavor">${t.flavor}</div>
  <div class="foot"><span>${t.name}</span><span>${t.footer}</span></div>
</div></div>
</body></html>`

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--allow-file-access-from-files"] })
const page = await browser.newPage()
await page.setViewport({ width: 630, height: 880, deviceScaleFactor: 2 })
for (const lang of ["en", "ar"]) {
  await page.setContent(html(TEXT[lang]), { waitUntil: "load" })
  await page.evaluate(() => document.fonts.ready)
  await page.screenshot({ path: `${outDir}/bahith-card-${lang}.webp`, type: "webp", quality: 90, omitBackground: true })
}
await browser.close()
console.log("done")
