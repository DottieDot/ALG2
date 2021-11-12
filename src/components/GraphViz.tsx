import { CircularProgress, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { graphviz, GraphvizOptions } from 'd3-graphviz'
import { Fragment, FunctionComponent, memo, useEffect, useMemo, useState } from 'react'

export interface GraphVizProps {
  dot       : string
  options   : GraphvizOptions
  className?: string
}

let graphs = 0
const GraphViz: FunctionComponent<GraphVizProps> = ({ dot, options, className }) => {
  const [loading, setLoading] = useState(false)
  const id = useMemo(() => `graphviz-${++graphs}`, [])

  useEffect(() => {
    setLoading(true)
    const viz = graphviz(`#${id}`)
      .options({
        engine: 'dot',
        useWorker: true,
        totalMemory: 1024 * 1024 * 256, // 256 MiB
        ...options
      })
      .renderDot(dot, () => {
        setLoading(false)
      })

    return () => {
      // d3-graphiz only has typescript bindings for 2.6.7
      // @ts-ignore
      viz.destroy()
    }
  }, [id, dot, options])

  return (
    <Fragment>
      {loading && (
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            width: options.width,
            height: options.height,
            flexDirection: 'column'
          }}
        >
          <Typography variant="body1" sx={{ mb: 2 }}>Rendering Graph</Typography>
          <CircularProgress />
        </Box>
      )}
      <Box 
        sx={{ display: loading ? 'none' : 'initial' }}
        id={id} 
        className={className} 
      />
    </Fragment>
  )
}
export default memo(GraphViz)
