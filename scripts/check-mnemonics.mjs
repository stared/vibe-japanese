// Local UI/visual check. Start `pnpm dev`, then `pnpm check:mnemonics`.
// Uses a fresh browser profile; never reads or resets the user's study history.
import assert from 'node:assert/strict'
import { mkdirSync } from 'node:fs'
import puppeteer from 'puppeteer-core'

const url = process.argv[2] ?? 'http://127.0.0.1:5200/'
const out = process.argv[3] ?? 'screenshots/mnemonics'
mkdirSync(out, { recursive: true })
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
})
const errors = []
try {
  const page = await browser.newPage()
  page.on('pageerror', e => errors.push(e.message))
  await page.setViewport({ width: 1280, height: 900 })
  await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }])
  await page.evaluateOnNewDocument(() => Object.defineProperty(window, 'speechSynthesis', { value: { speak() {}, cancel() {} } }))
  await page.goto(url)
  await page.waitForSelector('nav')
  const tab = async name => {
    const button = await page.$(`::-p-text(${name})`)
    assert(button, `Missing tab: ${name}`)
    await button.click()
  }
  await tab('hints')
  await page.waitForSelector('.mnemonic-card')
  assert.equal(await page.$$eval('.mnemonic-card', cards => cards.length), 46)
  assert.equal(await page.$$eval('.mnemonic-card [data-treatment]', xs => xs.length), 46)
  await page.click('.picture-toggle')
  assert.equal(await page.$$eval('.mnemonic-card clipPath', clips => clips.length), 46)
  assert.equal(await page.$$eval('.mnemonic-card clipPath', clips => new Set(clips.map(c => c.id)).size), 46)
  await page.click('.picture-toggle')
  assert(await page.$$eval('.mnemonic-card [id]', nodes => new Set(nodes.map(n => n.id)).size === nodes.length), 'Picture IDs must be unique')
  await page.screenshot({ path: `${out}/desktop.png` })

  // Compact contact sheet makes every illustration reviewable at once.
  const auditStyle = await page.addStyleTag({ content: `
    .app { max-width: 1260px; } header, .mnemonic-intro, .mnemonic-controls,
    .mnemonic-notes, .mnemonic-card .mnemonic-details, .shape-feature { display: none; }
    .mnemonic-cards { grid-template-columns: repeat(8, 1fr); gap: 8px; }
    .mnemonic-card { min-height: 0; padding: 4px; border: 0; }
    .mnemonic-card h2 { font-size: 12px; margin: 4px 0; }
    .mnemonic-card svg { width: 100px; height: 100px; }
    .mnemonic-card .reading { font-size: 16px; }
  ` })
  await page.screenshot({ path: `${out}/contact-sheet.png`, fullPage: true })
  const serif = await page.addStyleTag({ content: '.kana-pic { font-family: "Hiragino Mincho ProN", serif; }' })
  await page.screenshot({ path: `${out}/serif-contact-sheet.png`, fullPage: true })
  await serif.evaluate(el => el.remove())
  await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'dark' }])
  await page.screenshot({ path: `${out}/dark-contact-sheet.png`, fullPage: true })
  await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }])
  await auditStyle.evaluate(el => el.remove())

  const groups = await page.$$eval('select option', opts => opts.slice(1).map(o => o.value))
  for (const group of groups) {
    await page.select('select', group)
    assert.deepEqual(await page.$$eval('.mnemonic-card svg', svgs => svgs.map(s => s.getAttribute('aria-label'))), [...group])
  }
  await page.select('select', 'ねれわ')
  const selectScript = async label => {
    const button = await page.$(`.scripts ::-p-text(${label})`)
    assert(button, `Missing script: ${label}`)
    await button.click()
  }
  await selectScript('Hepburn')
  assert.deepEqual(await page.$$eval('.mnemonic-card .reading', xs => xs.map(x => x.textContent)), ['ne', 're', 'wa'])
  await selectScript('IPA')
  assert.deepEqual(await page.$$eval('.mnemonic-card .reading', xs => xs.map(x => x.textContent)), ['ne', 'ɾe', 'ɰa'])
  await selectScript('polski')
  assert.deepEqual(await page.$$eval('.mnemonic-card .reading', xs => xs.map(x => x.textContent)), ['ne', 're', 'ła'])
  await page.screenshot({ path: `${out}/look-alikes.png` })
  await page.click('.hint-toggle')
  assert.equal(await page.$$eval('.mnemonic-card clipPath', xs => xs.length), 0)
  assert.equal(await page.$$eval('.mnemonic-card .reading', xs => xs.length), 0)
  assert.equal(await page.$$eval('.mnemonic-card [data-art-layer]', xs => xs.length), 0)
  await page.click('.reveal-cue')
  assert.equal(await page.$$eval('.mnemonic-card .reading', xs => xs.length), 1)
  assert.equal(await page.$$eval('.reveal-cue', xs => xs.length), 2)
  await page.screenshot({ path: `${out}/recall.png` })
  await page.click('.hint-toggle')
  await page.click('.mnemonic-details summary')
  assert.equal(await page.$$eval('.mnemonic-details[open]', xs => xs.length), 1)
  await page.screenshot({ path: `${out}/explanation.png` })

  await page.setViewport({ width: 390, height: 844 })
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Mobile horizontal overflow')
  await page.screenshot({ path: `${out}/mobile.png`, fullPage: true })
  await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'dark' }])
  await page.screenshot({ path: `${out}/mobile-dark.png`, fullPage: true })

  // Exercise actual error feedback, not just the reference page.
  await page.setViewport({ width: 1280, height: 900 })
  await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }])
  await tab('rows')
  const rows = await page.$$('.row-pick')
  await rows[0].click()
  assert.equal(await page.$$eval('.row-card', xs => xs.length), 5)
  await page.screenshot({ path: `${out}/row-intro.png` })
  await page.click('.next')
  const target = await page.$eval('.word', el => el.textContent)
  const wrong = { あ: 'o', お: 'a', い: 'ri', う: 'tsu', え: 'n' }[target]
  assert(wrong, `Unexpected first-row kana: ${target}`)
  await page.type('.answer', wrong)
  await page.keyboard.press('Enter')
  await page.waitForSelector('.mnemonic-contrast')
  assert.equal(await page.$$eval('.mnemonic-contrast p', xs => xs.length), 2)
  await page.screenshot({ path: `${out}/error-feedback.png` })
  assert.deepEqual(errors, [])
  console.log(`Passed: 46 cards, ${groups.length} comparison groups, three reading scripts, recall, unique SVG clips, mobile layout and row-error feedback. Screenshots: ${out}`)
} finally {
  await browser.close()
}
