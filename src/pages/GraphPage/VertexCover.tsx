import { Box, LinearProgress, styled, TextField, useTheme } from '@mui/material'
import CancellationToken from 'cancellationtoken'
import Graphviz from 'graphviz-react'
import { FunctionComponent, memo, useEffect, useState } from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'
import { AdjacencyMatrix, dotStringFromAdjacencyMatrixWithCover, getVertexCoverForAdjacencyMatrix } from '../../algorithm'

interface Props {
  adjacencyMatrix: AdjacencyMatrix
}

const StyledGraph = styled(Graphviz)(({ theme }) => ({
  '.graph': {
    '> polygon': {
      fill: 'transparent'
    },
    '.node': {
      '> *': {
        stroke: theme.palette.text.primary
      },
      '> text': {
        stroke: 'transparent'
      }
    },
    '.edge': {
      '> *': {
        stroke: theme.palette.text.primary
      },
      '> polygon': {
        fill: theme.palette.text.primary
      }
    },
    'text': {
      fill: theme.palette.text.primary
    }
  }
}))

const VertexCover: FunctionComponent<Props> = ({ adjacencyMatrix }) => {
  const theme = useTheme()
  const [progress, setProgress] = useState(0)
  const [dotString, setDotString] = useState<string | null>(null)
  const [k, setK] = useState('2')

  useEffect(() => {
    const { token, cancel } = CancellationToken.create()

    const fn = async () => {
      try {
        const cover = await getVertexCoverForAdjacencyMatrix(adjacencyMatrix, +k, setProgress, token)
        if (cover) {
          const dotStr = dotStringFromAdjacencyMatrixWithCover(adjacencyMatrix, cover, theme)
          setDotString(dotStr)
        }
      }
      catch {

      }
    }
    fn()

    return () => {
      cancel()
    }
  }, [adjacencyMatrix, setProgress, setDotString, k, theme])

  return (
    <Box sx={{ p: 3, position: 'relative' }}>
      {!dotString && <LinearProgress sx={{ position: 'absolute', top: 0, left: 0, width: '100%' }} value={progress} variant="determinate" />}
      <TextField
        label="Number of vertices to cover"
        helperText={'The number of vertices to use in the cover'}
        type="number"
        placeholder="10"
        value={k}
        onChange={e => setK(e.target.value)}
        required
        fullWidth
      />
      {dotString && (
        <Box sx={{ height: 500 }}>
          <AutoSizer>
            {({ height, width }) => (
              <StyledGraph
                dot={dotString}
                options={{
                  useWorker: false,
                  fit: true,
                  zoom: false,
                  width: width,
                  height: height,
                }}
              />
            )}
          </AutoSizer>
        </Box>
      )}
    </Box>
  )
}
export default memo(VertexCover)
