import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper } from '@mui/material'
import { FunctionComponent, useCallback, useState } from 'react'
import { AdjacencyMatrix } from '../../algorithm'
import { FileUploadButton, JsonEditor } from '../../components'
import { UploadFile as UploadIcon } from '@mui/icons-material'

interface Props {
  open              : boolean
  onClose           : () => void
  setAdjacencyMatrix: (adjacencyMatrix: AdjacencyMatrix) => void
}

const FileUploadDialog: FunctionComponent<Props> = ({ open, onClose, setAdjacencyMatrix }) => {
  const [json, setJson] = useState('')

  const handleClose = useCallback(() => {
    setJson('')
    onClose()
  }, [onClose, setJson])

  const handleUpload = useCallback((contents: string) => {
    setJson(contents)
  }, [setJson])

  const handleConfirm = useCallback(() => {
    const matrix = JSON.parse(json)
    setAdjacencyMatrix(matrix)
    handleClose()
  }, [setAdjacencyMatrix, json, handleClose])

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
      <DialogTitle>
        Import adjacency matrix
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <FileUploadButton 
            variant="contained"
            startIcon={<UploadIcon />}
            onUploaded={handleUpload}
          >
            Import JSON
          </FileUploadButton>
        </Box>
        <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
          <JsonEditor
            value={json}
            onChange={setJson}
            component={Paper}
            sx={{ height: 500 }}
          />
        </Paper>
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={handleClose} 
          color="error"
        >
          Cancel
        </Button>
        <Button 
          onClick={handleConfirm} 
          disabled={!json}
        >
          Import
        </Button>
      </DialogActions>
    </Dialog>
  )
}
export default FileUploadDialog
