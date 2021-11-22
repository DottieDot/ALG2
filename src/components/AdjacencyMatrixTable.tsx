import { Box, Checkbox, styled, Typography, useTheme } from '@mui/material'
import { SxProps } from '@mui/system'
import _ from 'lodash'
import { ChangeEvent, createContext, FunctionComponent, memo, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { GridCellProps, MultiGrid } from 'react-virtualized'
import AutoSizer from 'react-virtualized-auto-sizer'
import { AdjacencyMatrix } from '../algorithm'

interface MatrixContext {
  hover          : { col: number, row: number } | null
  setHover       : (hover: { col: number, row: number }) => void
  adjacencyMatrix: AdjacencyMatrix
  keys           : string[]
  onChange       : (newMatrix: AdjacencyMatrix) => void
}

const matrixContext = createContext<MatrixContext>({
  hover          : null,
  setHover       : () => {},
  adjacencyMatrix: {},
  keys           : [],
  onChange       : () => {}
})

const Header = styled(Typography)(({ theme }) => ({
  borderRadius: 0,
  backgroundColor: theme.palette.background.paper,
  textAlign: 'center',
  lineHeight: '48px',
  '&.hover': {
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText
  },
  transition: 'all linear 100ms'
}))

const RowHeader = styled(Header)(({ theme }) => ({
  borderRight: `1px solid ${theme.palette.divider}`
}))

const ColumnHeader = styled(Header)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`
}))

export interface AdjacencyMatrixTableProps {
  adjacencyMatrix: AdjacencyMatrix,
  sx?: SxProps,
  onChange: (newMatrix: AdjacencyMatrix) => void
}

const MatrixCell: FunctionComponent<GridCellProps> = ({ key, style, rowIndex, columnIndex }) => {
  const { hover, setHover, adjacencyMatrix, keys, onChange } = useContext(matrixContext)

  const onHover = useCallback(() => {
    setHover({ col: columnIndex, row: rowIndex })
  }, [setHover, columnIndex, rowIndex])

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const copy = _.cloneDeep(adjacencyMatrix)
    copy[keys[rowIndex    - 1]][keys[columnIndex - 1]] = e.target.checked
    copy[keys[columnIndex - 1]][keys[rowIndex    - 1]] = e.target.checked
    onChange(copy)
  }, [adjacencyMatrix, keys, rowIndex, columnIndex, onChange])

  if (rowIndex === 0 && columnIndex === 0) {
    return <Header style={style} key={key} />
  }
  
  if (columnIndex === 0) {
    const hovered = rowIndex === hover?.row
    return (
      <RowHeader className={hovered ? 'hover' : ''} style={style} key={key}>
        {keys[Math.max(rowIndex, columnIndex) - 1]}
      </RowHeader>
    )
  }

  if (rowIndex === 0) {
    const hovered = columnIndex === hover?.col
    return (
      <ColumnHeader className={hovered ? 'hover' : ''} style={style} key={key}>
        {keys[Math.max(rowIndex, columnIndex) - 1]}
      </ColumnHeader>
    )
  }

  if (rowIndex === columnIndex) {
    return <div key={key} style={style} onMouseEnter={onHover}></div>
  }

  return (
    <Checkbox
      onMouseEnter={onHover}
      style={style}
      key={key}
      checked={adjacencyMatrix[keys[rowIndex - 1]][keys[columnIndex - 1]]}
      onChange={handleChange}
      disableRipple
    />
  )
}

const AdjacencyMatrixTable: FunctionComponent<AdjacencyMatrixTableProps> = ({ adjacencyMatrix, sx, onChange }) => {
  const theme = useTheme()
  const [hover, setHover] = useState<{ col: number, row: number }|null>(null)
  const keys = useMemo(() => Object.keys(adjacencyMatrix), [adjacencyMatrix])
  const gridRef = useRef<MultiGrid>(null)

  return (
    <matrixContext.Provider
      value={{ hover, setHover, adjacencyMatrix, keys, onChange }}
    >
      <Box 
        sx={{
          height: (keys.length + 1) * 48,
          ...sx
        }}
      >
        <AutoSizer>
          {({ width, height }) => (
            <MultiGrid
              ref={gridRef}
              cellRenderer={(props) => <MatrixCell {...props} />}
              columnWidth={48}
              rowHeight={48}
              height={height}
              width={width}
              rowCount={keys.length + 1}
              columnCount={keys.length + 1}
              fixedColumnCount={1}
              fixedRowCount={1}
              enableFixedRowScroll={false}
              enableFixedColumnScroll={false}
              styleTopRightGrid={{
                background: theme.palette.background.paper,
                borderBottom: `1px solid ${theme.palette.divider}`
              }}
            />
          )}
        </AutoSizer>
      </Box>
    </matrixContext.Provider>
  )
}
export default memo(AdjacencyMatrixTable)
