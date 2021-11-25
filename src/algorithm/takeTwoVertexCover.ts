import ProgressNotifier, { ProgressCallback } from './ProgressNotifier'
import AdjacencyMatrix, { Edge } from './AdjacencyMatrix'

type EdgeMap = Map<string, Edge>

const getEdges = (matrix: AdjacencyMatrix): EdgeMap => {
  const result: EdgeMap = new Map()

  matrix.forEachEdge((edge) => {
    result.set(edge.toString(), edge)
  })

  return result
}

const removeEdgesConnectedToVertex = (matrix: AdjacencyMatrix, vertex: string, edges: EdgeMap) => {
  matrix.forEachEdgeOfVertex(vertex, (edge) => {
    edges.delete(edge.toString())
  })
}

/**
 * Approximates a vertex cover using the take two algorithm
 * @param matrix 
 * @param progressCallback 
 * @returns 
 */
const takeTwoVertexCover = (matrix: AdjacencyMatrix, progressCallback?: ProgressCallback): Set<string> => {
  const result = new Set<string>()
  let   edges = getEdges(matrix)
  
  const notifier = new ProgressNotifier(edges.size, progressCallback)
  while (edges.size) {
    const [, { vertexA, vertexB }] = edges.entries().next().value

    removeEdgesConnectedToVertex(matrix, vertexA, edges)
    removeEdgesConnectedToVertex(matrix, vertexB, edges)

    result.add(vertexA).add(vertexB)
    notifier.update(edges.size)
  }

  return result
}
export default takeTwoVertexCover
