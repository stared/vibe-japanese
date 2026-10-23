import { SCRIPTS, type Script } from './kana'
import type { Store } from './srs'

type Props = { store: Store; onReplace: (s: Store) => void; script: Script; setScript: (s: Script) => void }

export function Settings({ store, onReplace, script, setScript }: Props) {
  const words = Object.keys(store.cards).length
  const answers = store.log.filter(e => e.kind !== 'retype').length
  return (
    <main className="settings">
      <section>
        <h2>Readings</h2>
        <div className="choices">
          {SCRIPTS.map(sc => (
            <button key={sc.id} className={script === sc.id ? 'on' : ''} onClick={() => setScript(sc.id)}>{sc.label}</button>
          ))}
        </div>
      </section>
      <section>
        <h2>Progress</h2>
        <p className="sub">{words} {words === 1 ? 'word' : 'words'} learned, {answers} {answers === 1 ? 'answer' : 'answers'}. Saved only in this browser.</p>
        <div className="actions">
          <button onClick={() => download(store, script)}>export</button>
          <label>
            import
            <input type="file" accept=".json,application/json" hidden onChange={async e => {
              const f = e.target.files?.[0]
              e.target.value = ''
              if (!f) return
              try {
                const { script: sc, ...s } = JSON.parse(await f.text())
                if (!s?.cards || !s?.kana || !Array.isArray(s?.log)) throw new Error('not a progress file')
                if (!confirm(`Replace current progress with ${Object.keys(s.cards).length} words from ${f.name}?`)) return
                onReplace(s)
                if (SCRIPTS.some(x => x.id === sc)) setScript(sc)
              } catch (err) {
                alert(`Could not import: ${(err as Error).message}`)
              }
            }} />
          </label>
          <button onClick={() => confirm('Reset all progress?') && onReplace({ cards: {}, kana: {}, log: [] })}>reset</button>
        </div>
      </section>
    </main>
  )
}

function download(s: Store, script: Script) {
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([JSON.stringify({ ...s, script })], { type: 'application/json' }))
  a.download = `kana-progress-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(a.href)
}
