import _ from 'lodash'
import Queue from './Queue'

/**
 * The raw data structure for an adjacency matrix
 */
export type RawAdjacencyMatrix = { [vertex: string]: { [vertex: string]: boolean } }

export class Edge {
  public vertexA: string
  public vertexB: string

  public constructor(vertexA: string, vertexB: string) {
    this.vertexA = vertexA
    this.vertexB = vertexB
  }

  /**
   * Creates a string representation for an edge with weak ordering
   * So, new Edge('a', 'b') === new Edge('b', 'a')
   * @returns 
   */
  public toString(): string {
    if (this.vertexA <= this.vertexB) {
      return `${this.vertexA}-${this.vertexB}`
    }
    else {
      return `${this.vertexB}-${this.vertexA}`
    }
  }
}

/**
 * Stores a vertex and its degree
 */
export class VertexDegree {
  public vertex: string
  public degree: number

  public constructor(vertex: string, degree: number) {
    this.vertex = vertex
    this.degree = degree
  }
}

/**
 * Wraps a `RawAdjacencyMatrix` object
 */
export default class AdjacencyMatrix {
  private _data    : RawAdjacencyMatrix
  private _vertices: string[] | null = null

  /**
   * Verifies if the provided vertices are in the adjacency matrix and throws if they aren't
   * @throws
   * @param vertices 
   */
  private verifyVertices(...vertices: string[]) {
    for (const vertex of vertices) {
      if (!(vertex in this._data)) {
        throw new Error(`${vertex} is not a vertex in matrix`)
      }
    }
  }

  /**
   * Construct a new adjacency matrix with raw data
   * @param data 
   */
  public constructor(data: RawAdjacencyMatrix) {
    this._data = data
  }

  /**
   * Creates a new adjacency matrix from a list of vertices and edges
   * @param vertices 
   * @param edges 
   * @returns 
   */
  public static fromVerticesAndEdges(vertices: string[], edges: Edge[]): AdjacencyMatrix {
    const matrix: RawAdjacencyMatrix = {}

    vertices.forEach(vertexA => {
      matrix[vertexA] = {}
      vertices.forEach(vertexB => {
        matrix[vertexA][vertexB] = false
      })
    })

    edges.forEach(({ vertexA, vertexB }) => {
      matrix[vertexA][vertexB] = true
      matrix[vertexB][vertexA] = true
    })

    return new AdjacencyMatrix(matrix)
  }

  /**
   * Generates a random adjacency matrix
   * @param vertices 
   * @param density the probability of an edge to generate
   * @returns 
   */
  public static generateRandom(vertices: number, density: number): AdjacencyMatrix {
    const matrix: RawAdjacencyMatrix = {}

    for (let i = 0; i < vertices; ++i) {
      const vertexA = i.toString()

      matrix[vertexA] = {}

      for (let j = 0; j <= i; ++j) {
        const vertexB  = j.toString()
        const generate = (i !== j) && (Math.random() < density)

        matrix[vertexA][vertexB] = generate
        matrix[vertexB][vertexA] = generate
      }
    }

    return new AdjacencyMatrix(matrix)
  }

  /**
   * Gets the raw adjacency matrix
   */
  public get data(): RawAdjacencyMatrix {
    return this._data
  }

  /**
   * Makes a copy of the adjacency matrix
   */
  public clone(): AdjacencyMatrix {
    return new AdjacencyMatrix(_.cloneDeep(this.data))
  }

  /**
   * Gets the name of all the vertices
   */
  public get vertices(): string[] {
    if (!this._vertices) {
      this._vertices = Object.keys(this.data)
    }

    return this._vertices
  }

  /**
   * Gets all the edges
   */
  public get edges(): Edge[] {
    const result: Edge[] = []
    this.forEachEdge(e => result.push(e))
    return result
  }

  /**
   * Adds an edge to the adjacency matrix
   * @throws if the edge is invalid
   * @param edge 
   */
  public addEdge({ vertexA, vertexB }: Edge): this {
    this.verifyVertices(vertexA, vertexB)

    this.data[vertexA][vertexB] = true
    this.data[vertexB][vertexA] = true

    return this
  }

  /**
   * Removes an edge from the adjacency matrix
   * @throws if the edge is invalid
   * @param edge 
   */
  public removeEdge({ vertexA, vertexB }: Edge): this {
    this.verifyVertices(vertexA, vertexB)

    this.data[vertexA][vertexB] = false
    this.data[vertexB][vertexA] = false

    return this
  }

  /**
   * Checks if an edge is present in the adjacency matrix
   * @param edge 
   * @returns 
   */
  public hasEdge({ vertexA, vertexB }: Edge): boolean {
    return this.data[vertexA][vertexB] ?? false
  }

  /**
   * Gets the degree for each vertex
   */
  public get degrees(): VertexDegree[] {
    return _.reduce<RawAdjacencyMatrix, VertexDegree[]>(this.data, (accumulator, connections, vertex) => {
      accumulator.push(
        new VertexDegree(
          vertex,
          _.reduce(connections, (count, isConnected) => {
            return count + (+isConnected)
          }, 0)
        )
      )
      return accumulator
    }, [])
  }

  /**
   * Gets the degree for each vertex in map form
   */
  public get degreesMap(): { [vertex: string]: number } {
    return _.reduce<RawAdjacencyMatrix, { [vertex: string]: number }>(this.data, (accumulator, connections, vertex) => {
      accumulator[vertex] = _.reduce(connections, (count, isConnected) => {
        return count + (+isConnected)
      }, 0)
      return accumulator
    }, {})
  }

  public getNeighbors(vertex: string): string[] {
    this.verifyVertices(vertex)

    const result: string[] = []
    this.forEachEdgeOfVertex(vertex, ({ vertexB }) => result.push(vertexB))
    return result
  }

  /**
   * Runs the callback for every edge connected to a given vertex
   * @param vertex 
   * @param callback 
   */
  public forEachEdgeOfVertex(vertex: string, callback: (edge: Edge) => void): void {
    this.verifyVertices(vertex)

    this.vertices.forEach((connection) => {
      if (this.data[vertex][connection]) {
        callback(new Edge(vertex, connection))
      }
    })
  }

  /**
   * Runs the callback for every edge in the matrix
   * @param callback 
   */
  public forEachEdge(callback: (edge: Edge) => void): void {
    for (let i = 0; i < this.vertices.length; ++i) {
      for (let j = 0; j < i; ++j) {
        const edge = new Edge(this.vertices[i], this.vertices[j])
  
        if (this.hasEdge(edge)) {
          callback(edge)
        }
      }
    }
  }
  
  /**
   * Maps all the edges in the matrix
   * @param callback 
   * @returns 
   */
  public mapEdges<T>(callback: (edge: Edge) => T): T[] {
    let result: T[] = []
    this.forEachEdge(edge => result.push(callback(edge)))
    return result
  }

  /**
   * Checks if all edges meet a condition
   * @param callback 
   * @returns 
   */
  public allEdges(callback: (edge: Edge) => boolean): boolean {
    for (let i = 0; i < this.vertices.length; ++i) {
      for (let j = 0; j < i; ++j) {
        const edge = new Edge(this.vertices[i], this.vertices[j])
  
        if (this.hasEdge(edge) && !callback(edge)) {
          return false
        }
      }
    }
    return true
  }

  /**
   * Makes an existing vertex a pendant
   * @param topsDegree 
   * @returns null if failed
   */
  public addPendant(topsDegree: number): this | null {
    const degrees = this.degrees.sort(({ degree: a }, { degree: b }) => a - b)

    const candidate = degrees.find(({ degree }) => (degree > 1) && (degree < topsDegree))
    if (!candidate) {
      return null
    }

    let edgesRemaining = candidate.degree
    for (const neighbor in this.data[candidate.vertex]) {
      const edge = new Edge(candidate.vertex, neighbor)

      if (this.hasEdge(edge)) {
        this.removeEdge(edge)

        edgesRemaining -= 1
        if (edgesRemaining === 1) {
          break
        }
      }
    }

    return this
  }

  /**
   * Removes a pendant by adding edges and tries to restore it its old state
   * @param original 
   * @returns 
   */
  public removePendant(original: AdjacencyMatrix): this | null {
    const degrees     = this.degrees
    const origDegrees = original.degrees

    let candidate = degrees.find(({ degree }, index) => (
      (degree === 1) && (origDegrees[index].degree !== degree)
    )) ?? degrees.find(({ degree }) => degree === 1)

    if (!candidate) {
      return null
    }

    // Try restoring previous edge
    let addedEdge = false
    for (const neighbor in this.data[candidate.vertex]) {
      const edge = new Edge(candidate.vertex, neighbor)
      if (!this.hasEdge(edge) && original.hasEdge(edge)) {
        this.addEdge(edge)
        addedEdge = true
      }
    }

    if (!addedEdge) {
      // Add arbitrary edge
      for (const neighbor in this.data[candidate.vertex]) {
        const edge = new Edge(candidate.vertex, neighbor)
        if (!this.hasEdge(edge)) {
          this.addEdge(edge)
          addedEdge = true
          break
        }
      }
    }

    return addedEdge ? this : null
  }

  /**
   * Adds a top to the adjacency matrix
   * @param topsDegree 
   * @returns 
   */
  public addTop(topsDegree: number): this | null {
    const degrees = this.degrees
      .sort(({ degree: a }, { degree: b }) => b - a)

    if (degrees.length < topsDegree) {
      return null
    }

    const candidate = degrees.find(({ degree }) => degree < topsDegree)
    if (!candidate) {
      return null
    }

    let degree = candidate.degree
    for (const neighbor in this.data[candidate.vertex]) {
      const edge = new Edge(candidate.vertex, neighbor)
      if (!this.hasEdge(edge) && candidate.vertex !== neighbor) {
        this.addEdge(edge)
        ++degree
      }

      if (degree === topsDegree) {
        break
      }
    }
    
    return this
  }

  /**
   * Removes a top from the adjacency matrix and tries to restore it to its original state
   * @param getStyleForVertex 
   * @returns 
   */
  removeTop(original: AdjacencyMatrix, topsDegree: number): this | null {
    const degrees     = this.degrees
    const origDegrees = original.degrees

    const candidate = degrees.find(({ degree }, index) => (
      (degree >= topsDegree) && (origDegrees[index].degree !== degree)
    )) ?? degrees.find(({ degree }) => degree >= topsDegree)
    if (!candidate) {
      return null
    }

    // Try restoring previous edges
    let degree = candidate.degree
    for (const neighbor in this.data[candidate.vertex]) {
      const edge = new Edge(candidate.vertex, neighbor)
      if (!original.hasEdge(edge) && candidate.vertex !== neighbor) {
        this.removeEdge(edge)
        --degree
      }
    }

    if (degree >= topsDegree) {
      // Remove arbitrary edges
      for (const neighbor in this.data[candidate.vertex]) {
        const edge = new Edge(candidate.vertex, neighbor)
        if (this.hasEdge(edge) && candidate.vertex !== neighbor) {
          this.addEdge(edge)
          ++degree
        }

        if (degree < topsDegree) {
          break
        }
      }
    }

    return degree < topsDegree ? this : null
  }

  public makeConnected(): this {
    const vertices            = this.vertices
    const processed           = new Set<string>()
    const subgraphs: string[] = []
    let   prevIndex           = -1
  
    while (processed.size < vertices.length) {
      const index = _.findIndex(vertices, key => !processed.has(key), prevIndex + 1)
      prevIndex = index
  
      subgraphs.push(vertices[index])
      processed.add(vertices[index])
  
      const queue = Queue.fromArray([vertices[index]])
      while (!queue.isEmpty()) {
        const row = queue.dequeue()!
  
        for (const col in this.data[row]) {
          if (this.data[row][col] && !processed.has(col)) {
            processed.add(col)
            queue.enqueue(col)
          }
        }
      }
    }
  
    for (let i = 1; i < subgraphs.length; ++i) {
      const edge = new Edge(subgraphs[0], subgraphs[i])
      this.addEdge(edge)
    }

    return this
  }

  /**
   * Creates a dot string that represents the adjacency matrix
   * @param getStyleForVertex 
   * @returns 
   */
  public generateDotString(getStyleForVertex?: (vertex: string) => Array<string> | undefined): string {
    let result = 'graph {'

    // Vertex definitions
    result += this.vertices.map((vertex) => {
      const style = getStyleForVertex && getStyleForVertex(vertex)
      if (style) {
        return `"${vertex}"[${style.join(',')}];`
      }
      else {
        return `"${vertex}";`
      }
    }).join('')

    // Edges
    result += this.mapEdges(({ vertexA, vertexB }) => (
      `"${vertexA}" -- "${vertexB}";`
    )).join('')

    result += '}'

    return result
  }
}
