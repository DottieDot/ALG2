import { Paper } from '@mui/material'
import { FunctionComponent, memo } from 'react'
import { AdjacencyMatrix } from '../../algorithm'
import { AdjacencyMatrixTable } from '../../components'

interface Props {
  adjacencyMatrix: AdjacencyMatrix
}

const AdjacencyMatrixDisplay: FunctionComponent<Props> = ({ adjacencyMatrix }) => {
  return (
    <Paper sx={{ maxHeight: 500, overflow: 'auto', bgcolor: 'transparent' }} variant="outlined">
      <AdjacencyMatrixTable
        sx={{
          width: '100%'
        }}
        adjacencyMatrix={adjacencyMatrix}
      />
    </Paper>
  )
}
export default memo(AdjacencyMatrixDisplay)
