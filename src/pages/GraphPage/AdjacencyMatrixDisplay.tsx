import { Paper } from '@mui/material'
import { FunctionComponent, memo } from 'react'
import { AdjacencyMatrix } from '../../algorithm'
import { AdjacencyMatrixTable } from '../../components'

interface Props {
  adjacencyMatrix: AdjacencyMatrix
  setAdjacencyMatrix: (adjacencyMatrix: AdjacencyMatrix) => void
}

const AdjacencyMatrixDisplay: FunctionComponent<Props> = ({ adjacencyMatrix, setAdjacencyMatrix }) => {
  return (
    <Paper sx={{ bgcolor: 'transparent' }} variant="outlined">
      <AdjacencyMatrixTable
        sx={{
          width: '100%',
          maxHeight: 500
        }}
        adjacencyMatrix={adjacencyMatrix}
        onChange={setAdjacencyMatrix}
      />
    </Paper>
  )
}
export default memo(AdjacencyMatrixDisplay)
