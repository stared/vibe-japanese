import { display } from './kana'
import { WORDS, toks } from './words'
import type { Store } from './srs'
import { speak } from './App'
import { useScript } from './script'

export function WordList({ store, onReplace }: { store: Store; onReplace: (s: Store) => void }) {
  const sc = useScript()
  return (
    <main className="words-page">
      <div className="footer">
        <button onClick={() => download(store)}>export</button>
        <label>
          import
          <input type="file" accept=".json,application/json" hidden onChange={async e => {
            const f = e.target.files?.[0]
            e.target.value = ''
            if (!f) return
            try {
              const s = JSON.parse(await f.text())
              if (!s?.cards || !s?.kana || !Array.isArray(s?.log)) throw new Error('not a progress file')
              if (confirm(`Replace current progress with ${Object.keys(s.cards).length} words from ${f.name}?`)) onReplace(s)
            } catch (err) {
              alert(`Could not import: ${(err as Error).message}`)
            }
          }} />
        </label>
        <button onClick={() => confirm('Reset all progress?') && onReplace({ cards: {}, kana: {}, log: [] })}>reset</button>
      </div>
      <table className="words">
        <tbody>
          {WORDS.map(w => {
            const known = !!store.cards[w.kana]
            return (
              <tr key={w.kana} className={known ? '' : 'locked'} onClick={() => known && speak(w.kana)}>
                <td className="jp">{w.kana}</td>
                <td className="r">{known && display(toks(w), sc)}</td>
                <td>{known && w.en}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </main>
  )
}

function download(s: Store) {
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([JSON.stringify(s)], { type: 'application/json' }))
  a.download = `kana-progress-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(a.href)
}
