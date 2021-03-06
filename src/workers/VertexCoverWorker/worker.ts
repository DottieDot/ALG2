import { AdjacencyMatrix, getVertexCover, getVertexCoverKernelized, takeTwoVertexCover } from '../../algorithm'
import { START_VERTEX_COVER_WORK_TAKE_TWO, VertexCoverWorkFinished, START_VERTEX_COVER_WORK, START_OPTIMIZED_VERTEX_COVER_WORK, VertexCoverWorkerIngoing, VertexCoverWorkProgressUpdate, VERTEX_COVER_FINISHED, VERTEX_COVER_PROGRESS_UPDATE } from './model'

// @ts-ignore
const ctx = globalThis.self as any

ctx.onmessage = ({ data }: MessageEvent<VertexCoverWorkerIngoing>) => {
  switch (data.type) {
    case START_VERTEX_COVER_WORK: {
      const cover = getVertexCover(new AdjacencyMatrix(data.adjacencyMatrix), data.verticesInCover, (p) => {
        postMessage({
          type: VERTEX_COVER_PROGRESS_UPDATE,
          progress: p
        } as VertexCoverWorkProgressUpdate)
      })

      postMessage({
        type: VERTEX_COVER_FINISHED,
        result: cover
      } as VertexCoverWorkFinished)
      break
    }
    case START_OPTIMIZED_VERTEX_COVER_WORK: {
      const cover = getVertexCoverKernelized(new AdjacencyMatrix(data.adjacencyMatrix), data.verticesInCover, (p) => {
        postMessage({
          type: VERTEX_COVER_PROGRESS_UPDATE,
          progress: p
        } as VertexCoverWorkProgressUpdate)
      })

      postMessage({
        type: VERTEX_COVER_FINISHED,
        result: cover
      } as VertexCoverWorkFinished)
      break
    }
    case START_VERTEX_COVER_WORK_TAKE_TWO: {
      const cover = takeTwoVertexCover(new AdjacencyMatrix(data.adjacencyMatrix), (p) => {
        postMessage({
          type: VERTEX_COVER_PROGRESS_UPDATE,
          progress: p
        } as VertexCoverWorkProgressUpdate)
      })

      postMessage({
        type: VERTEX_COVER_FINISHED,
        result: cover
      } as VertexCoverWorkFinished)
      break
    }
  }
}
