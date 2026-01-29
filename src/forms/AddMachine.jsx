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
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';

import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import MyDialog from '../dialogs/MyDialog';
import { UpdateCustomersContext } from '../UpdateCustomersContext';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CircularProgress from '@mui/material/CircularProgress';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import dayjs from 'dayjs';
import { CustomerContext } from '../CustomerContext';

let theme = createTheme();
const AddMachine = () => {
  const isSuper = localStorage.getItem('admin_id') === '5';
  const [openDialog, setOpenDialog] = useState(false);
  const [shrink, setShrink] = useState(false);
  const [options, setOptions] = useState([]);
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
  const token = localStorage.getItem("authToken");
  const [ranges, setRanges] = useState([]);
  const { setCustomerID: logoutCustomerID } = useContext(CustomerContext);
  const handleSubmit = async e => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (isSuper) formData.append('isSuper', true);
    // for (const [name, value] of formData.entries()) {
    //   console.log(`${name}: ${value}`);
    // }
    await axios
      .post("addMachine.php", formData, { headers: { Authorization: token } })
      .then((result) => { if (result.data.error === "Expired token") {
        localStorage.clear();
        logoutCustomerID(null);
        navigate("/login");
      }
        const res = result.data["res"];
        if (res === "true") {
          nameRef.current.value = "";
          locationRef.current.value = "";
          dateRef.current.value = "";
          apiRef.current.value = "";
          setUpdateCustomers((pre) => !pre);
          setOpenDialog(true);
        } else {
          alert("New Machine is not added");
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
    if (isSuper) {
      axios.get(`addMachine.php?api=default`).then(res => {
        const response = res.data.range;
        console.log(response);
        setRanges([
          {
            id: 'humidity',
            label: 'Humidity',
            humidity_green: response.humidity_green,
            humidity_yellow: response.humidity_yellow,
            humidity_orange: response.humidity_orange,
            humidity_darkOrange: response.humidity_darkOrange,
            humidity_red: response.humidity_red,
          },
          {
            id: 'humidityHidden',
            label: 'Humidity Hidden',
            humidityHidden_green: null,
            humidityHidden_yellow: response.humidityHidden_yellow,
            humidityHidden_orange: response.humidityHidden_orange,
            humidityHidden_darkOrange: response.humidityHidden_darkOrange,
            humidityHidden_red: response.humidityHidden_red,
          },
          {
            id: 'CO2',
            label: 'CO2',
            CO2_green: response.CO2_green,
            CO2_yellow: response.CO2_yellow,
            CO2_orange: response.CO2_orange,
            CO2_darkOrange: response.CO2_darkOrange,
            CO2_red: response.CO2_red,
          },
          {
            id: 'VOC',
            label: 'VOC',
            VOC_green: response.VOC_green,
            VOC_yellow: response.VOC_yellow,
            VOC_orange: response.VOC_orange,
            VOC_darkOrange: response.VOC_darkOrange,
            VOC_red: response.VOC_red,
          },
          {
            id: 'PM2',
            label: 'PM2.5',
            PM2_green: response.PM2_green,
            PM2_yellow: response.PM2_yellow,
            PM2_orange: response.PM2_orange,
            PM2_darkOrange: response.PM2_darkOrange,
            PM2_red: response.PM2_red,
          },
          {
            id: 'PM10',
            label: 'PM10',
            PM10_green: response.PM10_green,
            PM10_yellow: response.PM10_yellow,
            PM10_orange: response.PM10_orange,
            PM10_darkOrange: response.PM10_darkOrange,
            PM10_red: response.PM10_red,
          },
          {
            id: 'AQI',
            label: 'AQI',
            AQI_A: response.AQI_A,
            AQI_B: response.AQI_B,
            AQI_C: response.AQI_C,
            AQI_D: response.AQI_D,
            AQI_F: response.AQI_F,
          },
        ]);
      });
    }
    return () => {
      active = false;
    };
  }, [loading]);
  function genToken() {
    const length = 10;
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    apiRef.current.value = result;
    setShrink(true);
    return;
  }
  return (
    <div className='centerTable'>
      <Paper sx={{ p: 4, width: '95%', pt: 0, overflow: 'auto', maxHeight: 'auto' }}>
        <div
          style={{
            background: 'white',
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
        <Stack
          component='form'
          onSubmit={handleSubmit}
          direction={isSuper ? 'row' : 'column'}
          gap={1}
          sx={{ flexWrap: 'wrap' }}>
          <Box sx={{ flex: 1 }}>
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
                name='cid'
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
              name='name'
              required
              fullWidth
              label='Name'
              size={isMobile ? 'small' : 'medium'}
            />
            <TextField
              autoComplete='off'
              margin='normal'
              name='location'
              inputRef={locationRef}
              required
              fullWidth
              label='Location'
              size={isMobile ? 'small' : 'medium'}
            />
            <TextField
              autoComplete='off'
              margin='normal'
              name='api'
              inputRef={apiRef}
              InputLabelProps={{ shrink: shrink }}
              required
              fullWidth
              label='Api Token'
              size={isMobile ? 'small' : 'medium'}
              helperText={
                <span
                  onClick={genToken}
                  style={{
                    marginLeft: '-14px',
                    fontSize: '13px',
                    cursor: 'pointer',
                    color: 'blue',
                    textDecoration: 'underline',
                  }}>
                  Generate Random Token
                </span>
              }
            />

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DesktopDatePicker
                label='Select Inspection Date'
                inputFormat='MM-DD-YYYY'
                inputRef={dateRef}
                value={date}
                onChange={val => setDate(val)}
                renderInput={params => (
                  <TextField
                    name='date'
                    sx={{ display: 'block', my: 2 }}
                    size={isMobile ? 'small' : 'medium'}
                    {...params}
                  />
                )}
              />
            </LocalizationProvider>
            <Button type='submit' variant='contained' sx={{ maxWidth: 200 }} color='success'>
              Create Machine
            </Button>
          </Box>
          {isSuper && (
            <Box sx={{ flex: 2 }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell />
                      <TableCell>Green</TableCell>
                      <TableCell>Yellow</TableCell>
                      <TableCell>Orange</TableCell>
                      <TableCell>Dark Orange</TableCell>
                      <TableCell>Red</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {ranges.map(({ id, label, ...rest }) => {
                      const isAqi = id === 'AQI';
                      return (
                        <>
                          {id === 'AQI' && (
                            <TableRow key={'letters'} sx={{ border: 0 }}>
                              {['', 'A', 'B', 'C', 'D', 'F'].map(letter => (
                                <TableCell
                                  key={letter}
                                  sx={{ textAlign: 'center', p: 0, border: 0 }}>
                                  {letter}
                                </TableCell>
                              ))}
                            </TableRow>
                          )}
                          <TableRow key={id}>
                            <TableCell>{label}</TableCell>
                            {Object.entries(rest).map(([key, value]) => {
                              const bool = key === 'humidityHidden_green' || key === 'AQI_F';

                              return (
                                <TableCell
                                  sx={
                                    isAqi
                                      ? { paddingTop: 0 }
                                      : { minWidth: '6.5rem', paddingBlock: 0 }
                                  }
                                  key={key}>
                                  <TextField
                                    sx={{ minWidth: 'fit-content' }}
                                    variant='outlined'
                                    required={!bool}
                                    disabled={bool}
                                    size='small'
                                    name={key}
                                    placeholder={bool ? 'Disabled' : ''}
                                    defaultValue={value || ''}
                                  />
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        </>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Stack>
      </Paper>
      {openDialog && (
        <MyDialog
          title='Success'
          des='New Machine is added Successful.'
          actions={[
            { onClick: () => navigate('/machines'), color: 'primary', text: 'Back to List' },
            { onClick: () => setOpenDialog(false), color: 'success', text: 'Create New' },
          ]}
        />
      )}
    </div>
  );
};

export default AddMachine;
