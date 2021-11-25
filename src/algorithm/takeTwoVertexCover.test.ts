import takeTwoVertexCover from './takeTwoVertexCover'
import AdjacencyMatrix, { Edge } from './AdjacencyMatrix'

describe('takeTwoVertexCover', () => {
  it('returns an empty cover for an empty matrix', () => {
    const matrix = new AdjacencyMatrix({})

    const cover = takeTwoVertexCover(matrix)

    expect(cover).toEqual(new Set())
  })

  it('returns an empty cover for a single vertex', () => {
    const matrix = AdjacencyMatrix.fromVerticesAndEdges(
      ['a'],
      []
    )

    const cover = takeTwoVertexCover(matrix)

    expect(cover).toEqual(new Set())
  })

  it('returns an empty cover for two disconnected vertices', () => {
    const matrix = AdjacencyMatrix.fromVerticesAndEdges(
      ['a', 'b'],
      []
    )

    const cover = takeTwoVertexCover(matrix)

    expect(cover).toEqual(new Set())
  })

  it('returns the correct cover for two connected vertices', () => {
    const matrix = AdjacencyMatrix.fromVerticesAndEdges(
      ['a', 'b'],
      [new Edge('a', 'b')]
    )

    const cover = takeTwoVertexCover(matrix)

    expect(cover).toEqual(new Set(['a', 'b']))
  })

  it('returns the correct cover for two disconnected graphs with two vertices', () => {
    const matrix = AdjacencyMatrix.fromVerticesAndEdges(
      ['a', 'b', 'c', 'd'],
      [new Edge('a', 'b'), new Edge('c', 'd')]
    )

    const cover = takeTwoVertexCover(matrix)

    expect(cover).toEqual(new Set(['a', 'b', 'c', 'd']))
  })

  it('returns the correct cover for a 5 vertex clique', () => {
    // 5 vertices that are all connected
    const matrix = new AdjacencyMatrix({"0": {"0": false,"1": true,"2": true,"3": true,"4": true},"1": {"0": true,"1": false,"2": true,"3": true,"4": true},"2": {"0": true,"1": true,"2": false,"3": true,"4": true},"3": {"0": true,"1": true,"2": true,"3": false,"4": true},"4": {"0": true,"1": true,"2": true,"3": true,"4": false}})

    const cover = takeTwoVertexCover(matrix)

    expect(cover.size).toBeGreaterThanOrEqual(3)
    expect(cover.size).toBeLessThanOrEqual(4)
  })
})
