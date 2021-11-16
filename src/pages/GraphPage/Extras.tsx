import { Box, Button } from '@mui/material'
import { FunctionComponent, memo, useCallback } from 'react'
import { AdjacencyMatrix } from '../../algorithm'
import { Download as DownloadIcon } from '@mui/icons-material'
import download from 'downloadjs'

interface Props {
  adjacencyMatrix: AdjacencyMatrix
}

const Extras: FunctionComponent<Props> = ({ adjacencyMatrix }) => {
  const handleExport = useCallback(() => {
    download(
      JSON.stringify(adjacencyMatrix, null, '\t'),
      'adjacency_matrix.json',
      'application/json'
    )
  }, [adjacencyMatrix])

  return (
    <Box>
      <Button 
        variant="contained" 
        startIcon={<DownloadIcon />}
        onClick={handleExport}
      >
        Export Adjacency Matrix
      </Button>
    </Box>
  )
}
export default memo(Extras)
