
export type ProgressCallback = (p: number) => void

/**
 * Periodically calls a progress callback
 */
export default class ProgressNotifier {
  private _progress : number = 0
  private _goal     : number
  private _callback?: ProgressCallback
  private _stepSize : number

  /**
   * 
   * @param goal the end value
   * @param callback the callback to run
   * @param stepSize the minimum amount of progress between each callback
   */
  public constructor(goal: number, callback?: ProgressCallback, stepSize: number = 0.01) {
    this._goal     = goal
    this._callback = callback
    this._stepSize = stepSize
  }

  /**
   * Updates the progress
   * @param current 
   * @returns 
   */
  public update(current: number) {
    if (!this._callback) {
      return
    }

    const progress = current / this._goal
    if (progress - this._progress >= this._stepSize) {
      this._callback(progress)
      this._progress = progress
    }
  }
}
