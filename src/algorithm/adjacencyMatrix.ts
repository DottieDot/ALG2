
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
