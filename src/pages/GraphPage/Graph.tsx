import { styled } from '@mui/material'
import { DotString, GraphViz } from '../../components'
import { FunctionComponent, memo } from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'
import { useSettings } from '../../hooks'

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
  const displayAsDotString = useSettings().settings.displayDotString

  if (displayAsDotString) {
    return (
      <DotString sx={{ height: '100%' }} dotString={dotString} />
    )
  }

  return (
    <AutoSizer>
      {({ height, width }) => (
        <StyledGraphComponent
          dot={dotString}
          options={{
            useWorker: true,
            fit: true,
            zoom: false,
            width: width,
            height: height
          }}
        />
      )}
    </AutoSizer>
  )
}
export default memo(Graph)
