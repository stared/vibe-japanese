import { display } from './kana'
import { WORDS, NEW_CHARS, toks } from './words'
import type { Store } from './srs'
import { fmtIn, speak } from './App'

export function WordList({ store, now, onReset }: { store: Store; now: number; onReset: () => void }) {
  return (
    <main className="words-page">
      <table className="words">
        <tbody>
          {WORDS.map((w, i) => {
            const c = store.cards[w.kana]
            return (
              <tr key={w.kana} className={c ? '' : 'locked'} onClick={() => c && speak(w.kana)}>
                <td className="num">{i + 1}</td>
                <td className="jp">{w.kana}</td>
                <td>{c ? display(toks(w)) : ''}</td>
                <td className="kanji">{c ? w.kanji : ''}</td>
                <td>{c ? w.en : ''}</td>
                <td className="new">{NEW_CHARS.get(w.kana)!.join(' ')}</td>
                <td className="muted">{c ? (c.ivl ? `${c.ivl}d · ` : 'learning · ') + fmtIn(c.due - now) : ''}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <button className="link danger" onClick={() => confirm('Reset all progress?') && onReset()}>reset progress</button>
    </main>
  )
}
