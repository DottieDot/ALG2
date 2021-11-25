import { Theme } from '@mui/material'
import AdjacencyMatrix from './AdjacencyMatrix'

/**
 * Creates a dot string for an adjacency matrix
 * @param matrix 
 * @returns 
 */
export const getDotStringForAdjacencyMatrix = (matrix: AdjacencyMatrix): string => {
  return matrix.generateDotString()
}

/**
 * Creates a dot string for an adjacency matrix with a vertex cover
 * @param matrix 
 * @param cover 
 * @param theme 
 * @returns 
 */
export const getDotStringForAdjacencyMatrixWithCover = (matrix: AdjacencyMatrix, cover: Set<string>, theme: Theme): string => {
  return matrix.generateDotString((vertex) => (
    cover.has(vertex) 
      ? ['style=filled'
        ,`fillcolor="${theme.palette.primary.dark}"`]
      : undefined
  ))
}

const getHighlightColor = (degree: number, topDegree: number, theme: Theme): string | null => {
  if (degree === 0) {
    return theme.palette.error.main
  }
  if (degree === 1) {
    return theme.palette.success.main
  }
  if (degree >= topDegree) {
    return theme.palette.primary.dark
  }

  return null
}

/**
 * Creates a dot string for an adjacency matrix with highlighting
 * @param matrix 
 * @param tops 
 * @param theme 
 * @returns 
 */
export const getDotStringForAdjacencyMatrixWithHighlighting = (matrix: AdjacencyMatrix, tops: number, theme: Theme): string => {
  const degrees = matrix.degreesMap
  return matrix.generateDotString((vertex) => {
    let color = getHighlightColor(degrees[vertex], tops, theme)

    return (
      color
        ? ['style=filled'
          ,`fillcolor="${color}"`]
        : undefined
    )
  })
}
