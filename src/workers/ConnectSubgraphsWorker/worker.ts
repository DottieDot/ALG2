
import { connectAdjacencyMatrix } from '../../algorithm'
import { ConnectSubgraphsWorkerIngoing, ConnectSubgraphsWorkFinished, CONNECT_SUBGRAPHS_WORK_FINISHED, START_CONNECT_SUBGRAPHS_WORK } from './model'

// @ts-ignore
const ctx = globalThis.self as any

ctx.onmessage = ({ data }: MessageEvent<ConnectSubgraphsWorkerIngoing>) => {
  switch (data.type) {
    case START_CONNECT_SUBGRAPHS_WORK:
      postMessage({
        type: CONNECT_SUBGRAPHS_WORK_FINISHED,
        result: connectAdjacencyMatrix(data.adjacencyMatrix)
      } as ConnectSubgraphsWorkFinished)
      break
  }
}
