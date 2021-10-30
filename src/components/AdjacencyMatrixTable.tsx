import { Clear as CrossIcon } from '@mui/icons-material'
import { alpha, styled } from '@mui/material'
import { SxProps } from '@mui/system'
import { FunctionComponent, memo, useMemo, useState } from 'react'
import { AdjacencyMatrix } from '../algorithm'

const Table = styled('table')(({ theme }) => ({
  borderSpacing: 0,
  '& tbody tr:nth-child(even)': {
    background: alpha(theme.palette.getContrastText(theme.palette.background.paper), .05)
  },
  '& td': {
    textAlign: 'center'
  }
}))

// (props: PaperProps<'th'>) => <Paper {...props} component="th" />
const TableHeader = styled('th')(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: 0,
  position: 'sticky',
  backgroundColor: theme.palette.background.paper,
  'tbody > tr:hover > &, &.hover': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText
  },
  'thead > tr > &:first-of-type': {
    position: 'sticky',
    zIndex: 2,
    top: 0,
    left: 0
  },
  'thead > tr > &:not(:first-of-type)': {
    borderBottom: `1px solid ${theme.palette.divider}`,
    zIndex: 1,
    top: 0
  },
  'tbody > tr > &': {
    borderRight: `1px solid ${theme.palette.divider}`,
    left: 0,
  }
}))

export interface AdjacencyMatrixTableProps {
  adjacencyMatrix: AdjacencyMatrix,
  sx?: SxProps
}

const AdjacencyMatrixTable: FunctionComponent<AdjacencyMatrixTableProps> = ({ adjacencyMatrix, sx }) => {
  const [hoveredColumn, setHoveredColumn] = useState<string | null>(null)
  const keys = useMemo(() => Object.keys(adjacencyMatrix), [adjacencyMatrix])

  return (
    <Table cellSpacing={0} sx={sx}>
      <thead>
        <tr>
          <TableHeader>{' '}</TableHeader>
          {keys.map(key => (
            <TableHeader
              className={key === hoveredColumn ? 'hover' : ''}
              key={key}
            >
              {key}
            </TableHeader>
          ))}
          <TableHeader sx={{ width: '100%' }}>{' '}</TableHeader>
        </tr>
      </thead>
      <tbody onMouseLeave={() => setHoveredColumn(null)}>
        {keys.map(row => (
          <tr key={row}>
            <TableHeader>{row}</TableHeader>
            {keys.map(column => (
              <td key={column} onMouseEnter={() => setHoveredColumn(column)}>
                {adjacencyMatrix[row][column] && <CrossIcon />}
              </td>
            ))}
            <td style={{ width: '100%' }} />
          </tr>
        ))}
      </tbody>
    </Table>
  )
}
export default memo(AdjacencyMatrixTable)
