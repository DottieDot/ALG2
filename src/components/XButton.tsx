import { ButtonProps, styled, Button,  LinearProgress } from '@mui/material'
import { Box } from '@mui/system'
import { FunctionComponent, memo } from 'react'

const StyledButton = styled(Button)(() => ({
  position: 'relative',
  overflow: 'hidden'
}))

export interface XButtonProps extends ButtonProps {
  processing?: boolean
}

const XButton: FunctionComponent<XButtonProps> = ({ processing: loading, disabled, children, color, ...rest }) => {
  return (
    <StyledButton color={color} disabled={disabled || loading} {...rest}>
      {loading && (
        <Box 
          sx={{
            position: 'absolute',
            width: '100%',
            bottom: 0
          }}
          component="span"
        >
          <LinearProgress 
            color={color}
          />
        </Box>
      )}
      {children}
    </StyledButton>
  )
}
export default memo(XButton)
