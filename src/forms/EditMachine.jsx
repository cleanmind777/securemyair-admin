/** @format */

import {
  Box,
  Button,
  createTheme,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';

import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MyDialog from '../dialogs/MyDialog';
import { UpdateCustomersContext } from '../UpdateCustomersContext';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CircularProgress from '@mui/material/CircularProgress';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { CustomerContext } from '../CustomerContext';

let theme = createTheme();
const AddCustomer = () => {
  const [options, setOptions] = useState([]);
  const [open, setOpen] = useState(false);
  let loading = options.length === 0;
  const [date, setDate] = useState(dayjs(new Date()));
  const [customerId, setCustomerId] = useState('');

  const nameRef = useRef();
  const locationRef = useRef();
  const apiRef = useRef();
  const dateRef = useRef();
  const { setUpdateCustomers } = useContext(UpdateCustomersContext);
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();
  const token = localStorage.getItem("authToken");
  const { setCustomerID } = useContext(CustomerContext);


  const handleBack = () => {
    return navigate('/machines');
  };
  // dsak;ljfkladsjfkaljdfs
  const machine = location.state;

  useEffect(() => {
    setCustomerId(machine.cid);
    nameRef.current.value = machine.name;
    locationRef.current.value = machine.location;
    apiRef.current.value = machine.apiToken;
    dateRef.current.value = machine.date;
    setDate(machine.date);
  }, []);
  // dsak;ljfkladsjfkaljdfs
  const handleSubmit = async e => {
    e.preventDefault();
    let formData = new FormData();

    formData.append('id', machine.id);
    formData.append('cid', customerId);
    formData.append('name', nameRef.current.value);
    formData.append('location', locationRef.current.value);
    formData.append('date', dateRef.current.value);
    formData.append('api', apiRef.current.value);

    await axios
      .post("editMachine.php", formData, { headers: { Authorization: token } })
      .then((result) => {
         if (result.data.error === "Expired token") {
           localStorage.clear();
           setCustomerID(null);
           navigate("/login");
         }
        const res = result.data["res"];
        if (res === "true") {
          nameRef.current.value = "";
          locationRef.current.value = "";
          dateRef.current.value = "";
          apiRef.current.value = "";
          setUpdateCustomers((pre) => !pre);
          setOpen(true);
        } else {
          console.log("New Machine is not added");
        }
      })
      .catch((error) => console.log(error));
  };
  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }
    if (active) {
      (async () => {
        await axios
          .get('customers.php')
          .then(result => {
            setOptions(result.data);
          })
          .catch(error => console.log(error));
      })();
    }

    return () => {
      active = false;
    };
  }, [loading]);

  return (
    <div className='centerTable'>
      <Paper sx={{ p: 4, width: '95%', pt: 0, overflow: 'auto', maxHeight: '93vh' }}>
        <div
          style={{
            background: 'white',
            position: 'sticky',
            height: '8vh',
            zIndex: '1',
            top: 0,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}>
          <Typography
            pl={1}
            display={'inline'}
            sx={{
              fontSize: '2.3vh',
              fontWeight: 'bold',
              color: 'black',
            }}>
            Add New Machine
          </Typography>
          <Button onClick={() => navigate('/machines')} variant='contained' sx={{ maxWidth: 200 }}>
            Back to List
          </Button>
        </div>
        <Box component='form' onSubmit={handleSubmit}>
          <FormControl fullWidth>
            <InputLabel id='select-customer'>Select Customer</InputLabel>
            <Select
              endAdornment={
                <InputAdornment position='start'>
                  {loading ? (
                    <CircularProgress sx={{ mr: '10px' }} color='inherit' size={20} />
                  ) : null}
                </InputAdornment>
              }
              required
              labelId='select-customer'
              label='Select Customer'
              value={customerId}
              onChange={e => {
                return setCustomerId(e.target.value);
              }}>
              {options.map(item => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            margin='normal'
            inputRef={nameRef}
            required
            fullWidth
            label='Name'
            size={isMobile ? 'small' : 'medium'}
          />
          <TextField
            autoComplete='off'
            margin='normal'
            inputRef={locationRef}
            required
            fullWidth
            label='Location'
            size={isMobile ? 'small' : 'medium'}
          />
          <TextField
            autoComplete='off'
            margin='normal'
            inputRef={apiRef}
            required
            fullWidth
            label='Api Token'
            size={isMobile ? 'small' : 'medium'}
          />

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              label='Select Inspection Date'
              inputFormat='YYYY-MM-DD'
              inputRef={dateRef}
              value={date}
              onChange={val => setDate(val)}
              renderInput={params => (
                <TextField
                  sx={{ display: 'block', my: 2 }}
                  size={isMobile ? 'small' : 'medium'}
                  {...params}
                />
              )}
            />
          </LocalizationProvider>
          <Button type='submit' variant='contained' sx={{ maxWidth: 200 }} color='success'>
            Update Machine
          </Button>
        </Box>
      </Paper>
      {open && (
        <MyDialog
          title='Success Update'
          des='Machine Detail Edited Successfully.'
          actions={[{ onClick: handleBack, color: 'primary', text: 'Back to List' }]}
        />
      )}
    </div>
  );
};

export default AddCustomer;
