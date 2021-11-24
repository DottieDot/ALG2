import { Button, Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select, SelectChangeEvent, Stack } from '@mui/material'
import { ChangeEvent, FunctionComponent, memo, useCallback } from 'react'
import { AdjacencyMatrix } from '../../algorithm'
import { Download as DownloadIcon } from '@mui/icons-material'
import download from 'downloadjs'
import { useSettings } from '../../hooks'

interface Props {
  adjacencyMatrix: AdjacencyMatrix
}

const Extras: FunctionComponent<Props> = ({ adjacencyMatrix }) => {
  const { settings, setSettings } = useSettings()

  const handleExport = useCallback(() => {
    download(
      JSON.stringify(adjacencyMatrix, null, '\t'),
      'adjacency_matrix.json',
      'application/json'
    )
  }, [adjacencyMatrix])

  const handleDotStringChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      displayDotString: e.target.checked
    })
  }, [settings, setSettings])

  const handleThemeChanged = useCallback((e: SelectChangeEvent) => {
    if (['dark', 'light', 'system'].includes(e.target.value)) {
      setSettings({
        ...settings,
        // @ts-ignore
        theme: e.target.value
      })
    }
  }, [settings, setSettings])

  return (
    <Stack spacing={2} alignItems="baseline">
      <Button
        variant="contained" 
        startIcon={<DownloadIcon />}
        onClick={handleExport}
      >
        Export Adjacency Matrix
      </Button>
      <FormControlLabel 
        control={(
          <Checkbox 
            checked={settings.displayDotString}
            onChange={handleDotStringChange} 
            sx={{ p: 0, mr: 1 }}
            disableRipple
          />
        )} 
        label="Display DOT string"
      />
      <FormControl sx={{ width: 200, maxWidth: '100%' }}>
        <InputLabel id="theme-select">Theme</InputLabel>
        <Select
          labelId="theme-select"
          value={settings.theme}
          onChange={handleThemeChanged}
          label="Theme"
        >
          <MenuItem value="system">System</MenuItem>
          <MenuItem value="light">Light</MenuItem>
          <MenuItem value="dark">Dark</MenuItem>
        </Select>
      </FormControl>
    </Stack>
  )
}
export default memo(Extras)
