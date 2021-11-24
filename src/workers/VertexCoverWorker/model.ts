import { AdjacencyMatrix } from '../../algorithm'

export const START_VERTEX_COVER_WORK            = 'START_VERTEX_COVER_WORK'
export const START_OPTIMIZED_VERTEX_COVER_WORK  = 'START_OPTIMIZED_VERTEX_COVER_WORK'
export const START_VERTEX_COVER_WORK_TAKE_TWO   = 'START_VERTEX_COVER_WORK_TAKE_TWO'

export interface StartVertexCoverWork {
  type           : typeof START_VERTEX_COVER_WORK
  adjacencyMatrix: AdjacencyMatrix
  verticesInCover: number
}

export interface StartOptimizedCoverWork {
  type           : typeof START_OPTIMIZED_VERTEX_COVER_WORK
  adjacencyMatrix: AdjacencyMatrix
  verticesInCover: number
}

export interface StartVertexCoverWorkTakeTwo {
  type           : typeof START_VERTEX_COVER_WORK_TAKE_TWO
  adjacencyMatrix: AdjacencyMatrix
}


export type VertexCoverWorkerIngoing = StartVertexCoverWork | StartOptimizedCoverWork | StartVertexCoverWorkTakeTwo

export const VERTEX_COVER_PROGRESS_UPDATE = 'VERTEX_COVER_PROGRESS_UPDATE'
export const VERTEX_COVER_FINISHED        = 'VERTEX_COVER_FINISHED'

export interface VertexCoverWorkProgressUpdate {
  type    : typeof VERTEX_COVER_PROGRESS_UPDATE
  progress: number
}

export interface VertexCoverWorkFinished {
  type  : typeof VERTEX_COVER_FINISHED
  result: Set<string> | null
}

export type VertexCoverWorkerOutgoing = VertexCoverWorkProgressUpdate | VertexCoverWorkFinished