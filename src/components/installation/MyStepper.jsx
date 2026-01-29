/** @format */

import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
  Box,
  Stepper,
  Step,
  StepButton,
  Button,
  Typography,
  Table,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  FifthPage,
  FirstPage,
  FourthPage,
  SecondPage,
  SixPage,
  ThirdPage,
  SevenPage,
} from './pages';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';

const theme = createTheme({ typography: { fontSize: 14, button: { textTransform: 'none' } } });

const steps = [
  'Planning',
  'Approved Design',
  'Installation Company',
  'Payment Schedule',
  'Certificate Issuance',
  'Inspector Data',
  'Commissioning',
];
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.common.black,
    fontWeight: 'bold',
    fontSize: '1.7vh',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: '1.7vh',
  },
}));

export default function HorizontalNonLinearStepper() {
  const oldStep = +localStorage.getItem('admin_ins_step');
  const [activeStep, setActiveStep] = React.useState(() => oldStep);
  const [completed, setCompleted] = React.useState({});
  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
    localStorage.setItem('admin_ins_step', newActiveStep);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
    console.log(activeStep);
  };

  const handleStep = step => () => {
    setActiveStep(step);
    localStorage.setItem('admin_ins_step', step);
  };

  // const handleComplete = () => {
  //   const newCompleted = completed;
  //   newCompleted[activeStep] = true;
  //   setCompleted(newCompleted);
  //   handleNext();
  // };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ margin: { xs: 0, sm: 1 } }}>
        <Stepper
          sx={{
            paddingBlock: '2vh',
            overflow: 'hidden',
            width: '100%',
            overflowX: { xs: 'auto', sm: 'hidden' },
          }}
          nonLinear
          alternativeLabel
          activeStep={activeStep}>
          {steps.map((label, index) => (
            <Step key={label} completed={completed[index]}>
              <StepButton color='inherit' onClick={handleStep(index)}>
                {label}
              </StepButton>
            </Step>
          ))}
        </Stepper>
        <div>
          {allStepsCompleted() ? (
            <React.Fragment>
              <Typography sx={{ mt: 2, mb: 1 }}>
                All steps completed - you&apos;re finished
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Box sx={{ flex: '1 1 auto' }} />
                <Button onClick={handleReset}>Reset</Button>
              </Box>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Button
                  // color='inherit'
                  variant='contained'
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}>
                  Back
                </Button>
                <Box sx={{ flex: '1 1 auto' }} />
                <Button
                  variant='contained'
                  onClick={handleNext}
                  sx={{ mr: 1 }}
                  disabled={activeStep + 1 === steps.length}>
                  Next
                </Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Field</StyledTableCell>
                      <StyledTableCell align='left'>Data</StyledTableCell>
                      <StyledTableCell align='right'>Status</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  {activeStep === 0 ? (
                    <FirstPage />
                  ) : activeStep === 1 ? (
                    <SecondPage />
                  ) : activeStep === 2 ? (
                    <ThirdPage />
                  ) : activeStep === 3 ? (
                    <FourthPage />
                  ) : activeStep === 4 ? (
                    <FifthPage />
                  ) : activeStep === 5 ? (
                    <SixPage />
                  ) : (
                    <SevenPage />
                  )}
                </Table>
              </TableContainer>
            </React.Fragment>
          )}
        </div>
      </Box>
    </ThemeProvider>
  );
}
