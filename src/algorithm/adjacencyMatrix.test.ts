import {  } from '.'

// const countEdges = (matrix: AdjacencyMatrix) => {
//   const keys = Object.keys(matrix)
//   let   result = 0

//   for (let i = 0; i < keys.length; ++i) {
//     for (let j = 0; j < i; ++j) {
//       result += +(matrix[keys[i]][keys[j]])
//     }
//   }

//   return result
// }

// describe('connectAdjacencyMatrix', () => {
//   it('connects two isolated vertices', () => {
//     const matrix: AdjacencyMatrix = {
//       'a': { 'a': false, 'b': false },
//       'b': { 'a': false, 'b': false }
//     }

//     const connectedMatrix = connectAdjacencyMatrix(matrix)

//     expect(connectedMatrix).toEqual({
//       'a': { 'a': false, 'b': true },
//       'b': { 'a': true , 'b': false }
//     })
//   })

//   it(`keeps already connected vertices`, () => {
//     const matrix: AdjacencyMatrix = {
//       'a': { 'a': false, 'b': true },
//       'b': { 'a': true , 'b': false}
//     }

//     const connectedMatrix = connectAdjacencyMatrix(matrix)

//     expect(connectedMatrix).toEqual({
//       'a': { 'a': false, 'b': true },
//       'b': { 'a': true , 'b': false }
//     })
//   })

//   it(`doesn't connect a single vertex with itself`, () => {
//     const matrix: AdjacencyMatrix = {
//       'a': { 'a': false }
//     }

//     const connectedMatrix = connectAdjacencyMatrix(matrix)

//     expect(connectedMatrix).toEqual({
//       'a': { 'a': false }
//     })
//   })

//   it('returns an empty matrix with an empty input', () => {
//     const matrix: AdjacencyMatrix = {}

//     const connectedMatrix = connectAdjacencyMatrix(matrix)

//     expect(connectedMatrix).toEqual({})
//   })

//   it('connects two isolated sub-graphs', () => {
//     const matrix: AdjacencyMatrix = {
//       'a': { 'a': false, 'b': true , 'c': false, 'd': false },
//       'b': { 'a': true , 'b': false, 'c': false, 'd': false },
//       'c': { 'a': false, 'b': false, 'c': false, 'd': true  },
//       'd': { 'a': false, 'b': false, 'c': true , 'd': false }
//     }

//     const connectedMatrix = connectAdjacencyMatrix(matrix)

//     expect(connectedMatrix).toEqual({
//       'a': { 'a': false, 'b': true , 'c': true , 'd': false },
//       'b': { 'a': true , 'b': false, 'c': false, 'd': false },
//       'c': { 'a': true , 'b': false, 'c': false, 'd': true  },
//       'd': { 'a': false, 'b': false, 'c': true , 'd': false }
//     })
//   })
// })

// describe('generateAdjacencyMatrix', () => {
//   it('generates the correct amount of vertices', () => {
//     const matrix = generateAdjacencyMatrix(10, 0)

//     expect(Object.keys(matrix).length).toBe(10)
//   })

//   it('generates the correct amount of edges', () => {
//     const matrix = generateAdjacencyMatrix(10, 1)

//     const expectedEdges = 10 * 9 / 2

//     expect(countEdges(matrix)).toBe(expectedEdges)
//   })
// })

// describe('getVertexCoverForAdjacencyMatrix', () => {
//   it('finds the cover', async () => {
//     const matrix: AdjacencyMatrix = {
//       'a': { 'a': false, 'b': true , 'c': false, 'd': false },
//       'b': { 'a': true , 'b': false, 'c': false, 'd': false },
//       'c': { 'a': false, 'b': false, 'c': false, 'd': true  },
//       'd': { 'a': false, 'b': false, 'c': true , 'd': false }
//     }

//     const cover = getVertexCoverForAdjacencyMatrix(matrix, 2)

//     expect(cover).toEqual(new Set(['a','c']))
//   })

//   it('finds the cover with the correct amount of vertices', async () => {
//     const matrix: AdjacencyMatrix = {
//       'a': { 'a': false, 'b': true , 'c': false, 'd': false },
//       'b': { 'a': true , 'b': false, 'c': false, 'd': false },
//       'c': { 'a': false, 'b': false, 'c': false, 'd': true  },
//       'd': { 'a': false, 'b': false, 'c': true , 'd': false }
//     }

//     const cover = getVertexCoverForAdjacencyMatrix(matrix, 3)

//     expect(cover).toEqual(new Set(['a', 'b', 'c']))
//   })

//   it('returns null if no cover is possible', async () => {
//     const matrix: AdjacencyMatrix = {
//       'a': { 'a': false, 'b': true , 'c': false, 'd': false },
//       'b': { 'a': true , 'b': false, 'c': false, 'd': false },
//       'c': { 'a': false, 'b': false, 'c': false, 'd': true  },
//       'd': { 'a': false, 'b': false, 'c': true , 'd': false }
//     }

//     const cover = getVertexCoverForAdjacencyMatrix(matrix, 1)

//     expect(cover).toBe(null)
//   })

//   it('returns null if too many vertices are requested', async () => {
//     const matrix: AdjacencyMatrix = {
//       'a': { 'a': false, 'b': true , 'c': false, 'd': false },
//       'b': { 'a': true , 'b': false, 'c': false, 'd': false },
//       'c': { 'a': false, 'b': false, 'c': false, 'd': true  },
//       'd': { 'a': false, 'b': false, 'c': true , 'd': false }
//     }

//     const cover = getVertexCoverForAdjacencyMatrix(matrix, 5)

//     expect(cover).toBe(null)
//   })
// })
