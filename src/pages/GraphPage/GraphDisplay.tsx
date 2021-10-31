import { styled } from '@mui/material'
import Graphviz from 'graphviz-react'
import { FunctionComponent, memo, useMemo } from 'react'
import { AdjacencyMatrix, Graph } from '../../algorithm'
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
  const graph = useMemo(() => new Graph(adjacencyMatrix), [adjacencyMatrix])

  return (
    <AutoSizer>
      {({ height, width }) => (
        <StyledGraph
          dot={graph.toDotString()}
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
  )
}
export default memo(GraphDisplay)
