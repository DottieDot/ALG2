import { RawAdjacencyMatrix } from '../../algorithm'

export const START_CONNECT_SUBGRAPHS_WORK = 'START_CONNECT_SUBGRAPHS_WORK'

export interface StartConnectSubgraphsWork {
  type           : typeof START_CONNECT_SUBGRAPHS_WORK
  adjacencyMatrix: RawAdjacencyMatrix
}

export const startConnectSubgraphsWork = (adjacencyMatrix: RawAdjacencyMatrix): StartConnectSubgraphsWork => ({
  type: START_CONNECT_SUBGRAPHS_WORK,
  adjacencyMatrix
})

export type ConnectSubgraphsWorkerIngoing = StartConnectSubgraphsWork

export const CONNECT_SUBGRAPHS_WORK_FINISHED  = 'CONNECT_SUBGRAPHS_WORK_FINISHED'

export interface ConnectSubgraphsWorkFinished {
  type  : typeof CONNECT_SUBGRAPHS_WORK_FINISHED,
  result: RawAdjacencyMatrix
}

export type ConnectSubgraphsWorkerOutgoing = ConnectSubgraphsWorkFinished
