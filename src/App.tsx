import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import { FunctionComponent } from 'react'
import { GraphPage } from './pages'

const theme = createTheme({
  palette: {
    mode: 'dark'
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
