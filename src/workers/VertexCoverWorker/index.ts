import Worker from './vertexCover.worker.ts'
import { VertexCoverWorkerIngoing, VertexCoverWorkerOutgoing } from './model'
import WorkerBase from '../WorkerBase'

export * from './model'

export default class VertexCoverWorker extends WorkerBase<VertexCoverWorkerIngoing, VertexCoverWorkerOutgoing> {
  constructor() {
    super(new Worker())
  }
}
