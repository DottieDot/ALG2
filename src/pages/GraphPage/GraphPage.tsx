import { TabContext, TabList } from '@mui/lab'
import { Box, Button, Container, Grid, Paper, Stack, Tab, Typography, styled } from '@mui/material'
import { Field, Form, Formik, FormikErrors, FormikTouched } from 'formik'
import { TextField } from 'formik-mui'
import { Graphviz } from 'graphviz-react'
import _ from 'lodash'
import { FunctionComponent, useEffect, useMemo, useState } from 'react'
import SwipeableViews, { SwipeableViewsHooks } from 'react-swipeable-views'
import AutoSizer from 'react-virtualized-auto-sizer'
import * as Yup from 'yup'
import { AdjacencyMatrix, generateAdjacencyMatrix, Graph } from '../../algorithm'
import { AdjacencyMatrixTable } from '../../components'

const StyledGraph = styled(Graphviz)(({ theme }) => ({
  '.graph': {
    '> polygon': {
      fill: 'transparent'
    },
    '.node': {
      '> *': {
        stroke: theme.palette.text.primary
      },
      '> text': {
        stroke: 'transparent'
      }
    },
    '.edge': {
      '> *': {
        stroke: theme.palette.text.primary
      },
      '> polygon': {
        fill: theme.palette.text.primary
      }
    },
    'text': {
      fill: theme.palette.text.primary
    }
  }
}))

interface FormFields {
  vertices: string
  density: string
}

const GenerateGraphSchema = Yup.object().shape({
  vertices: Yup.number()
    .required()
    .min(1)
    .max(1000),
  density: Yup.number()
    .required()
    .min(0)
    .max(1)
})

const tabValues = ['matrix', 'graph']
const GraphPage: FunctionComponent = () => {
  const [tab, setTab] = useState('matrix')
  const [svHooks, setSvHooks] = useState<SwipeableViewsHooks>({ updateHeight: () => { } })
  const [adjacencyMatrix, setAdjacencyMatrix] = useState<AdjacencyMatrix | null>(null)
  const graph = useMemo(() => adjacencyMatrix ? new Graph(adjacencyMatrix) : null, [adjacencyMatrix])

  useEffect(() => {
    svHooks.updateHeight()
  }, [adjacencyMatrix, svHooks])

  const errorProps = (name: keyof FormikErrors<FormFields>, errors: FormikErrors<FormFields>, touched: FormikTouched<FormFields>) => {
    if (errors[name] && touched[name]) {
      return {
        error: true,
        helperText: errors[name]
      }
    }
    return {
      error: false
    }
  }

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      <Typography variant="h2" gutterBottom>Graph Generator</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Formik
              initialValues={{
                vertices: '',
                density: ''
              }}
              validationSchema={GenerateGraphSchema}
              onSubmit={(values, { setSubmitting }) => {
                const graph = generateAdjacencyMatrix(+values.vertices, +values.density)
                setAdjacencyMatrix(graph)

                setSubmitting(false)
              }}
              validateOnMount
            >
              {({ submitForm, touched, errors, isSubmitting, isValid }) => (
                <Form>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Field
                        component={TextField}
                        name="vertices"
                        label="Vertices"
                        type="number"
                        fullWidth
                        helperText="The number of vertices to generate."
                        {...errorProps('vertices', errors, touched)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Field
                        component={TextField}
                        name="density"
                        label="Density"
                        type="number"
                        inputProps={{ step: "0.01" }}
                        fullWidth
                        helperText="The density of edges."
                        {...errorProps('density', errors, touched)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Stack direction="row" justifyContent="flex-end">
                        <Button
                          variant="contained"
                          sx={{ width: 'fit-content' }}
                          disabled={isSubmitting || !isValid}
                          onClick={submitForm}
                        >
                          Generate Graph
                        </Button>
                      </Stack>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
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
                  {graph && (
                    <Box sx={{ display: 'flex', alignItems: 'center', pr: 3 }}>
                      <Button color="secondary" onClick={() => {
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
                    <Paper sx={{ maxHeight: 500, overflow: 'auto', bgcolor: 'transparent' }} variant="outlined">
                      <AdjacencyMatrixTable
                        sx={{
                          width: '100%'
                        }}
                        adjacencyMatrix={adjacencyMatrix}
                      />
                    </Paper>
                  )}
                </Paper>
                <Paper sx={{ height: 500, p: 3 }}>
                  {graph && (
                    <AutoSizer>
                      {({ height, width }) => (
                        <StyledGraph
                          dot={graph.toDotString()}
                          options={{
                            useWorker: false,
                            fit: true,
                            zoom: false,
                            width: width,
                            height: height,
                          }}
                        />
                      )}
                    </AutoSizer>
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
