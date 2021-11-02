import { Box, styled } from '@mui/material'
import Graphviz from 'graphviz-react'
import { FunctionComponent, memo, useMemo } from 'react'
import { AdjacencyMatrix, dotStringFromAdjacencyMatrix } from '../../algorithm'
import AutoSizer from 'react-virtualized-auto-sizer'

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

const GraphDisplay: FunctionComponent<Props> = ({ adjacencyMatrix }) => {
  const dotString = useMemo(() => dotStringFromAdjacencyMatrix(adjacencyMatrix), [adjacencyMatrix])

  return (
    <Box sx={{ height: 500 }}>
      <AutoSizer>
        {({ height, width }) => (
          <StyledGraph
            dot={dotString}
            options={{
              useWorker: true,
              fit: true,
              zoom: false,
              width: width,
              height: height,
            }}
          />
        )}
      </AutoSizer>
    </Box>
  )
}
export default memo(GraphDisplay)
