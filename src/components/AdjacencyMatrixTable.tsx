import { Box, Checkbox, styled, Typography, useTheme } from '@mui/material'
import { SxProps } from '@mui/system'
import { FunctionComponent, memo, useEffect, useMemo, useRef, useState } from 'react'
import { GridCellProps, MultiGrid } from 'react-virtualized'
import AutoSizer from 'react-virtualized-auto-sizer'
import { AdjacencyMatrix } from '../algorithm'

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

// Please don't look too much at this code :/
const AdjacencyMatrixTable: FunctionComponent<AdjacencyMatrixTableProps> = ({ adjacencyMatrix, sx, onChange }) => {
  const theme = useTheme()
  const [hover, setHover] = useState<number[]>([])
  const keys = useMemo(() => Object.keys(adjacencyMatrix), [adjacencyMatrix])
  const gridRef = useRef<MultiGrid>(null)

  useEffect(() => {
    gridRef.current?.forceUpdateGrids()
  }, [hover, adjacencyMatrix, gridRef])

  const cellRender = ({ key, style, rowIndex, columnIndex }: GridCellProps) => {
    const onHover = () => setHover([columnIndex, rowIndex])

    if (rowIndex === 0 && columnIndex === 0) {
      return <Header style={style} key={key} />
    }
    
    if (columnIndex === 0) {
      const hovered = rowIndex === hover[1]
      return (
        <RowHeader className={hovered ? 'hover' : ''} style={style} key={key}>
          {keys[Math.max(rowIndex, columnIndex) - 1]}
        </RowHeader>
      )
    }

    if (rowIndex === 0) {
      const hovered = columnIndex === hover[0]
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
        onChange={(e) => {
          const copy = { ...adjacencyMatrix }
          copy[keys[rowIndex    - 1]][keys[columnIndex - 1]] = e.target.checked
          copy[keys[columnIndex - 1]][keys[rowIndex    - 1]] = e.target.checked
          onChange(copy)
        }}
        disableRipple
      />
    )
  }

  return (
    <Box sx={{
      height: (keys.length + 1) * 48,
      ...sx
    }}>
      <AutoSizer>
        {({ width, height }) => (
          <MultiGrid
            ref={gridRef}
            cellRenderer={cellRender}
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
  )
}
export default memo(AdjacencyMatrixTable)
