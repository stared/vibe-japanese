import { display } from './kana'
import { WORDS, toks } from './words'
import type { Store } from './srs'
import { speak } from './App'
import { useScript } from './script'

export function WordList({ store, onReset }: { store: Store; onReset: () => void }) {
  const sc = useScript()
  return (
    <main className="words-page">
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
      <button className="reset" onClick={() => confirm('Reset all progress?') && onReset()}>reset progress</button>
    </main>
  )
}
