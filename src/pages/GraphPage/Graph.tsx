import { styled } from '@mui/material'
import { GraphViz } from '../../components'
import { FunctionComponent, memo } from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'

const StyledGraphComponent = styled(GraphViz)(({ theme }) => ({
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

const Graph: FunctionComponent<{ dotString: string }> = ({ dotString }) => {
  return (
    <AutoSizer>
      {({ height, width }) => (
        <StyledGraphComponent
          dot={dotString}
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
export default memo(Graph)
