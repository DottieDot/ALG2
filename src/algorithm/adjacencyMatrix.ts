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

const getHighlightColor = (degree: number, topDegree: number, theme: Theme): string => {
  if (degree === 0) {
    return theme.palette.error.main
  }
  if (degree === 1) {
    return theme.palette.success.main
  }
  if (degree >= topDegree) {
    return theme.palette.primary.dark
  }

  return 'transparent'
}

export const highlightedDotStringFromAdjacencyMatrix = (matrix: AdjacencyMatrix, tops: number, theme: Theme): string => {
  const keys = Object.keys(matrix)
  const degrees = getAdjacencyMatrixDegreeMap(matrix)
  const topDegree = tops

  let result = 'graph {'

  result += keys.map((row, index) => {
    const highlight = getHighlightColor(degrees[row], topDegree, theme)
    return `"${row}"[style=filled,fillcolor="${highlight}"];` + keys
      .filter((col, i) => (i > index) && matrix[row][col])
      .map(col => `"${row}" -- "${col}"`)
      .join(';')
  }).join('')

  result += '}'

  return result
}

export type DegreeArray = Array<{ vertex: string, degrees: number }>

/**
 * Gets the degree of every vertex
 * @param matrix 
 * @returns 
 */
export const getAdjacencyMatrixDegrees = (matrix: AdjacencyMatrix): DegreeArray => {
  return _.reduce<AdjacencyMatrix, DegreeArray>(matrix, (accumulator, connections, vertex) => {
    accumulator.push({
      vertex: vertex,
      degrees: _.reduce(connections, (count, isConnected) => {
        return count + (+isConnected)
      }, 0)
    })
    return accumulator
  }, [])
}

export type DegreeMap = { [vertex: string]: number }

/**
 * Gets the degree of every vertex
 * @param matrix 
 * @returns 
 */
export const getAdjacencyMatrixDegreeMap = (matrix: AdjacencyMatrix): DegreeMap => {
  return _.reduce<AdjacencyMatrix, DegreeMap>(matrix, (accumulator, connections, vertex) => {
    accumulator[vertex] = _.reduce(connections, (count, isConnected) => {
      return count + (+isConnected)
    }, 0)
    return accumulator
  }, {})
}

/**
 * Adds a pendant to an adjacency vertex
 * @param matrix 
 * @returns null if no pendant could be added
 */
export const addPendantToAdjacencyMatrix = (matrix: AdjacencyMatrix, topsDegree: number): AdjacencyMatrix | null => {
  const result = _.cloneDeep(matrix)
  const degrees = getAdjacencyMatrixDegrees(matrix)
    .sort(({ degrees: a }, { degrees: b }) => a - b)

  const candidate = degrees.find(({ degrees }) => (degrees > 1) && (degrees < topsDegree))
  if (!candidate) {
    return null
  }

  let edgesRemaining = candidate.degrees
  for (const neighbor in result[candidate.vertex]) {
    if (result[candidate.vertex][neighbor]) {
      edgesRemaining -= 1
      result[candidate.vertex][neighbor] = false
      result[neighbor][candidate.vertex] = false

      if (edgesRemaining === 1) {
        break
      }
    }
  }

  return result
}

/**
 * Removes a pendant from the adjacency matrix and restores it if possible
 * @param matrix 
 * @param original 
 * @returns null if no pendant could be removed
 */
export const removePendantFromAdjacencyMatrix = (matrix: AdjacencyMatrix, original: AdjacencyMatrix): AdjacencyMatrix | null => {
  const result = _.cloneDeep(matrix)
  const degrees = getAdjacencyMatrixDegrees(matrix)
  const origDegrees = getAdjacencyMatrixDegrees(original)

  const candidate = degrees.find(({ degrees: deg }, index) => (deg === 1) && (origDegrees[index].degrees !== deg))
  if (!candidate) {
    const pendant = degrees.find(({ degrees: deg }) => deg === 1)
    if (!pendant) {
      return null
    }

    for (const neighbor in matrix[pendant.vertex]) {
      if (!result[pendant.vertex][neighbor] && pendant.vertex !== neighbor) {
        result[pendant.vertex][neighbor] = true
        result[neighbor][pendant.vertex] = true
        break
      }
    }
    return result
  }

  for (const neighbor in matrix[candidate.vertex]) {
    result[candidate.vertex][neighbor] = original[candidate.vertex][neighbor]
    result[neighbor][candidate.vertex] = original[neighbor][candidate.vertex]
  }

  return result
}

export const addTopToAdjacencyMatrix = (matrix: AdjacencyMatrix, topsDegree: number): AdjacencyMatrix | null => {
  const result = _.cloneDeep(matrix)
  const degrees = getAdjacencyMatrixDegrees(matrix)
    .sort(({ degrees: a }, { degrees: b }) => b - a)

  if (degrees.length < topsDegree) {
    return null
  }

  const candidate = degrees.find(({ degrees: deg }, index) => deg < topsDegree)
  if (!candidate) { 
    return null
  }

  let currentDegree = candidate.degrees
  for (const neighbor in matrix[candidate.vertex]) {
    if (!result[candidate.vertex][neighbor] && candidate.vertex !== neighbor) {
      result[candidate.vertex][neighbor] = true
      result[neighbor][candidate.vertex] = true

      ++currentDegree
    }
    
    if (currentDegree === topsDegree) {
      break
    }
  }

  return result
}

export const removeTopFromAdjacency = (matrix: AdjacencyMatrix, original: AdjacencyMatrix, topsDegree: number): AdjacencyMatrix | null => {
  const result = _.cloneDeep(matrix)
  const degrees = getAdjacencyMatrixDegrees(matrix)
  const origDegrees = getAdjacencyMatrixDegrees(original)

  const candidate = degrees.find(({ degrees: deg }, index) => (deg >= topsDegree) && (origDegrees[index].degrees !== deg))
  if (!candidate) {
    const pendant = degrees.find(({ degrees: deg }) => deg >= topsDegree)
    if (!pendant) {
      return null
    }

    for (const neighbor in matrix[pendant.vertex]) {
      if (!result[pendant.vertex][neighbor] && pendant.vertex !== neighbor) {
        result[pendant.vertex][neighbor] = false
        result[neighbor][pendant.vertex] = false
      }
    }
    return result
  }

  for (const neighbor in matrix[candidate.vertex]) {
    result[candidate.vertex][neighbor] = original[candidate.vertex][neighbor]
    result[neighbor][candidate.vertex] = original[neighbor][candidate.vertex]
  }

  return result
}

const getPendantNeighbor = (matrix: AdjacencyMatrix, pendant: string): string | null => {
  return _.findKey(matrix[pendant], (connected) => connected) ?? null
}

const getUncoveredDegree = (matrix: AdjacencyMatrix, vertex: string, cover: Set<string>): number => {
  if (cover.has(vertex)) {
    return 0
  }

  return _.reduce(matrix[vertex], (accumulator, connected, connection) => {
    return accumulator + ((connected && !cover.has(connection)) ? 1 : 0)
  }, 0)
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

export const getVertexCoverForAdjacencyMatrixOptimized = (  
  matrix            : AdjacencyMatrix, 
  k                 : number, 
  progressCallback ?: (p: number) => void, 
): Set<string> | null => {
  const keys = new Set<string>(Object.keys(matrix))
  const cover = new Set<string>()

  const degrees = getAdjacencyMatrixDegrees(matrix)
    .sort(({ degrees: a }, { degrees: b }) => a - b)

  let topsDegree = k
  for (const { degrees: deg, vertex } of degrees) {
    if (deg === 0) {
      keys.delete(vertex)
    }
    else if (deg === 1 && !cover.has(vertex)) {
      const neighbor = getPendantNeighbor(matrix, vertex)!
      cover.add(neighbor)
      keys.delete(neighbor)
      keys.delete(vertex)

      --topsDegree
    }
    else if (deg >= topsDegree && getUncoveredDegree(matrix, vertex, cover) >= topsDegree) {
      cover.add(vertex)
      keys.delete(vertex)
      --topsDegree
    }
  }

  return getVertexCoverForAdjacencyMatrixInternal(matrix, k, progressCallback, [...keys], cover, cover.size, undefined, combinations(keys.size, k - cover.size))[0]
}
