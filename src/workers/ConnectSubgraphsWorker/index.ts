import CancellationToken from 'cancellationtoken'
import { AdjacencyMatrix } from '../../algorithm'
import WorkerBase from '../WorkerBase'
import { ConnectSubgraphsWorkerIngoing, ConnectSubgraphsWorkerOutgoing, CONNECT_SUBGRAPHS_WORK_FINISHED, startConnectSubgraphsWork } from './model'

export * from './worker'

export default class ConnectSubgraphsWorker extends WorkerBase<ConnectSubgraphsWorkerIngoing, ConnectSubgraphsWorkerOutgoing> {
  constructor() {
    super(new Worker(new URL('./worker.ts', import.meta.url)))
  }
}

export const connectSubgraphsAsync = (adjacencyMatrix: AdjacencyMatrix, cancellationToken?: CancellationToken): Promise<AdjacencyMatrix> => {
  return new Promise((resolve, reject) => {
    const worker = new ConnectSubgraphsWorker()

    worker.onMessage = ({ data }) => {
      if (data.type === CONNECT_SUBGRAPHS_WORK_FINISHED) {
        resolve(data.result)
      }
    }

    worker.postMessage(startConnectSubgraphsWork(adjacencyMatrix))

    cancellationToken?.onCancelled(() => {
      worker.terminate()
      reject('cancellation token')
    })
  })
}
