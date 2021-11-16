import { Button, ButtonProps } from '@mui/material'
import { ChangeEvent, Fragment, FunctionComponent, memo, useCallback, useMemo } from 'react'
import { v4 as uuid } from 'uuid'

interface FileUploadButtonProps extends ButtonProps<'label'> {
  onUploaded: (value: string) => void
}

const FileUploadButton: FunctionComponent<FileUploadButtonProps> = ({ onUploaded, ...buttonProps }) => {
  const id = useMemo(() => uuid(), [])

  const handleUpload = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader()
      reader.readAsText(event.target.files[0])
      reader.onload = (e) => {
        if (e.target?.result) {
          onUploaded(e.target?.result as string)
        }
      }
    }
  }, [onUploaded])

  return (
    <Fragment>
      <input
        type="file"
        accept="application/json"
        id={id}
        onChange={handleUpload}
        hidden
      />
      <Button
        {...buttonProps}
        component="label"
        htmlFor={id}
      />
    </Fragment>
  )
}
export default memo(FileUploadButton)
