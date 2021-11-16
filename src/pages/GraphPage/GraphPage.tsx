import { TabContext, TabList } from '@mui/lab'
import { Box, Container, Grid, Grow, Paper, Tab, Typography } from '@mui/material'
import _ from 'lodash'
import { FunctionComponent, useEffect, useState } from 'react'
import SwipeableViews, { SwipeableViewsHooks } from 'react-swipeable-views'
import { AdjacencyMatrix } from '../../algorithm'
import { XButton } from '../../components'
import { useCancellingCallback } from '../../hooks'
import { connectSubgraphsAsync } from '../../workers'
import AdjacencyMatrixDisplay from './AdjacencyMatrixDisplay'
import GraphDisplay from './GraphDisplay'
import InputForm from './InputForm'
import Kernelization from './Kernelization'
import VertexCover from './VertexCover'

const tabValues = ['matrix', 'graph', 'cover', 'kernelization']
const GraphPage: FunctionComponent = () => {
  const [tab, setTab] = useState('matrix')
  const [svHooks, setSvHooks] = useState<SwipeableViewsHooks>({ updateHeight: () => { } })
  const [adjacencyMatrix, setAdjacencyMatrix] = useState<AdjacencyMatrix | null>(null)
  const [connecting, setConnecting] = useState(false)

  useEffect(() => {
    svHooks.updateHeight()
  }, [adjacencyMatrix, svHooks])

  const handleConnectSubgraphs = useCancellingCallback((token) => {
    if (adjacencyMatrix) {
      setConnecting(true)
      connectSubgraphsAsync(adjacencyMatrix, token)
        .then(setAdjacencyMatrix)
        .catch(console.debug)
        .finally(() => setConnecting(false))
    }
  }, [adjacencyMatrix])

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      <Typography variant="h2" gutterBottom>Graph Generator</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <InputForm setAdjacencyMatrix={setAdjacencyMatrix} />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Grow in={!!adjacencyMatrix}>
            <Paper>
              <TabContext value={tab}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <TabList onChange={(_, v) => setTab(v)}>
                    <Tab label="Adjacency Matrix" value='matrix' />
                    <Tab label="Graph" value='graph' />
                    <Tab label="Vertex Cover" value='cover' />
                    <Tab label="Kernelization" value='kernelization' />
                    <Box sx={{ flexGrow: 1 }} />
                    {adjacencyMatrix && (
                      <Box sx={{ display: 'flex', alignItems: 'center', pr: 3 }}>
                        <XButton 
                          color="secondary" 
                          onClick={handleConnectSubgraphs} 
                          processing={connecting}
                        >
                          Make connected
                        </XButton>
                      </Box>
                    )}
                  </TabList>
                </Box>
                <SwipeableViews
                  action={setSvHooks}
                  index={_.indexOf(tabValues, tab)}
                  animateHeight
                  disableLazyLoading
                  disabled
                >
                  <Box sx={{ p: 0 }}>
                    {adjacencyMatrix && (
                      <AdjacencyMatrixDisplay 
                        adjacencyMatrix={adjacencyMatrix} 
                        setAdjacencyMatrix={setAdjacencyMatrix}
                      />
                    )}
                  </Box>
                  <Box sx={{ p: 3 }}>
                    {adjacencyMatrix && (
                      <GraphDisplay adjacencyMatrix={adjacencyMatrix} />
                    )}
                  </Box>
                  <Box sx={{ p: 0 }}>
                    {adjacencyMatrix && (
                      <VertexCover adjacencyMatrix={adjacencyMatrix} updateLayout={svHooks.updateHeight} />
                    )}
                  </Box>
                  <Box sx={{ p: 0 }}>
                    {adjacencyMatrix && (
                      <Kernelization adjacencyMatrix={adjacencyMatrix} updateLayout={svHooks.updateHeight} />
                    )}
                  </Box>
                </SwipeableViews>
              </TabContext>
            </Paper>
          </Grow>
        </Grid>
      </Grid>
    </Container>
  )
}
export default GraphPage
