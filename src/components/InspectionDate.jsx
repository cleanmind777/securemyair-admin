/** @format */

import { Box, Button, Paper, TextField, Typography } from '@mui/material/';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import { useContext, useEffect, useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { MachineContext } from '../MachineContext';
import MyDialog from '../dialogs/MyDialog';

import axios from 'axios';

const IndoorSensors = () => {
  const [value, setValue] = useState(dayjs(new Date()));
  const { machineID } = useContext(MachineContext);
  const [dialog, setDialog] = useState(false);

  const handleChange = newValue => {
    setValue(newValue);
  };
  useEffect(() => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    axios
      .get(`inspection.php?api=${machineID}`, { cancelToken: source.token })
      .then(res => {
        setValue(res.data.res);
      })
      .catch(err => console.log(err));
    return () => {
      source.cancel();
    };
  }, [machineID]);
  const handleSubmit = async e => {
    e.preventDefault();
    let formData = new FormData(e.currentTarget);
    formData.append('api', machineID);
    axios
      .post('inspection.php', formData)
      .then(res => {
        res.data && setDialog(true);
      })
      .catch(error => console.log(error));
  };

  return (
    <Paper
      sx={{
        flex: 1,
        width: '100%',
        bgcolor: 'background.paper',
        borderRadius: '1vh',
        p: '1vh',
      }}>
      <Typography
        fontWeight={'bold'}
        sx={{ textDecoration: 'Underline', color: 'black', fontSize: '3.1vh' }}>
        EDIT INSPECTION DATE
      </Typography>
      <Box
        onSubmit={handleSubmit}
        component='form'
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 1,
          alignItems: 'center',
          marginBlock: '1vh',
        }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DesktopDatePicker
            className='datePicker'
            label='Select Date'
            inputFormat='MM-DD-YYYY'
            value={value}
            onChange={handleChange}
            renderInput={params => <TextField name='date' {...params} />}
          />
        </LocalizationProvider>
        <Button sx={{ height: '5vh' }} variant='contained' type='submit'>
          Submit
        </Button>
      </Box>
      {dialog && (
        <MyDialog
          title='Success'
          des={`Inspection date is updated successfully.`}
          actions={[{ onClick: () => setDialog(false), text: 'Close' }]}
        />
      )}
    </Paper>
  );
};

export default IndoorSensors;
