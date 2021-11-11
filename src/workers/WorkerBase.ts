
export default class WorkerBase<TIngoing, TOutgoing> {
  private _worker: Worker

  public constructor(worker: Worker) {
    this._worker = worker
  }

  public set onMessage(handler: (e: MessageEvent<TOutgoing>) => void) {
    this._worker.onmessage = handler
  }

  public postMessage(message: TIngoing) {
    this._worker.postMessage(message)
  }

  public terminate() {
    this._worker.terminate()
  }
}
