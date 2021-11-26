import { faSitemap } from '@fortawesome/free-solid-svg-icons'
import { Box, Fade, InputAdornment, LinearProgress, TextField, Typography, useTheme } from '@mui/material'
import CancellationToken from 'cancellationtoken'
import { FunctionComponent, memo, useEffect, useState } from 'react'
import { AdjacencyMatrix, getDotStringForAdjacencyMatrixWithCover } from '../../algorithm'
import { FontAwesomeIcon } from '../../components'
import { getVertexCoverAsync } from '../../workers'
import Graph from './Graph'

interface Props {
  adjacencyMatrix: AdjacencyMatrix
  updateLayout: () => void
}

const VertexCover: FunctionComponent<Props> = ({ adjacencyMatrix, updateLayout }) => {
  const theme = useTheme()
  const [progress, setProgress] = useState(0)
  const [dotString, setDotString] = useState<string | null>(null)
  const [k, setK] = useState('')

  useEffect(() => {
    const { token, cancel } = CancellationToken.create()

    getVertexCoverAsync(adjacencyMatrix, +k, setProgress, token)
      .then(cover => cover ? getDotStringForAdjacencyMatrixWithCover(adjacencyMatrix, cover, theme) : '')
      .then(setDotString)

    return () => {
      cancel()
    }
  }, [adjacencyMatrix, setProgress, setDotString, k, theme])

  useEffect(() => {
    updateLayout()
  }, [dotString, updateLayout])

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
      <TextField
        label="Number of vertices to cover"
        helperText={'The number of vertices to use in the cover'}
        type="number"
        placeholder="10"
        value={k}
        onChange={e => setK(e.target.value)}
        InputProps={{ 
          startAdornment: (
            <InputAdornment position="start">
              <FontAwesomeIcon fontSize="inherit" icon={faSitemap} />
            </InputAdornment>
          )
        }}
        inputProps={{
          min: 1
        }}
        required
        fullWidth
      />
      {dotString && (
        <Box sx={{ height: 500 }}>
          <Graph dotString={dotString} />
        </Box>
      )}
      {(dotString === '') && (
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
export default memo(VertexCover)
