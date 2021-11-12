import { AdjacencyMatrix } from '../../algorithm'

export const START_CONNECT_SUBGRAPHS_WORK = 'START_CONNECT_SUBGRAPHS_WORK'

export interface StartConnectSubgraphsWork {
  type           : typeof START_CONNECT_SUBGRAPHS_WORK
  adjacencyMatrix: AdjacencyMatrix
}

export const startConnectSubgraphsWork = (adjacencyMatrix: AdjacencyMatrix): StartConnectSubgraphsWork => ({
  type: START_CONNECT_SUBGRAPHS_WORK,
  adjacencyMatrix
})

export type ConnectSubgraphsWorkerIngoing = StartConnectSubgraphsWork

export const CONNECT_SUBGRAPHS_WORK_FINISHED  = 'CONNECT_SUBGRAPHS_WORK_FINISHED'

export interface ConnectSubgraphsWorkFinished {
  type  : typeof CONNECT_SUBGRAPHS_WORK_FINISHED,
  result: AdjacencyMatrix
}

export type ConnectSubgraphsWorkerOutgoing = ConnectSubgraphsWorkFinished
