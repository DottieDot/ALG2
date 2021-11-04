import { Theme } from '@mui/material'
import CancellationToken from 'cancellationtoken'
import _ from 'lodash'
import Queue from './Queue'

const getMaxNumberOfEdges = (nVertices: number): number => {
  return nVertices * (nVertices - 1) / 2
}

const getNumberOfEdgesToGenerate = (nVertices: number, density: number): number => {
  return Math.round(getMaxNumberOfEdges(nVertices) * density)
}

const getRandomUniqueNumbers = (min: number, max: number, count: number): Set<number> => {
  if ((max - min) < count) {
    throw new Error('Higher count than random range')
  }

  let options = new Array(max - min)
  for (let i = 0; i < options.length; ++i) {
    options[i] = i + min
  }

  for (let i = 0; i < count; ++i) {
    const swap = Math.floor(Math.random() * options.length)
    const tmp = options[i]
    options[i] = options[swap]
    options[swap] = tmp
  }

  return new Set<number>(options.slice(0, count))
}

const nthTriangleNumber = (n: number): number => {
  let result = 0
  for (let i = 0; i < n; ++i) {
    result += i
  }
  return result
}

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
  const numEdgesToGenerate = getNumberOfEdgesToGenerate(nVertices, density)
  const edgesToGenerate = getRandomUniqueNumbers(0, getMaxNumberOfEdges(nVertices), numEdgesToGenerate)

  for (let i = 0; i < nVertices; ++i) {
    if (!matrix[i]) {
      matrix[i] = {}
    }
    for (let j = 0; j < i; ++j) {
      if (edgesToGenerate.has(nthTriangleNumber(i) + j)) {
        matrix[i][j] = true

        if (!matrix[j]) {
          matrix[j] = {}
        }
        matrix[j][i] = true
      }
      else {
        matrix[i][j] = matrix[i][j] ?? false
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

// Turns out this will still freeze the UI thread??
const yieldTick = () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(0), 500)
  })
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

const getVertexCoverForAdjacencyMatrixInternal = async (
  matrix            : AdjacencyMatrix, 
  k                 : number, 
  progressCallback ?: (p: number) => void, 
  cancellationToken?: CancellationToken, 
  keys              : string[] = Object.keys(matrix), 
  cover             : Set<string> = new Set<string>(),
  i                 : number = 0,
  count             : number = 0
): Promise<Set<string>|null> => {

  cancellationToken?.throwIfCancelled()

  const totalCombinations = 2 ** keys.length

  if (k === cover.size) {
    return isAdjacencyMatrixCovered(matrix, cover) 
      ? cover
      : null
  }

  if (k > keys.length || i >= keys.length) {
    return null
  }

  if (!(count % 200)) {
    await yieldTick()
    progressCallback && progressCallback(count / totalCombinations)
  }

  const newCover = new Set<string>(cover).add(keys[i])
  const a = await getVertexCoverForAdjacencyMatrixInternal(matrix, k, progressCallback, cancellationToken, keys, newCover, i + 1, count + 1)
  if (a !== null) {
    return a
  }
  let adjustedCount = Math.floor((totalCombinations - count) / 2)
  const b = await getVertexCoverForAdjacencyMatrixInternal(matrix, k, progressCallback, cancellationToken, keys, cover, i + 1, count + adjustedCount)
  if (b !== null) {
    return b
  }

  return null
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
  cancellationToken?: CancellationToken
) => {
  return getVertexCoverForAdjacencyMatrixInternal(matrix, k, progressCallback, cancellationToken)
}
