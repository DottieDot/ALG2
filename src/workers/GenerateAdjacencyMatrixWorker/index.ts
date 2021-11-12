import { GenerateAdjacencyMatrixWorkerIngoing, GenerateAdjacencyMatrixWorkerOutgoing } from './model'
import WorkerBase from '../WorkerBase'

export * from './model'

export default class GenerateAdjacencyMatrixWorker extends WorkerBase<GenerateAdjacencyMatrixWorkerIngoing, GenerateAdjacencyMatrixWorkerOutgoing> {
  constructor() {
    super(new Worker(new URL('./worker.ts', import.meta.url)))
  }
}
