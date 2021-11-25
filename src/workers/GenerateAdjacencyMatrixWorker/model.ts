import { RawAdjacencyMatrix } from '../../algorithm'

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
  adjacencyMatrix: RawAdjacencyMatrix
}

export type GenerateAdjacencyMatrixWorkerOutgoing = AdjacencyMatrixWorkFinished
