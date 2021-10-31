import { Button, Grid, Stack } from '@mui/material'
import { Field, Form, Formik, FormikErrors, FormikTouched } from 'formik'
import { TextField } from 'formik-mui'
import { FunctionComponent, memo } from 'react'
import * as Yup from 'yup'
import { AdjacencyMatrix, generateAdjacencyMatrix } from '../../algorithm'

interface Props {
  setAdjacencyMatrix: (adjacencyMatrix: AdjacencyMatrix) => void
}

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

const InputForm: FunctionComponent<Props> = ({ setAdjacencyMatrix }) => {
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
    <Formik
      initialValues={{
        vertices: '',
        density: ''
      }}
      validationSchema={GenerateGraphSchema}
      onSubmit={(values, { setSubmitting }) => {
        const matrix = generateAdjacencyMatrix(+values.vertices, +values.density)
        setAdjacencyMatrix(matrix)

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
  )
}
export default memo(InputForm)
