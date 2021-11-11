
import { AdjacencyMatrix, generateAdjacencyMatrix } from '../algorithm'

// @ts-ignore
const ctx = globalThis.self as any

export const START_GENERATE_ADJACENCY_MATRIX_WORK = 'START_GENERATE_ADJACENCY_MATRIX_WORK'

export interface StartGenerateAdjacencyMatrixWork {
  type    : typeof START_GENERATE_ADJACENCY_MATRIX_WORK
  vertices: number
  density : number
}

export const startGenerateAdjacencyMatrixWork = (vertices: number, density: number): StartGenerateAdjacencyMatrixWork => ({
  type: START_GENERATE_ADJACENCY_MATRIX_WORK,
  vertices, density
})

export type GenerateAdjacencyMatrixWorkerIngoing = StartGenerateAdjacencyMatrixWork

export const GENERATE_ADJACENCY_MATRIX_WORK_FINISHED = 'GENERATE_ADJACENCY_MATRIX_WORK_FINISHED'

export interface AdjacencyMatrixWorkFinished {
  type           : typeof GENERATE_ADJACENCY_MATRIX_WORK_FINISHED,
  adjacencyMatrix: AdjacencyMatrix
}

export type GenerateAdjacencyMatrixWorkerOutgoing = AdjacencyMatrixWorkFinished

ctx.onmessage = ({ data }: MessageEvent<GenerateAdjacencyMatrixWorkerIngoing>) => {
  switch (data.type) {
    case START_GENERATE_ADJACENCY_MATRIX_WORK:
      postMessage({
        type: GENERATE_ADJACENCY_MATRIX_WORK_FINISHED,
        adjacencyMatrix: generateAdjacencyMatrix(data.vertices, data.density)
      })
      break
  }
}
