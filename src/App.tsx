import { createTheme, CssBaseline, darkScrollbar, ThemeProvider } from '@mui/material'
import { FunctionComponent } from 'react'
import { GraphPage } from './pages'

const theme = createTheme({
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

const App: FunctionComponent = (_) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GraphPage />
    </ThemeProvider>
  )
}
export default App
