import { createContext, useContext } from 'react'
import type { Script } from './kana'

const KEY = 'vibe-japanese/script'

export const loadScript = (): Script => {
  const s = localStorage.getItem(KEY)
  return s === 'hep' || s === 'ipa' ? s : 'pl'
}
export const saveScript = (s: Script) => localStorage.setItem(KEY, s)

export const ScriptCtx = createContext<Script>('pl')
export const useScript = () => useContext(ScriptCtx)
