import { display } from './kana'
import { WORDS, toks } from './words'
import type { Store } from './srs'
import { speak } from './App'
import { useScript } from './script'
import { Dots, wordHistory } from './history'

export function WordList({ store }: { store: Store }) {
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
                <td>{known && <Dots hist={wordHistory(store.log, w.kana)} max={15} />}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </main>
  )
}

