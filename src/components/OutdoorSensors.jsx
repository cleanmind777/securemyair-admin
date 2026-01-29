/** @format */

import SenserContainer from './SenserContainer';
import { Paper, Typography } from '@mui/material/';
import SubTxt from './SubTxt';
import { MachineContext } from '../MachineContext';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomerContext } from '../CustomerContext';

const OutdoorSensors = () => {
  const [res, setRes] = useState({});
  const { machineID } = useContext(MachineContext);
  const {  setCustomerID } = useContext(CustomerContext);
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();

  useEffect(() => {
    let intervalId;
    const fetchData = async () => {
      await axios
        .get("outdoor.php", {
          params: { api: machineID },
          headers: { Authorization: token },
        })
        .then((result) => {
          if (result.data.error === "Expired token") {
            localStorage.clear();
            setCustomerID(null);
            navigate("/login");
          }
          const newData = result.data;
          if (JSON.stringify(newData) !== JSON.stringify(res)) {
            setRes(newData);
          }
        })
        .catch((error) => console.log(error));
    };
    fetchData();
    intervalId = setInterval(fetchData, 1000);
    return () => clearInterval(intervalId);
  }, [machineID, res]);
  return (
    <Paper
      elevation={0}
      sx={{
        marginBottom: '.5vh',
        flex: 4,
        width: '100%',
        bgcolor: 'background.paper',
        borderRadius: '1vh',
        display: 'flex',
        flexDirection: 'column',
        p: '1vh',
      }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography sx={{ fontSize: '2vh' }}>
          Temp
          <br />
          {res.temp}°F
        </Typography>
        <Typography
          fontWeight={'bold'}
          sx={{ textDecoration: 'Underline', color: 'black', fontSize: '3.1vh' }}>
          OUTDOOR SENSORS
        </Typography>
        <Typography sx={{ fontSize: '2vh' }}>
          Hum
          <br />
          {res.hum}%
        </Typography>
      </div>
      <div style={{ display: 'flex', flex: 1, justifyContent: 'space-between' }}>
        <SenserContainer val={res.o3Vl} lable={<SubTxt lable={'O'} sub={3} />} ht={res.o3Ht} />
        <SenserContainer val={res.so2Vl} lable={<SubTxt lable={'SO'} sub={2} />} ht={res.so2Ht} />
        <SenserContainer val={res.no2Vl} lable={<SubTxt lable={'NO'} sub={2} />} ht={res.no2Ht} />
        <SenserContainer val={res.co2Vl} lable={<SubTxt lable={'CO'} sub={2} />} ht={res.co2Ht} />
        <SenserContainer val={res.coVl} lable={'CO'} ht={res.coHt} />
        <SenserContainer val={res.pm25Vl} lable={'PM2.5'} ht={res.pm25Ht} />
        <SenserContainer val={res.pm10Vl} lable={'PM10'} ht={res.pm10Ht} />
      </div>
    </Paper>
  );
};

export default OutdoorSensors;
