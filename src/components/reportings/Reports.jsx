/** @format */
import { useContext, useEffect, useState } from 'react';
import { Stack, Button, Typography, Switch, TextField } from '@mui/material';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import OutReportsTable from './OutReportsTable';
import axios from 'axios';
import { MachineContext } from '../../MachineContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useNavigate } from 'react-router-dom';
import { CustomerContext } from '../../CustomerContext';

var date = new Date();

const Reports = ({ InColumns, OutColumns }) => {
  const { machineID } = useContext(MachineContext);
  const [data, setData] = useState([{}]);
  const [switchVal, setSwitchVal] = useState(() => {
    const oldSwitch = localStorage.getItem('admin_reportings_switch');
    if (oldSwitch) {
      return oldSwitch === 'true';
    } else return false;
  });
  const [columns, setColumns] = useState(() => {
    const oldSwitch = localStorage.getItem('admin_reportings_switch');
    return oldSwitch === 'true' ? OutColumns : InColumns;
  });
  const [start, setStart] = useState(() =>
    new Date(date.getFullYear(), date.getMonth(), 1).toLocaleDateString()
  );
    const { setCustomerID } = useContext(CustomerContext);
    const navigate = useNavigate();

  const token = localStorage.getItem("authToken");
  const [end, setEnd] = useState(new Date().toLocaleDateString());
  const [isLoading, setLoading] = useState(false);
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
  const handleSwitch = e => {
    setSwitchVal(e.target.checked);
    setColumns(e.target.checked ? OutColumns : InColumns);
    localStorage.setItem('admin_reportings_switch', e.target.checked);
  };
  const handleDate = async e => {
    e.preventDefault();
    await getData();
  };

  useEffect(() => {
    getData();
  }, [machineID]);

  const handlePDFDownload = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      body: data,
      columns: columns.map(col => ({ ...col, dataKey: col.id, header: col.label })),
    });
    doc.save(
      switchVal
        ? `Outdoor Reports from ${start} to ${end}`
        : `Indoor Reports from ${start} to ${end}`
    );
  };
  return (
    <div>
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
          <Button
            onClick={handlePDFDownload}
            size='small'
            disabled={isLoading}
            variant='contained'
            color='success'>
            Download as PDF
          </Button>
        </Stack>
      </Stack>
      <OutReportsTable columns={columns} data={data} loading={isLoading} />
    </div>
  );
};

export default Reports;
