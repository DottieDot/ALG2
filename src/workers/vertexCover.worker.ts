import { AdjacencyMatrix, getVertexCoverForAdjacencyMatrix } from '../algorithm'

// @ts-ignore
const ctx = globalThis.self as any

export const START_VERTEX_COVER_WORK  = 'START_VERTEX_COVER_WORK'

export interface StartVertexCoverWork {
  type           : typeof START_VERTEX_COVER_WORK
  adjacencyMatrix: AdjacencyMatrix
  verticesInCover: number
}

export type VertexCoverWorkerIngoing = StartVertexCoverWork

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

ctx.onmessage = ({ data }: MessageEvent<VertexCoverWorkerIngoing>) => {
  switch (data.type) {
    case START_VERTEX_COVER_WORK:
      const cover = getVertexCoverForAdjacencyMatrix(data.adjacencyMatrix, data.verticesInCover, (p) => {
        postMessage({
          type: VERTEX_COVER_PROGRESS_UPDATE,
          progress: p
        } as VertexCoverWorkProgressUpdate)
      })

      postMessage({
        type: VERTEX_COVER_FINISHED,
        cover: cover
      })
  }
}
