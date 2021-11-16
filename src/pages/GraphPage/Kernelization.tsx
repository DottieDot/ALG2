import { Add as PlusIcon, Remove as SubIcon } from '@mui/icons-material'
import { Box, Button, Paper, Stack, TextField, Typography, useTheme } from '@mui/material'
import { FunctionComponent, memo, useCallback, useEffect, useMemo, useState } from 'react'
import { addPendantToAdjacencyMatrix, AdjacencyMatrix, highlightedDotStringFromAdjacencyMatrix, removePendantFromAdjacencyMatrix } from '../../algorithm'
import Graph from './Graph'

interface Props {
  adjacencyMatrix: AdjacencyMatrix
  updateLayout: () => void
}

const Kernelization: FunctionComponent<Props> = ({ adjacencyMatrix: origMatrix, updateLayout }) => {
  const theme = useTheme()
  const [adjacencyMatrix, setAdjacencyMatrix] = useState(origMatrix)
  const [tops, setTops] = useState(2)
  const [k, setK] = useState(0)
  const dotString = useMemo(() => highlightedDotStringFromAdjacencyMatrix(adjacencyMatrix, tops,  theme), [adjacencyMatrix, tops, theme])

  useEffect(() => {
    setAdjacencyMatrix(origMatrix)
  }, [origMatrix])

  useEffect(() => {
    updateLayout()
  }, [updateLayout, adjacencyMatrix])

  const addPendant = useCallback(() => {
    setAdjacencyMatrix(addPendantToAdjacencyMatrix(adjacencyMatrix, tops) ?? adjacencyMatrix)
  }, [adjacencyMatrix, setAdjacencyMatrix, tops])

  const removePendant = useCallback(() => {
    setAdjacencyMatrix(removePendantFromAdjacencyMatrix(adjacencyMatrix, origMatrix) ?? adjacencyMatrix)
  }, [adjacencyMatrix, setAdjacencyMatrix, origMatrix])

  return (
    <Box sx={{ p: 3, position: 'relative' }}>
      <Paper sx={{ p: 2 }} variant="outlined">
        <Typography variant="h5" gutterBottom>Configuration</Typography>
        <Stack direction="row" alignItems="end" spacing={2}>
          <TextField
            label="Cover size"
            type="number"
            placeholder="10"
            variant="standard"
            value={k ? k.toString() : ''}
            onChange={e => setK(+e.target.value)}
            inputProps={{
              min: 1
            }}
          />
          <TextField
            label="Tops degree"
            type="number"
            placeholder="10"
            variant="standard"
            value={tops.toString()}
            onChange={e => setTops(+e.target.value)}
            inputProps={{
              min: 2
            }}
          />
          <Button onClick={removePendant} variant="outlined" startIcon={<SubIcon />}>Remove Pendant</Button>
          <Button onClick={addPendant} variant="outlined" startIcon={<PlusIcon />}>Add Pendant</Button>
          <Button onClick={removePendant} variant="outlined" startIcon={<SubIcon />} disabled>Remove Top</Button>
          <Button onClick={addPendant} variant="outlined" startIcon={<PlusIcon />} disabled>Add Top</Button>
        </Stack>
      </Paper>
      <Box sx={{ height: 500, mt: 2 }}>
        <Graph dotString={dotString} />
      </Box>
    </Box>
  )
}
export default memo(Kernelization)
