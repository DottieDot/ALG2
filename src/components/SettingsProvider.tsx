import { createContext, FunctionComponent, memo, ReactElement } from 'react'
import useLocalStorageState from 'use-local-storage-state'

export interface SettingsState {
  displayDotString: boolean
  theme           : 'dark' | 'light' | 'system'
}

export interface SettingsContext {
  settings   : SettingsState
  setSettings: (settings: SettingsState) => void
}

export const settingsContext = createContext<SettingsContext | null>(null)

const SettingsProvider: FunctionComponent<{ children: ReactElement }> = ({ children }) => {
  const [settings, setSettings] = useLocalStorageState<SettingsState>('v2.settings', {
    displayDotString: false,
    theme           : 'system'
  })

  return (
    <settingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </settingsContext.Provider>
  )
}
export default memo(SettingsProvider)
