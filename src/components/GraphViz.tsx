import { FunctionComponent, memo, useEffect, useMemo } from 'react'
import { graphviz, GraphvizOptions } from 'd3-graphviz'

export interface GraphVizProps {
  dot       : string
  options   : GraphvizOptions
  className?: string
}

let graphs = 0
const GraphViz: FunctionComponent<GraphVizProps> = ({ dot, options, className }) => {
  const id = useMemo(() => `graphviz-${++graphs}`, [])

  useEffect(() => {
    graphviz(`#${id}`)
      .options({
        engine: 'dot',
        totalMemory: 1024 * 1024 * 100,
        ...options
      })
      .renderDot(dot)
  }, [id, dot, options])

  return (
    <div id={id} className={className} />
  )
}
export default memo(GraphViz)
