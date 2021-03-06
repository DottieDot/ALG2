import { Add as PlusIcon, Remove as SubIcon, Restore as RestoreIcon } from '@mui/icons-material'
import { Box, Button, Divider, Fade, LinearProgress, Paper, Stack, TextField, Typography, useTheme } from '@mui/material'
import CancellationToken from 'cancellationtoken'
import { FunctionComponent, memo, useCallback, useEffect, useMemo, useState } from 'react'
import { AdjacencyMatrix, getDotStringForAdjacencyMatrixWithCover, getDotStringForAdjacencyMatrixWithHighlighting } from '../../algorithm'
import { getVertexCoverKernelizedAsync } from '../../workers'
import Graph from './Graph'

interface Props {
  adjacencyMatrix: AdjacencyMatrix
  updateLayout: () => void
}

const Kernelization: FunctionComponent<Props> = ({ adjacencyMatrix: origMatrix, updateLayout }) => {
  const theme = useTheme()
  const [adjacencyMatrix, setAdjacencyMatrix] = useState(origMatrix)
  const [k, setK] = useState(0)
  const dotString = useMemo(() => getDotStringForAdjacencyMatrixWithHighlighting(adjacencyMatrix, k, theme), [adjacencyMatrix, k, theme])
  const [progress, setProgress] = useState(0)
  const [coverDotString, setCoverDotString] = useState<string | null>(null)

  useEffect(() => {
    setAdjacencyMatrix(origMatrix)
  }, [origMatrix])

  useEffect(() => {
    updateLayout()
  }, [updateLayout, adjacencyMatrix, coverDotString])

  const addPendant = useCallback(() => {
    setAdjacencyMatrix(adjacencyMatrix.clone().addPendant(k) ?? adjacencyMatrix)
  }, [adjacencyMatrix, setAdjacencyMatrix, k])

  const removePendant = useCallback(() => {
    setAdjacencyMatrix(adjacencyMatrix.clone().removePendant(origMatrix) ?? adjacencyMatrix)
  }, [adjacencyMatrix, setAdjacencyMatrix, origMatrix])

  const addTop = useCallback(() => {
    setAdjacencyMatrix(adjacencyMatrix.clone().addPendant(k) ?? adjacencyMatrix)
  }, [adjacencyMatrix, setAdjacencyMatrix, k])

  const removeTop = useCallback(() => {
    setAdjacencyMatrix(adjacencyMatrix.clone().removeTop(origMatrix, k) ?? adjacencyMatrix)
  }, [setAdjacencyMatrix, adjacencyMatrix, origMatrix, k])

  const restore = useCallback(() => {
    setAdjacencyMatrix(origMatrix)
  }, [setAdjacencyMatrix, origMatrix])

  useEffect(() => {
    const { token, cancel } = CancellationToken.create()

    getVertexCoverKernelizedAsync(adjacencyMatrix, +k, setProgress, token)
      .then(cover => cover ? getDotStringForAdjacencyMatrixWithCover(adjacencyMatrix, cover, theme) : '')
      .then(setCoverDotString)

    return () => {
      cancel()
    }
  }, [adjacencyMatrix, setProgress, setCoverDotString, k, theme])

  return (
    <Box sx={{ p: 3, position: 'relative' }}>
      <Fade in={progress !== 1}>
        <LinearProgress 
          sx={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%',
            '& .MuiLinearProgress-bar': {
              transition: 'none',
            }
          }} 
          value={progress * 100}
          variant="determinate" 
        />
      </Fade>
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
      {coverDotString && (
        <Box sx={{ height: 500, mt: 2 }}>
          <Graph dotString={coverDotString} />
        </Box>
      )}
      {(coverDotString === '') && (
        <Typography 
          variant="h5"
          sx={{mt: 2}}
          align="center"
        >
          No vertex cover found
        </Typography>
      )}
    </Box>
  )
}
export default memo(Kernelization)
