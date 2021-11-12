
import { generateAdjacencyMatrix } from '../../algorithm'
import { GenerateAdjacencyMatrixWorkerIngoing, GENERATE_ADJACENCY_MATRIX_WORK_FINISHED, START_GENERATE_ADJACENCY_MATRIX_WORK } from './model'

// @ts-ignore
const ctx = globalThis.self as any

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
