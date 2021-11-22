import { Add as PlusIcon, Remove as SubIcon, Restore as RestoreIcon } from '@mui/icons-material'
import { Box, Button, Divider, Paper, Stack, TextField, Typography, useTheme } from '@mui/material'
import { FunctionComponent, memo, useCallback, useEffect, useMemo, useState } from 'react'
import { addPendantToAdjacencyMatrix, addTopToAdjacencyMatrix, AdjacencyMatrix, highlightedDotStringFromAdjacencyMatrix, removePendantFromAdjacencyMatrix, removeTopFromAdjacency } from '../../algorithm'
import Graph from './Graph'

interface Props {
  adjacencyMatrix: AdjacencyMatrix
  updateLayout: () => void
}

const Kernelization: FunctionComponent<Props> = ({ adjacencyMatrix: origMatrix, updateLayout }) => {
  const theme = useTheme()
  const [adjacencyMatrix, setAdjacencyMatrix] = useState(origMatrix)
  const [k, setK] = useState(0)
  const dotString = useMemo(() => highlightedDotStringFromAdjacencyMatrix(adjacencyMatrix, k, theme), [adjacencyMatrix, k, theme])

  useEffect(() => {
    setAdjacencyMatrix(origMatrix)
  }, [origMatrix])

  useEffect(() => {
    updateLayout()
  }, [updateLayout, adjacencyMatrix])

  const addPendant = useCallback(() => {
    setAdjacencyMatrix(addPendantToAdjacencyMatrix(adjacencyMatrix, k) ?? adjacencyMatrix)
  }, [adjacencyMatrix, setAdjacencyMatrix, k])

  const removePendant = useCallback(() => {
    setAdjacencyMatrix(removePendantFromAdjacencyMatrix(adjacencyMatrix, origMatrix) ?? adjacencyMatrix)
  }, [adjacencyMatrix, setAdjacencyMatrix, origMatrix])

  const addTop = useCallback(() => {
    setAdjacencyMatrix(addTopToAdjacencyMatrix(adjacencyMatrix, k) ?? adjacencyMatrix)
  }, [adjacencyMatrix, setAdjacencyMatrix, k])

  const removeTop = useCallback(() => {
    setAdjacencyMatrix(removeTopFromAdjacency(adjacencyMatrix, origMatrix, k) ?? adjacencyMatrix)
  }, [setAdjacencyMatrix, adjacencyMatrix, origMatrix, k])

  const restore = useCallback(() => {
    setAdjacencyMatrix(origMatrix)
  }, [setAdjacencyMatrix, origMatrix])

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
          <Button onClick={removePendant} variant="outlined" startIcon={<SubIcon />}>Remove Pendant</Button>
          <Button onClick={addPendant} variant="outlined" startIcon={<PlusIcon />}>Add Pendant</Button>
          <Button onClick={removeTop} variant="outlined" startIcon={<SubIcon />}>Remove Top</Button>
          <Button onClick={addTop} variant="outlined" startIcon={<PlusIcon />}>Add Top</Button>
          <Button onClick={restore} variant="outlined" color="secondary" startIcon={<RestoreIcon />}>Restore</Button>
        </Stack>
      </Paper>
      <Box sx={{ height: 500, my: 2 }}>
        <Graph dotString={dotString} />
      </Box>
      <Typography variant="h5" gutterBottom>Vertex Cover</Typography>
      <Divider />
      <Box sx={{ height: 500, mt: 2 }}>
        <Graph dotString={dotString} />
      </Box>
    </Box>
  )
}
export default memo(Kernelization)
