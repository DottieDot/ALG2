import { TabContext, TabList } from '@mui/lab'
import { Button, Container, Grid, Paper, Stack, Tab, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { Field, Form, Formik, FormikErrors, FormikTouched } from 'formik'
import { TextField } from 'formik-mui'
import _ from 'lodash'
import { FunctionComponent, useEffect, useState } from 'react'
import SwipeableViews, { SwipeableViewsHooks } from 'react-swipeable-views'
import * as Yup from 'yup'
import { AdjacencyMatrix, generateAdjacencyMatrix } from '../../algorithm'
import { AdjacencyMatrixTable } from '../../components'

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
  const [svHooks, setSvHooks] = useState<SwipeableViewsHooks>({ updateHeight: () => {} })
  const [adjacencyMatrix, setAdjacencyMatrix] = useState<AdjacencyMatrix | null>(null)

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
                </TabList>
              </Box>
              <SwipeableViews 
                action={setSvHooks}
                index={_.indexOf(tabValues, tab)} 
                animateHeight
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
                <Paper>
                  Graph!
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
