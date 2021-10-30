import _ from 'lodash'
import { AdjacencyMatrix } from './adjacencyMatrix'
import Queue from './Queue'

export class Vertex {
  private _id: string
  private _edges: string[]

  public constructor(id: string, edges: string[] = []) {
    this._id = id
    this._edges = edges
  }

  public get id(): string {
    return this._id
  }

  public get edges(): string[] {
    return this._edges
  }

  public addEdge(to: string) {
    this._edges.push(to)
  }
}

export default class Graph {
  private _vertices: { [id: string]: Vertex }

  constructor(adjacencyMatrix: AdjacencyMatrix) {
    this._vertices = _.transform(adjacencyMatrix, (accumulator, connections, id) => {
      accumulator[id] = new Vertex(
        id,
        _.transform<boolean, string[]>(connections, (accumulator, connected, toId) => {
          if (connected) {
            accumulator.push(toId)
          }
          return accumulator
        }, [])
      )
      return accumulator
    })
  }

  private addEdgeForVertices(vertA: string | number, vertB: string | number) {
    this._vertices[vertA]?.addEdge(vertB.toString())
    this._vertices[vertB]?.addEdge(vertA.toString())
  }

  /**
   * Connects all disconnected graphs.
   * 
   * It's a huge mess but O(n)
   */
  public connectDisconnectedGraphs() {
    type IntermediateVertex = { vertex: Vertex, subGraph: number | null }
    const vertices = Object.keys(this._vertices).reduce<{ [id: string]: IntermediateVertex }>((accumulator, key) => {
      accumulator[key] = {
        vertex: this._vertices[key],
        subGraph: null
      }
      return accumulator
    }, {})
    const verticesArray = Object.values(vertices)
    const subgraphs: string[] = []
    let previousDisconnectedVertexIndex = -1
    let nProcessed = 0

    while (nProcessed < verticesArray.length) {
      const index = _.findIndex(verticesArray, ({ subGraph }) => subGraph === null, previousDisconnectedVertexIndex + 1)
      previousDisconnectedVertexIndex = index

      const queue = Queue.fromArray<IntermediateVertex>([vertices[index]])
      while (!queue.isEmpty()) {
        const vert = queue.dequeue()!

        if (vert.subGraph === null) {
          vert.subGraph = subgraphs.length
          subgraphs.push(vert.vertex.id)
        }

        for (const other of vert.vertex.edges) {
          const otherVert = vertices[other]
          if (otherVert.subGraph === null) {
            otherVert.subGraph = vert.subGraph
            queue.enqueue(otherVert)
          }
        }

        nProcessed += 1
      }
    }

    for (let i = 1; i < subgraphs.length; ++i) {
      this.addEdgeForVertices(subgraphs[0], subgraphs[i])
    }
  }

  public toAdjacencyMatrix(): AdjacencyMatrix {
    const keys = Object.keys(this._vertices)
    const vertices = Object.values(this._vertices)

    return vertices.reduce<AdjacencyMatrix>((accumulator, vertex) => {
      accumulator[vertex.id] = keys.reduce<{[col: string]: boolean}>((accumulator, id) => {
        accumulator[id] = false
        return accumulator
      }, {})
      vertex.edges.forEach(id => accumulator[vertex.id][id] = true)
      return accumulator
    }, {})
  }
}
