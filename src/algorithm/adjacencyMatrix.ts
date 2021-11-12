import { Theme } from '@mui/material'
import _ from 'lodash'
import Queue from './Queue'

export type AdjacencyMatrix = { [row: string]: { [column: string]: boolean } }

/**
 * Connects all subgraphs in an adjacency matrix
 * @param matrix The matrix to connect
 * @returns A new, connected, matrix
 */
export const connectAdjacencyMatrix = (matrix: AdjacencyMatrix): AdjacencyMatrix => {
  const result              = { ...matrix }
  const keys                = Object.keys(result)
  const processed           = new Set<string>()
  const subgraphs: string[] = []
  let   prevIndex           = -1

  while (processed.size < keys.length) {
    const index = _.findIndex(keys, key => !processed.has(key), prevIndex + 1)
    prevIndex = index

    subgraphs.push(keys[index])
    processed.add(keys[index])

    const queue = Queue.fromArray([keys[index]])
    while (!queue.isEmpty()) {
      const row = queue.dequeue()!

      for (const col in matrix[row]) {
        if (matrix[row][col] && !processed.has(col)) {
          processed.add(col)
          queue.enqueue(col)
        }
      }
    }
  }

  for (let i = 1; i < subgraphs.length; ++i) {
    result[subgraphs[0]][subgraphs[i]] = true
    result[subgraphs[i]][subgraphs[0]] = true
  }

  return result
}

/**
 * Generates an adjacency graph for n vertices.
 * @param nVertices number of vertices
 * @param density edge density
 */
export const generateAdjacencyMatrix = (nVertices: number, density: number): AdjacencyMatrix => {
  const matrix: AdjacencyMatrix = {}

  for (let i = 0; i < nVertices; ++i) {
    if (!matrix[i]) {
      matrix[i] = {}
    }
    for (let j = 0; j <= i; ++j) {
      if (j !== i && Math.random() < density) {
        matrix[i][j] = true

        if (!matrix[j]) {
          matrix[j] = {}
        }
        matrix[j][i] = true
      }
      else {
        matrix[i][j] = matrix[j][i] = false
      }
    }
  }

  return matrix
}

/**
 * Creates a dot string from an adjacency matrix
 * @param matrix the matrix to generate a dot string for
 * @returns the resulting dot string
 */
export const dotStringFromAdjacencyMatrix = (matrix: AdjacencyMatrix): string => {
  const keys = Object.keys(matrix)

  let result = 'graph {'

  result += keys.map((row, index) => (
    `"${row}";` + keys
      .filter((col, i) => (i > index) && matrix[row][col])
      .map(col => `"${row}" -- "${col}"`)
      .join(';')
  )).join('')

  result += '}'

  return result
}

/**
 * Creates a dot string from an adjacency matrix
 * @param matrix the matrix to generate a dot string for
 * @returns the resulting dot string
 */
 export const dotStringFromAdjacencyMatrixWithCover = (matrix: AdjacencyMatrix, cover: Set<string>, theme: Theme): string => {
  const keys = Object.keys(matrix)

  let result = 'graph {'

  result += keys.map((row, index) => (
    `"${row}"[${cover.has(row) ?  `style=filled,fillcolor="${theme.palette.info.main}"` : ''}];` + keys
      .filter((col, i) => (i > index) && matrix[row][col])
      .map(col => `"${row}" -- "${col}"`)
      .join(';')
  )).join('')

  result += '}'

  return result
}

const isAdjacencyMatrixCovered = (matrix: AdjacencyMatrix, cover: Set<string>): boolean => {
  const keys = Object.keys(matrix)

  for (let i = 0; i < keys.length; ++i) {
    for (let j = 0; j < i; ++j) {
      const isEdge = matrix[keys[i]][keys[j]]

      if (isEdge && !cover.has(keys[i]) && !cover.has(keys[j])) {
        return false
      }
    }
  }

  return true
}

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

const getVertexCoverForAdjacencyMatrixInternal = (
  matrix            : AdjacencyMatrix, 
  k                 : number, 
  progressCallback ?: (p: number) => void, 
  keys              : string[] = Object.keys(matrix), 
  cover             : Set<string> = new Set<string>(),
  i                 : number = 0,
  count             : number = 0,
  totalCombinations : number = combinations(keys.length, k)
): [Set<string> | null, number] => {

  if (!(count % Math.round(totalCombinations / 100))) {
    progressCallback && progressCallback(count / totalCombinations)
  }

  if (k === cover.size) {
    return isAdjacencyMatrixCovered(matrix, cover) 
      ? [cover, count + 1]
      : [null, count + 1]
  }

  if ((cover.size + (keys.length - i) < k) || (k > keys.length)) {
    return [null, count]
  }

  if (i >= keys.length) {
    return [null, count + 1]
  }

  const newCover = new Set<string>(cover).add(keys[i])
  const [a, c1] = getVertexCoverForAdjacencyMatrixInternal(matrix, k, progressCallback, keys, newCover, i + 1, count, totalCombinations)
  if (a !== null) {
    return [a, c1]
  }
  
  const [b, c2] = getVertexCoverForAdjacencyMatrixInternal(matrix, k, progressCallback, keys, cover, i + 1, c1, totalCombinations)
  if (b !== null) {
    return [b, c2]
  }

  return [null, c2]
}

/**
 * Gets a vertex cover of `k` vertices for an adjacency matrix 
 * @param matrix the matrix to ge the cover for
 * @param k target number of vertices in the cover
 * @param progressCallback gets called with the current progress
 * @param cancellationToken allows the cancellation of the algorithm
 */
export const getVertexCoverForAdjacencyMatrix = (  
  matrix            : AdjacencyMatrix, 
  k                 : number, 
  progressCallback ?: (p: number) => void, 
): Set<string> | null => {
  return getVertexCoverForAdjacencyMatrixInternal(matrix, k, progressCallback)[0]
}
