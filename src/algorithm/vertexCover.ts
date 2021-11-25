import ProgressNotifier, { ProgressCallback } from './ProgressNotifier'
import AdjacencyMatrix from './AdjacencyMatrix'

const factorial = (n: number): bigint => {
  let result = 1n
  for (let i = BigInt(n); i >= 1n; --i) {
    result *= i
  }
  return result
}

const combinations = (n: number, r: number): number => {
  let result = factorial(n) / (factorial(n - r) * factorial(r))
  return +result.toString()
}

const getUncoveredDegree = (matrix: AdjacencyMatrix, vertex: string, cover: Set<string>): number => {
  let result = 0
  matrix.forEachEdgeOfVertex(vertex, ({ vertexB }) => {
    result += +cover.has(vertexB)
  })
  return result
}

const countUncoveredEdges = (matrix: AdjacencyMatrix, cover: Set<string>): number => {
  let result = 0
  matrix.forEachEdge(({ vertexA, vertexB }) => {
    result += +!(cover.has(vertexA) || (cover.has(vertexB)))
  })
  return result
}

const isAdjacencyMatrixCovered = (matrix: AdjacencyMatrix, cover: Set<string>): boolean => {
  return matrix.allEdges(({ vertexA, vertexB }) => cover.has(vertexA) || cover.has(vertexB))
}

const getVertexCoverInternal = (
  matrix    : AdjacencyMatrix,
  coverSize : number,
  notifier  : ProgressNotifier,
  cover     : Set<string> = new Set<string>(),
  iteration : number      = 0,
  vertices  : string[]    = matrix.vertices,
  count     : number      = 0
): [Set<string> | null, number] => {

  notifier.update(count)

  const recursive = (cover: Set<string>, iteration: number, count: number) =>
    getVertexCoverInternal(matrix, coverSize, notifier, cover, iteration, vertices, count)

  if (cover.size === coverSize) {
    return isAdjacencyMatrixCovered(matrix, cover)
      ? [cover, count + 1]
      : [null , count + 1]
  }

  if ((cover.size + (vertices.length - iteration) < coverSize)) {
    return [null, count]
  }

  const newCover = new Set<string>(cover).add(vertices[iteration])
  const [a, c1] = recursive(newCover, iteration + 1, count)
  if (a !== null) {
    return [a, c1]
  }

  const [b, c2] = recursive(cover, iteration + 1, c1)
  if (b !== null) {
    return [b, c2]
  }

  return [null, c2]
}

/**
 * Gets a vertex cover of `k` vertices for an adjacency matrix 
 * @param matrix the matrix to ge the cover for
 * @param coverSize target number of vertices in the cover
 * @param progressCallback gets called with the current progress
 * @param cancellationToken allows the cancellation of the algorithm
 */
 export const getVertexCover = (  
  matrix           : AdjacencyMatrix,
  coverSize        : number,
  progressCallback?: ProgressCallback
): Set<string> | null => {
  return getVertexCoverInternal(
    matrix,
    coverSize,
    new ProgressNotifier(
      combinations(matrix.vertices.length, coverSize),
      progressCallback
    )
  )[0]
}

/**
 * Gets a vertex cover of `k` vertices for an adjacency matrix using kernelization
 * @param matrix the matrix to ge the cover for
 * @param coverSize target number of vertices in the cover
 * @param progressCallback gets called with the current progress
 * @param cancellationToken allows the cancellation of the algorithm
 */
export const getVertexCoverKernelized = (
  matrix           : AdjacencyMatrix,
  coverSize        : number,
  progressCallback?: ProgressCallback
): Set<string> | null => {
  const vertices = new Set(matrix.vertices)
  const cover    = new Set<string>()
  const degrees  = matrix.degrees.sort(({ degree: a }, { degree: b }) => a - b)

  let topsDegree = coverSize
  for (const { degree: deg, vertex } of degrees) {
    if (deg === 0) {
      vertices.delete(vertex)
    }
    else if (deg === 1 && !cover.has(vertex)) {
      const neighbor = matrix.getNeighbors(vertex)[0]
      cover.add(neighbor)
      vertices.delete(neighbor)
      vertices.delete(vertex)

      --topsDegree
    }
    else if (deg >= topsDegree && getUncoveredDegree(matrix, vertex, cover) >= topsDegree) {
      cover.add(vertex)
      vertices.delete(vertex)
      --topsDegree
    }
  }

  if (countUncoveredEdges(matrix, cover) > (coverSize ** 2)) {
    return null
  }

  return getVertexCoverInternal(
    matrix,
    coverSize,
    new ProgressNotifier(
      combinations(vertices.size, coverSize - cover.size),
      progressCallback
    ),
    cover,
    undefined,
    [...vertices]
  )[0]
}
