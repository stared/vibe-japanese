// Drives the app through a study session and saves screenshots of each state.
// Usage: node scripts/shots.mjs [url] [outDir]
import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'fs'

const url = process.argv[2] ?? 'http://localhost:5200/'
const out = process.argv[3] ?? 'screenshots'
mkdirSync(out, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  defaultViewport: { width: 1280, height: 800 },
  args: ['--mute-audio'],
})
const page = await browser.newPage()
await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: process.env.SCHEME ?? 'light' }])
// SEED: JSON list of word ids to mark as learned and due now, first one due first
const seed = JSON.parse(process.env.SEED ?? '[]')
await page.evaluateOnNewDocument(ids => {
  if (sessionStorage.getItem('seeded')) return
  sessionStorage.setItem('seeded', '1')
  localStorage.clear()
  if (!ids.length) return
  const now = Date.now()
  const cards = Object.fromEntries(ids.map((id, i) => [id, { id, due: now - 1000 * (ids.length - i), step: 2, ivl: 1, ease: 2.5, reps: 3, lapses: 0 }]))
  localStorage.setItem('vibe-japanese/v1', JSON.stringify({ cards, kana: {}, log: [] }))
}, seed)
await page.goto(url)
await page.waitForSelector('main')
let n = 0
const shot = async name => {
  await new Promise(r => setTimeout(r, 250))
  await page.screenshot({ path: `${out}/${String(++n).padStart(2, '0')}-${name}.png`, clip: { x: 0, y: 0, width: 1280, height: Number(process.env.H ?? 560) } })
}
const key = async k => { await page.keyboard.press(k); await new Promise(r => setTimeout(r, 150)) }
const type = async s => { await page.keyboard.type(s); await key('Enter') }

for (const step of JSON.parse(process.env.STEPS ?? '[]')) {
  if (step.key) await key(step.key)
  if (step.type !== undefined) await type(step.type)
  if (step.click) await page.click(step.click)
  if (step.log) console.log(await page.evaluate(() => [document.activeElement?.tagName, document.querySelector('main')?.innerText]))
  if (step.wait) await new Promise(r => setTimeout(r, step.wait))
  if (step.shot) await shot(step.shot)
}
await browser.close()
