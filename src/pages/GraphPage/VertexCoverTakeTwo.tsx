import { Box, Fade, LinearProgress, useTheme } from '@mui/material'
import { FunctionComponent, memo, useEffect, useState } from 'react'
import { AdjacencyMatrix, dotStringFromAdjacencyMatrixWithCover } from '../../algorithm'
import { START_VERTEX_COVER_WORK_TAKE_TWO, VertexCoverWorker, VERTEX_COVER_FINISHED, VERTEX_COVER_PROGRESS_UPDATE } from '../../workers'
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
    const worker = new VertexCoverWorker()

    setProgress(0)
    worker.onMessage = ({ data }) => {
      switch (data.type) {
        case VERTEX_COVER_PROGRESS_UPDATE:
          setProgress(data.progress)
          break
        case VERTEX_COVER_FINISHED:
          setProgress(1)
          setDotString(dotStringFromAdjacencyMatrixWithCover(adjacencyMatrix, data.result!, theme))
          break
      }
    }

    worker.postMessage({
      type: START_VERTEX_COVER_WORK_TAKE_TWO,
      adjacencyMatrix,
    })

    return () => {
      worker.terminate()
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
