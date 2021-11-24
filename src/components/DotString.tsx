import { Paper, styled } from '@mui/material'
import { SxProps } from '@mui/system'
import { FunctionComponent, memo, useMemo } from 'react'

const formatDotString = (dotString: string): string => {
  return dotString
    .replace('{', '{\n\t')
    .replaceAll(';', ';\n\t')
    .replace('\t}', '}')
}

export interface DotStringProps {
  dotString: string
  sx: SxProps
}

const TextArea = styled('textarea')(({ theme }) => ({
  width     : '100%',
  background: 'none',
  color     : 'inherit',
  border    : 'none',
  outline   : 'none',
  fontFamily: 'inherit',
  resize    : 'none',
  padding   : theme.spacing(2),
  fontSize  : 'inherit'
}))

const DotString: FunctionComponent<DotStringProps> = ({ dotString, sx }) => {
  const formatted = useMemo(() => formatDotString(dotString), [dotString])

  return (
    <Paper
      component={TextArea}
      sx={sx}
      variant="outlined"
      value={formatted}
      readOnly
    />
  )
}
export default memo(DotString)
