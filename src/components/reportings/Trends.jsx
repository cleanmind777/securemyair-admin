/** @format */

import { Button, Stack, Switch, TextField, Typography } from '@mui/material';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import React, { useContext, useEffect, useState } from 'react';
import { MachineContext } from '../../MachineContext';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import axios from 'axios';
import TrendTabs from './TrendTabs';
import { useNavigate } from 'react-router-dom';
import { CustomerContext } from '../../CustomerContext';
var date = new Date();

const Trends = ({ InColumns, OutColumns }) => {
  const { machineID } = useContext(MachineContext);
    const {  setCustomerID } = useContext(CustomerContext);
    const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [start, setStart] = useState(() =>
    new Date(date.getFullYear(), date.getMonth(), 1).toLocaleDateString()
  );
  const [end, setEnd] = useState(new Date().toLocaleDateString());
  const [columns, setColumns] = useState(() => {
    const oldSwitch = localStorage.getItem('admin_reportings_switch');
    return oldSwitch === 'true' ? OutColumns : InColumns;
  });
  const token = localStorage.getItem("authToken");

  const [switchVal, setSwitchVal] = useState(() => {
    const oldSwitch = localStorage.getItem('admin_reportings_switch');
    if (oldSwitch) {
      return oldSwitch === 'true';
    } else return false;
  });
  const getData = async () => {
    setLoading(true);
    await axios
      .get(
        `reportings/reports.php?api=${machineID}&fromDate=${start}&toDate=${end}`,
        { headers: { Authorization: token } }
      )
      .then((res) => {
         if (res.data.error === "Expired token") {
           localStorage.clear();
           setCustomerID(null);
           navigate("/login");
         }
        setData(res.data);
      })
      .catch((err) => console.log(err));
    setLoading(false);
  };
  const handleDate = async e => {
    e.preventDefault();
    await getData();
  };
  useEffect(() => {
    getData();
  }, [machineID]);
  const handleSwitch = e => {
    setSwitchVal(e.target.checked);
    setColumns(e.target.checked ? OutColumns : InColumns);
    localStorage.setItem('admin_reportings_switch', e.target.checked);
  };
  return (
    <>
      <Stack
        direction={{ xs: 'column', xl: 'row' }}
        sx={{ justifyContent: 'space-between', alignItems: 'center', marginBlock: 2 }}
        gap={3}>
        <Stack direction='row' alignItems='center' sx={{ order: 0 }}>
          <Typography variant='body1'>Indoor</Typography>
          <Switch
            disabled={isLoading}
            sx={{
              '.MuiSwitch-thumb': { color: '#1976d2' },
              '.MuiSwitch-track': { backgroundColor: '#1976d2' },
            }}
            checked={switchVal}
            onChange={handleSwitch}
          />
          <Typography variant='body1'>Outdoor</Typography>
        </Stack>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Stack
            component={'form'}
            onSubmit={handleDate}
            direction={{ xs: 'column', sm: 'row' }}
            gap={1}>
            <DesktopDatePicker
              disableMaskedInput
              inputFormat='MM-DD-YYYY'
              required
              label='Start Date'
              value={start}
              onChange={newValue => {
                setStart(`${newValue.$M + 1}/${newValue.$D}/${newValue.$y}`);
              }}
              renderInput={params => (
                <TextField
                  disabled={isLoading}
                  required
                  size='small'
                  sx={{ '&': { width: { xs: '70vw', sm: '12rem' } } }}
                  {...params}
                />
              )}
            />
            <DesktopDatePicker
              disableMaskedInput
              inputFormat='MM-DD-YYYY'
              required
              label='End Date'
              value={end}
              onChange={newValue => {
                setEnd(`${newValue.$M + 1}/${newValue.$D}/${newValue.$y}`);
              }}
              renderInput={params => (
                <TextField
                  required
                  size='small'
                  sx={{ '&': { width: { xs: '70vw', sm: '12rem' } } }}
                  {...params}
                />
              )}
            />
            <Button type='submit' disabled={isLoading} variant='contained'>
              Submit
            </Button>
          </Stack>
        </LocalizationProvider>
        <Stack direction='row' gap={1}>
          <Typography
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'black',
            }}>
            Click <MenuRoundedIcon sx={{ alignSelf: 'baseline' }} /> icon to download the chart.
          </Typography>
        </Stack>
      </Stack>
      <TrendTabs columns={columns} data={data} />
    </>
  );
};

export default Trends;
