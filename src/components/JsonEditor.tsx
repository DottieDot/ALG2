import { Box, BoxProps, useTheme } from '@mui/material'
import { FunctionComponent, memo } from 'react'
import AceEditor from 'react-ace'

import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/theme-terminal'
import 'ace-builds/src-noconflict/theme-xcode'

export interface JsonEditorProps extends Omit<BoxProps, 'onChange'> {
  value   : string
  onChange: (newValue: string) => void
}
const JsonEditor: FunctionComponent<JsonEditorProps> = ({ value, onChange, ...boxProps }) => {
  const theme = useTheme()
  const dark = theme.palette.mode === 'dark'

  return (
    <Box {...boxProps}>
      <AceEditor
        mode="json"
        theme={ dark ? 'terminal' : 'xcode' }
        name="INPUT_JSON_EDITOR"
        editorProps={{ $blockScrolling: true }}
        showPrintMargin={false}
        value={value}
        onChange={onChange}
        style={{ background: 'none' }}
        height="100%"
        width="100%"
      />
    </Box>
  )
}
export default memo(JsonEditor)
