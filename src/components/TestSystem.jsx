/** @format */
import Paper from '@mui/material/Box';
import List from '@mui/material/List';
import CircleIcon from '@mui/icons-material/Circle';
import ListItemText from '@mui/material/ListItemText';
import { Button, Divider, ListItem, Typography, Box, Card, Avatar, Chip } from '@mui/material';
import { Science, PlayArrow, Stop, Settings } from '@mui/icons-material';
import SubTxt from './SubTxt';
import Relay from './Relay';
import React, { useContext, useEffect, useState } from 'react';
import { MachineContext } from '../MachineContext';
import axios from 'axios';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomerContext } from '../CustomerContext';
const circleStyle = {
  width: '2.7vh',
  height: '2.7vh',
  ml: '12px',
};
const hdnCircle = {
  width: '2.7vh',
  height: '2.7vh',
  ml: '12px',
  visibility: 'hidden',
};
const shortButton = {
  height: '3vh',
  minWidth: '3vw',
  fontSize: '1.5vh',
};

function TestSystem() {
  const [res, setRes] = useState({});
  const { machineID } = useContext(MachineContext);
  const startRef = useRef();
  const endRef = useRef();
  const sotRef = useRef();
  const tvocRef = useRef();
  const pm10Ref = useRef();
  const pm25Ref = useRef();
  const co2Ref = useRef();
    const token = localStorage.getItem("authToken");
  const { setCustomerID } = useContext(CustomerContext);
    const navigate = useNavigate();


  const pushData = async id => {
    await axios
      .get("system.php", {
        params: { api: machineID, relay: id },
        headers: { Authorization: token },
      })
      .then((result) => {
        if (result.data.error === "Expired token") {
          localStorage.clear();
          setCustomerID(null);
          navigate("/login");
        }
        console.log(result);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    let intervalId;
    const fetchDta = async () => {
      await axios
        .get("system.php", {
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
    fetchDta();
    intervalId = setInterval(fetchDta, 1000);
    return () => clearInterval(intervalId);
  }, [machineID, res]);

  const handleRelayBtnClick = id => {
    pushData(id);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    let formData = new FormData();
    formData.append('start', startRef.current.value === '' ? res.start : startRef.current.value);
    formData.append('end', endRef.current.value === '' ? res.end : endRef.current.value);
    formData.append('sot', sotRef.current.value === '' ? res.sot : sotRef.current.value);
    formData.append('tvoc', tvocRef.current.value === '' ? res.tvoc : tvocRef.current.value);
    formData.append('pm10', pm10Ref.current.value === '' ? res.pm10 : pm10Ref.current.value);
    formData.append('pm25', pm25Ref.current.value === '' ? res.pm25 : pm25Ref.current.value);
    formData.append('co2', co2Ref.current.value === '' ? res.co2 : co2Ref.current.value);
    await axios
      .post(`system.php?api=${machineID}`, formData, {
        headers: { Authorization: token },
      })
      .then((result) => {
        if (result.data.error === "Expired token") {
          localStorage.clear();
          setCustomerID(null);
          navigate("/login");
        }
        startRef.current.value = "";
        endRef.current.value = "";
        sotRef.current.value = "";
        tvocRef.current.value = "";
        pm10Ref.current.value = "";
        pm25Ref.current.value = "";
        co2Ref.current.value = "";
      })
      .catch((error) => console.log(error));
  };
  return (
    <Box sx={{ flex: 5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {/* Beautiful Header */}
      <Card
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, rgba(168,85,247,0.08) 0%, rgba(236,72,153,0.12) 100%)',
          border: '1px solid rgba(168,85,247,0.15)',
          borderRadius: 2,
          p: 1.5
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ 
            width: 36, 
            height: 36,
            background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
            boxShadow: '0 4px 12px rgba(168,85,247,0.3)'
          }}>
            <Science sx={{ fontSize: '1.2rem', color: 'white' }} />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ 
              fontWeight: 700, 
              color: 'rgba(30,41,59,0.95)', 
              fontSize: '1.1rem',
              letterSpacing: '0.02em'
            }}>
              System Override
            </Typography>
            <Typography variant="body2" sx={{ 
              color: 'rgba(168,85,247,0.8)', 
              fontSize: '0.85rem',
              fontWeight: 500
            }}>
              Manual testing & calibration
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Chip
              icon={<Settings sx={{ fontSize: '0.7rem' }} />}
              label="TEST"
              size="small"
              sx={{
                backgroundColor: 'rgba(168,85,247,0.15)',
                color: 'rgba(168,85,247,0.9)',
                borderColor: 'rgba(168,85,247,0.3)',
                fontWeight: 600,
                fontSize: '0.65rem',
                height: '22px'
              }}
              variant="outlined"
            />
          </Box>
        </Box>
      </Card>

      <Paper
        sx={{
          flex: 1,
          width: '100%',
          bgcolor: 'background.paper',
          borderRadius: '1vh',
          display: 'flex',
        }}>
        <List
          component='nav'
          aria-label='relay controld'
          sx={{
            flex: 1,
            height: { xs: '450px', sm: '47.8vh' },
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            padding: 0,
          }}>
          <Relay
            id='1'
            lable='Override 1'
            btn={res.ovr1}
            isDisable={false}
            ind={res.ovr1_ind}
            onBtnClick={handleRelayBtnClick}
          />
          <Relay
            id='2'
            lable='Override 2'
            btn={res.ovr2}
            isDisable={false}
            ind={res.ovr2_ind}
            onBtnClick={handleRelayBtnClick}
          />

          <ListItem sx={{ padding: '0.1rem 1rem', flex: 1 }} divider>
            <ListItemText sx={{ m: 0, fontSize: '2vh !important' }} primary={'System RST'} />
            <Button
              variant='contained'
              size='small'
              onClick={() => handleRelayBtnClick('3')}
              sx={shortButton}>
              {res.rst === '1' ? 'Release' : 'Press'}
            </Button>
            <CircleIcon sx={hdnCircle} />
          </ListItem>
          <form
            style={{ flex: 5, display: 'flex', flexDirection: 'column' }}
            onSubmit={handleSubmit}>
            <div
              style={{
                flex: 3,
                display: 'flex',
                margin: '0px 5px ',
                flexDirection: 'column',
                border: '2px solid black',
                borderRadius: '1vh',
                marginBottom: '.5vh',
              }}>
              <ListItem sx={{ padding: '0.2rem 1rem', flex: 1 }} divider>
                <ListItemText
                  sx={{ m: 0, fontSize: '2vh !important' }}
                  primary={'Shift Start Time'}
                />
                <input
                  ref={startRef}
                  placeholder={res.start}
                  style={{ width: '15%', textAlign: 'center', borderColor: 'whitesmoke' }}
                />
              </ListItem>
              <ListItem sx={{ padding: '0.2rem 1rem', flex: 1 }} divider>
                <ListItemText
                  sx={{ m: 0, fontSize: '2vh !important' }}
                  primary={'Shift End Time'}
                />
                <input
                  placeholder={res.end}
                  ref={endRef}
                  style={{ width: '15%', textAlign: 'center', borderColor: 'whitesmoke' }}
                />
              </ListItem>
              <ListItem sx={{ padding: '0.2rem 1rem', flex: 1 }} divider>
                <ListItemText
                  sx={{ m: 0, fontSize: '2vh !important' }}
                  primary={'System Override Time'}
                />
                <input
                  placeholder={res.sot}
                  ref={sotRef}
                  style={{ width: '15%', textAlign: 'center', borderColor: 'whitesmoke' }}
                />
              </ListItem>
            </div>
            <div
              style={{
                flex: 2,
                display: 'flex',
                margin: '0px 5px ',
                flexDirection: 'column',
                border: '2px solid black',
                borderRadius: '1vh',
                marginBottom: '.5vh',
              }}>
              <ListItem sx={{ padding: '0 1rem', flex: 1 }} divider>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '50%' }}>
                  <span style={{ fontSize: '2vh' }}>TVOC</span>
                  <input
                    placeholder={res.tvoc}
                    ref={tvocRef}
                    style={{ width: '30%', textAlign: 'center', borderColor: 'whitesmoke' }}
                  />
                </div>

                <Divider
                  orientation='vertical'
                  flexItem
                  sx={{
                    marginInline: '10px !important',
                    bgcolor: 'rgba(0,0,0,0)',
                    width: '2px',
                    borderColor: 'rgba(0,0,0,0)',
                  }}
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', width: '50%' }}>
                  <span style={{ fontSize: '2vh' }}>PM10</span>
                  <input
                    placeholder={res.pm10}
                    ref={pm10Ref}
                    style={{ width: '30%', textAlign: 'center', borderColor: 'whitesmoke' }}
                  />
                </div>
              </ListItem>
              <ListItem sx={{ padding: '0 1rem', flex: 1 }} divider>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '50%' }}>
                  <span style={{ fontSize: '2vh' }}>PM2.5</span>
                  <input
                    placeholder={res.pm25}
                    ref={pm25Ref}
                    style={{ width: '30%', textAlign: 'center', borderColor: 'whitesmoke' }}
                  />
                </div>

                <Divider
                  orientation='vertical'
                  flexItem
                  sx={{
                    marginInline: '10px !important',
                    bgcolor: 'rgba(0,0,0,0)',
                    width: '2px',
                    borderColor: 'rgba(0,0,0,0)',
                  }}
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', width: '50%' }}>
                  <span style={{ fontSize: '2vh' }}>
                    <SubTxt lable={'CO'} sub={2} />
                  </span>
                  <input
                    placeholder={res.co2}
                    ref={co2Ref}
                    style={{ width: '30%', textAlign: 'center', borderColor: 'whitesmoke' }}
                  />
                </div>
              </ListItem>
            </div>
            <input type='submit' hidden />
          </form>
          <div
            style={{
              flex: 1,
              display: 'flex',
              margin: '0px 5px 5px',
              border: '2px solid black',
              borderRadius: '1vh',
            }}>
            <ListItem sx={{ padding: '0 1rem' }} divider>
              <ListItemText sx={{ m: 0, fontSize: '2vh !important' }} primary={'System Violated'} />

              <CircleIcon htmlColor={res.sv === '1' ? 'red' : ''} sx={circleStyle} />
              <Divider
                orientation='vertical'
                flexItem
                sx={{
                  marginInline: '10px !important',
                  bgcolor: 'rgba(0,0,0,0)',
                  width: '2px',
                  borderColor: 'rgba(0,0,0,0)',
                }}
              />
              <ListItemText
                sx={{ m: 0, fontSize: '2vh !important' }}
                primary={<span>Replace Filter&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>}
              />
              <CircleIcon htmlColor={res.filter === '1' ? 'red' : ''} sx={circleStyle} />
            </ListItem>
          </div>
        </List>
      </Paper>
    </Box>
  );
}
export default TestSystem;
