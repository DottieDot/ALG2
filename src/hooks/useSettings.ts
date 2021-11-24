import { useContext } from 'react'
import { SettingsContext, settingsContext } from '../components'

const useSettings = (): SettingsContext => {
  const ctx = useContext(settingsContext)

  if (ctx === null) {
    throw new Error('SettingsProvider missing')
  }

  return ctx
}
export default useSettings
