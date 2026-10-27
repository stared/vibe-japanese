import { useEffect, useMemo, useRef, useState } from 'react'
import { GRID, GRID_VOICED, isKata, match, misread, normalize, toHira, toKata, tokenize } from './kana'
import { record, logRetype, solid, type Store } from './srs'
import { useScript } from './script'
import { Hook, KanaPic, pic } from './pics'
import { kanaHistories, recentScore } from './history'
import { fade, recent, weighted } from './recency'
import { AnswerInput, HoverKana, speak } from './App'

const HIRA_ROWS: string[] = [
  ...GRID.filter(r => r.c !== 'n' || r.cells[0] !== 'ん').map(r => r.cells.replace(/・/g, '') + (r.cells[0] === 'わ' ? 'ん' : '')),
  ...GRID_VOICED.map(r => r.cells),
]
export const ROWS: string[] = [...HIRA_ROWS, ...HIRA_ROWS.map(toKata)]
const GAPS = [GRID.length - 1, HIRA_ROWS.length, HIRA_ROWS.length + GRID.length - 1]
const GOAL = 3
const OLD_SHARE = 0.25

type Props = { store: Store; setStore: (s: Store) => void }

export function Rows({ store, setStore }: Props) {
  const [row, setRow] = useState<number | null>(null)
  const hists = useMemo(() => kanaHistories(store.log), [store.log])
  if (row !== null) return <RowSession key={row} row={row} store={store} setStore={setStore} onNext={() => setRow(row + 1 < ROWS.length ? row + 1 : null)} />
  return (
    <main className="rows-page">
      {ROWS.map((r, i) => (
        <button key={i} className={'row-pick' + (GAPS.includes(i) ? ' gap' : '')} onClick={() => setRow(i)}>
          {[...r].map(k => {
            const score = store.kana[k] ? recentScore(hists.get(k) ?? []) : null
            return <span key={k} style={score === null ? undefined : { color: `color-mix(in oklab, var(--good) ${Math.round(score * 100)}%, var(--bad))` }}>{k}</span>
          })}
        </button>
      ))}
    </main>
  )
}

type Step =
  | { kind: 'intro' }
  | { kind: 'quiz'; k: string }
  | { kind: 'reveal'; k: string; ok: boolean; typed: string; conf: string | null; fixed?: boolean }
  | { kind: 'done' }

function RowSession({ row, store, setStore, onNext }: Props & { row: number; onNext: () => void }) {
  const sc = useScript()
  const kana = [...ROWS[row]]
  const [step, setStep] = useState<Step>({ kind: 'intro' })
  const [streak, setStreak] = useState<Record<string, number>>({})
  const [input, setInput] = useState('')
  const [shake, setShake] = useState(0)
  const storeRef = useRef(store)
  storeRef.current = store
  const shownAt = useRef(0)
  const hinted = useRef(false)
  const commit = (s: Store) => {
    storeRef.current = s
    setStore(s)
  }

  const old = ROWS.slice(0, row).flatMap(r => [...r]).filter(k => isKata(k) === isKata(kana[0]) && solid(store.kana[k]))

  const next = (st = streak) => {
    setInput('')
    setShake(0)
    const open = kana.filter(k => (st[k] ?? 0) < GOAL)
    if (!open.length) return setStep({ kind: 'done' })
    const r = recent(storeRef.current.log)
    const oldW = (open.length * OLD_SHARE) / (1 - OLD_SHARE) / old.length
    const k = weighted([...kana, ...old], k => fade(r.kana.get(k)) * (open.includes(k) ? 1 : kana.includes(k) ? 0.3 : oldW)) ?? open[0]
    setStep({ kind: 'quiz', k })
  }

  const submit = (k: string) => {
    const t = tokenize(k)
    const given = normalize(input)
    const ok = !!given && match(t, given).ok
    const hint = hinted.current && ok
    hinted.current = false
    commit(record(storeRef.current, k, t, ok ? [] : [0], Date.now(), { typed: input, kind: 'drill', hint: hint ? [0] : [] }))
    if (kana.includes(k)) setStreak(s => ({ ...s, [k]: ok ? (s[k] ?? 0) + (hint ? 0 : 1) : 0 }))
    shownAt.current = Date.now()
    setInput('')
    setStep({ kind: 'reveal', k, ok, typed: input, conf: ok || !given ? null : misread(t[0], given) })
    speak(k)
  }

  useEffect(() => {
    if (step.kind !== 'reveal' || !step.ok) return
    const t = setTimeout(() => next(), 1500)
    return () => clearTimeout(t)
  }, [step])

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key !== 'Enter' || e.repeat || e.target instanceof HTMLInputElement) return
      if (step.kind === 'intro') next()
      else if (step.kind === 'done') onNext()
      else if (step.kind === 'reveal' && step.fixed && Date.now() - shownAt.current > 1000) next()
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [step, streak])

  const read = (k: string) => tokenize(k)[0][sc]
  const hook = (k: string) => <Hook k={k} />

  if (step.kind === 'intro') {
    return (
      <main className="study">
        <div className="row-intro">
          {kana.map(k => (
            <div key={k} className="row-card" onClick={() => speak(k)}>
              <KanaPic k={k} size={150} />
              <div className="reading">{read(k)}{isKata(k) && <span className="twin"> = {toHira(k)}</span>}</div>
              {hook(k)}
            </div>
          ))}
        </div>
        <button className="next" onClick={() => next()}>start</button>
      </main>
    )
  }

  if (step.kind === 'done') {
    return (
      <main className="study">
        <div className="word good">{kana.join('')}</div>
        {row + 1 < ROWS.length && <button className="next" onClick={onNext}>next row</button>}
      </main>
    )
  }

  const progress = (
    <div className="row-progress">
      {kana.map(k => <span key={k} style={{ color: `color-mix(in oklab, var(--good) ${Math.round(100 * Math.min(streak[k] ?? 0, GOAL) / GOAL)}%, var(--faint))` }}>{k}</span>)}
    </div>
  )

  if (step.kind === 'quiz') {
    return (
      <main className="study">
        {progress}
        <div className="word"><HoverKana k={step.k} onHint={() => { hinted.current = true }} /></div>
        <AnswerInput value={input} onChange={setInput} onEnter={() => submit(step.k)} />
      </main>
    )
  }

  const { k, ok, typed, conf, fixed } = step
  const retype = () => {
    const good = match(tokenize(k), normalize(input)).ok
    commit(logRetype(storeRef.current, k, input, good, Date.now()))
    if (good) {
      shownAt.current = Date.now()
      setInput('')
      setStep({ ...step, fixed: true })
    } else setShake(n => n + 1)
  }
  return (
    <main className="study">
      {progress}
      <div className="word" onClick={() => speak(k)}>
        <span className={'tok' + (ok || fixed ? '' : ' bad')}>
          {ok ? <span>{k}</span> : <KanaPic k={k} size={140} />}
          {ok || fixed
            ? <span className="typed good">{read(k)}</span>
            : <>{typed.trim() && <span className="typed bad">{typed}</span>}<span className="r">{read(k)}</span></>}
        </span>
      </div>
      {!ok && hook(k)}
      {conf && (
        <div className="confusion">
          <span className="jp">{conf}</span> {read(conf)}
        </div>
      )}
      {ok ? null : fixed
        ? <button className="next" onClick={() => next()}>next</button>
        : <AnswerInput key={shake} shake={shake > 0} value={input} onChange={setInput} onEnter={retype} />}
    </main>
  )
}
