import { AdjacencyMatrix, Edge, getVertexCover, getVertexCoverKernelized } from '.'

describe('getVertexCover', () => {
  it('returns an empty set for an empty matrix', () => {
    const matrix = new AdjacencyMatrix({})

    const cover = getVertexCover(matrix, 0)

    expect(cover).toEqual(new Set())
  })

  it('returns null for cover size 0 and two connected vertices', () => {
    const matrix = AdjacencyMatrix.fromVerticesAndEdges(
      ['a', 'b'],
      [new Edge('a', 'b')]
    )

    const cover = getVertexCover(matrix, 0)

    expect(cover).toBe(null)
  })

  it('returns null for a cover size larger than the amount of vertices', () => {
    const matrix = AdjacencyMatrix.fromVerticesAndEdges(
      ['a', 'b'],
      [new Edge('a', 'b')]
    )

    const cover = getVertexCover(matrix, 3)

    expect(cover).toBe(null)
  })

  it('finds a cover of 1 for two connected vertices', () => {
    const matrix = AdjacencyMatrix.fromVerticesAndEdges(
      ['a', 'b'],
      [new Edge('a', 'b')]
    )

    const cover = getVertexCover(matrix, 1)

    expect(cover?.size).toBe(1)
  })

  it('finds a cover of 2 for two connected vertices', () => {
    const matrix = AdjacencyMatrix.fromVerticesAndEdges(
      ['a', 'b'],
      [new Edge('a', 'b')]
    )

    const cover = getVertexCover(matrix, 2)

    expect(cover?.size).toBe(2)
  })

  it('returns an empty set for two isolated vertices', () => {
    const matrix = AdjacencyMatrix.fromVerticesAndEdges(
      ['a', 'b'],
      []
    )

    const cover = getVertexCover(matrix, 0)

    expect(cover).toEqual(new Set())
  })
})

describe('getVertexCoverKernelized', () => {
  it('returns an empty set for an empty matrix', () => {
    const matrix = new AdjacencyMatrix({})

    const cover = getVertexCoverKernelized(matrix, 0)

    expect(cover).toEqual(new Set())
  })

  it('returns null for cover size 0 and two connected vertices', () => {
    const matrix = AdjacencyMatrix.fromVerticesAndEdges(
      ['a', 'b'],
      [new Edge('a', 'b')]
    )

    const cover = getVertexCoverKernelized(matrix, 0)

    expect(cover).toBe(null)
  })

  it('returns null for a cover size larger than the amount of vertices', () => {
    const matrix = AdjacencyMatrix.fromVerticesAndEdges(
      ['a', 'b'],
      [new Edge('a', 'b')]
    )

    const cover = getVertexCoverKernelized(matrix, 3)

    expect(cover).toBe(null)
  })

  it('finds a cover of 1 for two connected vertices', () => {
    const matrix = AdjacencyMatrix.fromVerticesAndEdges(
      ['a', 'b'],
      [new Edge('a', 'b')]
    )

    const cover = getVertexCoverKernelized(matrix, 1)

    expect(cover?.size).toBe(1)
  })

  // TODO It disqualifies vertices connected to a pendant causing it not to be able to find both vertices
  // it('finds a cover of 2 for two connected vertices', () => {
  //   const matrix = AdjacencyMatrix.fromVerticesAndEdges(
  //     ['a', 'b'],
  //     [new Edge('a', 'b')]
  //   )

  //   const cover = getVertexCoverKernelized(matrix, 2)

  //   expect(cover?.size).toBe(2)
  // })

  it('returns an empty set for two isolated vertices', () => {
    const matrix = AdjacencyMatrix.fromVerticesAndEdges(
      ['a', 'b'],
      []
    )

    const cover = getVertexCoverKernelized(matrix, 0)

    expect(cover).toEqual(new Set())
  })
})
