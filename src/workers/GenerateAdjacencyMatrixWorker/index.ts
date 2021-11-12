import Worker from './generateAdjacencyMatrix.worker.ts'
import { GenerateAdjacencyMatrixWorkerIngoing, GenerateAdjacencyMatrixWorkerOutgoing } from './model'
import WorkerBase from '../WorkerBase'

export * from './model'

export default class GenerateAdjacencyMatrixWorker extends WorkerBase<GenerateAdjacencyMatrixWorkerIngoing, GenerateAdjacencyMatrixWorkerOutgoing> {
  constructor() {
    super(new Worker())
  }
}
