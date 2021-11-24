import { createTheme, CssBaseline, darkScrollbar, ThemeProvider, useMediaQuery } from '@mui/material'
import { FunctionComponent, useMemo } from 'react'
import { SettingsProvider } from './components'
import { useSettings } from './hooks'
import { GraphPage } from './pages'

const lightTheme = createTheme({
  palette: {
    mode: 'light'
  }
})

const darkTheme = createTheme({
  palette: {
    mode: 'dark'
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          overflowY: 'scroll', // Layout changes are expensive
          ...darkScrollbar()
        }
      }
    }
  }
})

const Theme: FunctionComponent = ({ children }) => {
  const settings = useSettings().settings
  const systemIsDark = useMediaQuery('(prefers-color-scheme: dark)')
  const dark = settings.theme === 'dark' || (settings.theme === 'system' && systemIsDark)
  const theme = useMemo(
    () => createTheme(dark ? darkTheme : lightTheme),
    [dark]
  )
  
  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  )
}

const App: FunctionComponent = (_) => {
  return (
    <SettingsProvider>
      <Theme>
        <CssBaseline />
        <GraphPage />
      </Theme>
    </SettingsProvider>
  )
}
export default App
