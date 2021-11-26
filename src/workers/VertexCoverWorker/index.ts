import { START_OPTIMIZED_VERTEX_COVER_WORK, START_VERTEX_COVER_WORK, START_VERTEX_COVER_WORK_TAKE_TWO, VertexCoverWorkerIngoing, VertexCoverWorkerOutgoing, VERTEX_COVER_FINISHED, VERTEX_COVER_PROGRESS_UPDATE } from './model'
import WorkerBase from '../WorkerBase'
import { AdjacencyMatrix, ProgressCallback } from '../../algorithm'
import CancellationToken from 'cancellationtoken'

export * from './model'

export default class VertexCoverWorker extends WorkerBase<VertexCoverWorkerIngoing, VertexCoverWorkerOutgoing> {
  constructor() {
    super(new Worker(new URL('./worker.ts', import.meta.url)))
  }
}

export const getVertexCoverAsync = async (matrix: AdjacencyMatrix, coverSize: number, progressCallback: ProgressCallback, cancellationToken?: CancellationToken): Promise<Set<string> | null> => {
  return new Promise((resolve, reject) => {
    const worker = new VertexCoverWorker()

    progressCallback(0)
    worker.onMessage = ({ data }) => {
      switch (data.type) {
        case VERTEX_COVER_PROGRESS_UPDATE:
          progressCallback(data.progress)
          break
        case VERTEX_COVER_FINISHED:
          progressCallback(1)
          resolve(data.result)
      }
    }
  
    worker.postMessage({
      type: START_VERTEX_COVER_WORK,
      adjacencyMatrix: matrix.data,
      verticesInCover: coverSize
    })
  
    cancellationToken?.onCancelled(() => {
      worker.terminate()
      reject('CancellationToken')
    })
  })
}

export const getVertexCoverKernelizedAsync = async (matrix: AdjacencyMatrix, coverSize: number, progressCallback: ProgressCallback, cancellationToken?: CancellationToken): Promise<Set<string> | null> => {
  return new Promise((resolve, reject) => {
    const worker = new VertexCoverWorker()

    progressCallback(0)
    worker.onMessage = ({ data }) => {
      switch (data.type) {
        case VERTEX_COVER_PROGRESS_UPDATE:
          progressCallback(data.progress)
          break
        case VERTEX_COVER_FINISHED:
          progressCallback(1)
          resolve(data.result)
      }
    }
  
    worker.postMessage({
      type: START_OPTIMIZED_VERTEX_COVER_WORK,
      adjacencyMatrix: matrix.data,
      verticesInCover: coverSize
    })
  
    cancellationToken?.onCancelled(() => {
      worker.terminate()
      reject('CancellationToken')
    })
  })
}

export const takeTwoVertexCoverAsync = async (matrix: AdjacencyMatrix, progressCallback: ProgressCallback, cancellationToken?: CancellationToken): Promise<Set<string>> => {
  return new Promise((resolve, reject) => {
    const worker = new VertexCoverWorker()

    progressCallback(0)
    worker.onMessage = ({ data }) => {
      switch (data.type) {
        case VERTEX_COVER_PROGRESS_UPDATE:
          progressCallback(data.progress)
          break
        case VERTEX_COVER_FINISHED:
          progressCallback(1)
          resolve(data.result!)
      }
    }
  
    worker.postMessage({
      type: START_VERTEX_COVER_WORK_TAKE_TWO,
      adjacencyMatrix: matrix.data
    })
  
    cancellationToken?.onCancelled(() => {
      worker.terminate()
      reject('CancellationToken')
    })
  })
}

