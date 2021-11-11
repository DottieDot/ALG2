import Worker from 'worker-loader!./generateAdjacencyMatrix.worker.ts'
import { GenerateAdjacencyMatrixWorkerIngoing, GenerateAdjacencyMatrixWorkerOutgoing } from './generateAdjacencyMatrix.worker'
import WorkerBase from './WorkerBase'

export * from './generateAdjacencyMatrix.worker'

export default class GenerateAdjacencyMatrixWorker extends WorkerBase<GenerateAdjacencyMatrixWorkerIngoing, GenerateAdjacencyMatrixWorkerOutgoing> {
  constructor() {
    super(new Worker())
  }
}
