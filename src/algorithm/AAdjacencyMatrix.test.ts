import { AdjacencyMatrix, Edge } from '.'

// *The extra A in the file name is intentional, jest wouldn't work without it

describe('AdjacencyMatrix', () => {
  describe('generateRandom', () => {
    it('generates no edges for probability 0', () => {
      const matrix = AdjacencyMatrix.generateRandom(10, 0)

      expect(matrix.edges.length).toBe(0)
    })

    it('generates all edges for probability 1', () => {
      const matrix = AdjacencyMatrix.generateRandom(10, 1)

      expect(matrix.edges.length).toBe(45)
    })

    it('generates the correct amount of vertices', () => {
      const matrix = AdjacencyMatrix.generateRandom(10, 0)

      expect(matrix.vertices.length).toBe(10)
    })

    it('returns an empty matrix for 0 vertices', () => {
      const matrix = AdjacencyMatrix.generateRandom(0, 0)

      expect(matrix.vertices.length).toBe(0)
    })
  })

  describe('makeConnected', () => {
    it('connects two isolated vertices', () => {
      const matrix = AdjacencyMatrix.fromVerticesAndEdges(
        ['a', 'b'],
        []
      )

      matrix.makeConnected()

      expect(matrix.hasEdge(new Edge('a', 'b'))).toBe(true)
    })

    it(`keeps already connected vertices`, () => {
      const matrix = AdjacencyMatrix.fromVerticesAndEdges(
        ['a', 'b'],
        [new Edge('a', 'b')]
      )

      matrix.makeConnected()

      expect(matrix.hasEdge(new Edge('a', 'b'))).toBe(true)
    })
    it(`doesn't connect a single vertex with itself`, () => {
      const matrix = AdjacencyMatrix.fromVerticesAndEdges(
        ['a'],
        []
      )

      matrix.makeConnected()

      expect(matrix.hasEdge(new Edge('a', 'a'))).toBe(false)
    })

    it('keeps an empty matrix', () => {
      const matrix = new AdjacencyMatrix({})

      matrix.makeConnected()

      expect(matrix.vertices.length).toEqual(0)
    })

    it('connects two isolated sub-graphs', () => {
      const matrix = AdjacencyMatrix.fromVerticesAndEdges(
        ['a', 'b', 'c', 'd'],
        [new Edge('a', 'b'), new Edge('c', 'd')]
      )

      matrix.makeConnected()

      expect(matrix.hasEdge(new Edge('a', 'c'))).toBe(true)
    })
  })
})
