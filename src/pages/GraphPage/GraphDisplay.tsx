import { Box } from '@mui/material'
import { FunctionComponent, memo, useMemo } from 'react'
import { AdjacencyMatrix, getDotStringForAdjacencyMatrix } from '../../algorithm'
import Graph from './Graph'

interface Props {
  adjacencyMatrix: AdjacencyMatrix
}

const GraphDisplay: FunctionComponent<Props> = ({ adjacencyMatrix }) => {
  const dotString = useMemo(() => getDotStringForAdjacencyMatrix(adjacencyMatrix), [adjacencyMatrix])

  return (
    <Box sx={{ height: 500 }}>
      <Graph dotString={dotString} />
    </Box>
  )
}
export default memo(GraphDisplay)
