import { Box, Fade, LinearProgress, useTheme } from '@mui/material'
import CancellationToken from 'cancellationtoken'
import { FunctionComponent, memo, useEffect, useState } from 'react'
import { AdjacencyMatrix, getDotStringForAdjacencyMatrixWithCover } from '../../algorithm'
import { takeTwoVertexCoverAsync } from '../../workers'
import Graph from './Graph'

interface Props {
  adjacencyMatrix: AdjacencyMatrix
  updateLayout: () => void
}

const VertexCoverTakeTwo: FunctionComponent<Props> = ({ adjacencyMatrix, updateLayout }) => {
  const theme = useTheme()
  const [progress, setProgress] = useState(0)
  const [dotString, setDotString] = useState<string | null>(null)

  useEffect(() => {
    const { token, cancel } = CancellationToken.create()

    takeTwoVertexCoverAsync(adjacencyMatrix, setProgress, token)
      .then(cover => getDotStringForAdjacencyMatrixWithCover(adjacencyMatrix, cover, theme))
      .then(setDotString)

    return () => {
      cancel()
    }
  }, [adjacencyMatrix, setProgress, setDotString, theme])

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
      {dotString && (
        <Box sx={{ height: 500 }}>
          <Graph dotString={dotString} />
        </Box>
      )}
    </Box>
  )
}
export default memo(VertexCoverTakeTwo)
