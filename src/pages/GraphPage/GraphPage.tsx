import { TabContext, TabList } from '@mui/lab'
import { Box, Button, Container, Grid, Paper, Tab, Typography } from '@mui/material'
import _ from 'lodash'
import { FunctionComponent, useEffect, useState } from 'react'
import SwipeableViews, { SwipeableViewsHooks } from 'react-swipeable-views'
import { AdjacencyMatrix, Graph } from '../../algorithm'
import AdjacencyMatrixDisplay from './AdjacencyMatrixDisplay'
import GraphDisplay from './GraphDisplay'
import InputForm from './InputForm'



const tabValues = ['matrix', 'graph']
const GraphPage: FunctionComponent = () => {
  const [tab, setTab] = useState('matrix')
  const [svHooks, setSvHooks] = useState<SwipeableViewsHooks>({ updateHeight: () => { } })
  const [adjacencyMatrix, setAdjacencyMatrix] = useState<AdjacencyMatrix | null>(null)

  useEffect(() => {
    svHooks.updateHeight()
  }, [adjacencyMatrix, svHooks])

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
          <Paper>
            <TabContext value={tab}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={(_, v) => setTab(v)}>
                  <Tab label="Adjacency Matrix" value='matrix' />
                  <Tab label="Graph" value='graph' />
                  <Box sx={{ flexGrow: 1 }} />
                  {adjacencyMatrix && (
                    <Box sx={{ display: 'flex', alignItems: 'center', pr: 3 }}>
                      <Button color="secondary" onClick={() => {
                        // TODO: Fix this lol
                        const graph = new Graph(adjacencyMatrix)
                        graph.connectDisconnectedGraphs()
                        setAdjacencyMatrix(graph.toAdjacencyMatrix())
                      }}>Make connected</Button>
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
                <Paper sx={{ p: 0 }}>
                  {adjacencyMatrix && (
                    <AdjacencyMatrixDisplay adjacencyMatrix={adjacencyMatrix} />
                  )}
                </Paper>
                <Paper sx={{ height: 500, p: 3 }}>
                  {adjacencyMatrix && (
                    <GraphDisplay adjacencyMatrix={adjacencyMatrix} />
                  )}
                </Paper>
              </SwipeableViews>
            </TabContext>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}
export default GraphPage
