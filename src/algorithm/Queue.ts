
class QueueNode<T> {
  public next : QueueNode<T> | null = null
  public value: T

  constructor(value: T) {
    this.value = value
  }
}

/**
 * Custom Queue implementation that has a time complexity of O(1) for enqueueing and dequeueing.
 */
export default class Queue<T> {
  private _front: QueueNode<T> | null = null
  private _back : QueueNode<T> | null = null
  private _size : number              = 0

  /**
   * Creates a new queue from an array
   * @param values 
   * @returns 
   */
  public static fromArray<T>(values: T[]): Queue<T> {
    const queue = new Queue<T>()
    values.forEach(v => queue.enqueue(v))
    return queue
  }

  /**
   * Adds an element to the queue
   * @param element 
   */
  public enqueue(element: T) {
    this._size += 1

    if (!this._back) {
      this._front = new QueueNode(element)
      this._back = this._front
      return
    }

    const node = new QueueNode(element)
    this._back.next = node
    this._back = node
  }

  /**
   * Returns the first element and removes it
   * @returns the first element
   */
  public dequeue(): T | undefined {
    this._size -= 1

    const value = this._front?.value
    this._front = this._front?.next ?? null

    if (!this._front) {
      this._back = null
    }

    return value
  }

  /**
   * Returns the first element
   * @returns the first element
   */
  public front(): T | undefined {
    return this._front?.value
  }

  /**
   * Returns the last element
   * @returns te last element
   */
  public back(): T | undefined {
    return this._back?.value
  }

  /**
   * Checks if the queue is empty
   * @returns true if empty
   */
  public isEmpty(): boolean {
    return this._size === 0
  }

  /**
   * Removes all elements from the queue
   */
  public clear() {
    this._front = this._back = null
    this._size = 0
  }
}
