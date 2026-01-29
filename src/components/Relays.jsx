/** @format */
import Paper from '@mui/material/Box';
import List from '@mui/material/List';
import CircleIcon from '@mui/icons-material/Circle';

import { ListItem, Switch, Typography, Box, Card, Avatar, Chip, Divider } from '@mui/material';
import { PowerSettingsNew, ElectricalServices, ToggleOn, Bolt } from '@mui/icons-material';
import { useContext, useEffect, useState } from 'react';
import { MachineContext } from '../MachineContext';
import axios from 'axios';
import Relay from './Relay';
import { useNavigate } from 'react-router-dom';
import { CustomerContext } from '../CustomerContext';

const circleStyle = {
  width: '2.7vh',
  height: '2.7vh',
  ml: '12px',
};

function Relays() {
  const [switchValue, setSwitchValue] = useState(false);
  const [res, setRes] = useState({});
  const { machineID } = useContext(MachineContext);
  const token = localStorage.getItem("authToken");
  const { setCustomerID } = useContext(CustomerContext);
  const navigate = useNavigate();

  const pushData = async relay => {
    await axios
      .get("relays.php", {
        params: { api: machineID, relay: relay },
        headers: { Authorization: token },
      })
      .then((result) => {
        if (result.data.error === "Expired token") {
          localStorage.clear();
          setCustomerID(null);
          navigate("/login");
        }
        // console.log(result);
        // setRes(result.data);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    let intervalId;
    const fetchDta = async () => {
      await axios
        .get("relays.php", {
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
            setSwitchValue(() => {
              return newData.m === "0" ? true : false;
            });
          }
        })
        .catch((error) => console.log(error));
    };
    fetchDta();
    intervalId = setInterval(fetchDta, 1000);
    return () => clearInterval(intervalId);
  }, [machineID, res]);
  const handleSwitchChange = e => {
    handleRelayBtnClick('m');
    setSwitchValue(e.target.checked);
  };
  const handleRelayBtnClick = id => {
    pushData(id);
  };

  return (
    <Box sx={{ display: "flex", flex: 4, flexDirection: "column", gap: 1.5 }}>
      {/* Beautiful Header */}
      <Card
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, rgba(239,68,68,0.08) 0%, rgba(251,146,60,0.12) 100%)',
          border: '1px solid rgba(239,68,68,0.15)',
          borderRadius: 2,
          p: 1.5
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ 
            width: 36, 
            height: 36,
            background: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
            boxShadow: '0 4px 12px rgba(239,68,68,0.3)'
          }}>
            <Bolt sx={{ fontSize: '1.2rem', color: 'white' }} />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ 
              fontWeight: 700, 
              color: 'rgba(30,41,59,0.95)', 
              fontSize: '1.1rem',
              letterSpacing: '0.02em'
            }}>
              Relay Controls
            </Typography>
            <Typography variant="body2" sx={{ 
              color: 'rgba(239,68,68,0.8)', 
              fontSize: '0.85rem',
              fontWeight: 500
            }}>
              Power management system
            </Typography>
          </Box>
          <Chip
            icon={<PowerSettingsNew sx={{ fontSize: '0.9rem' }} />}
            label={switchValue ? "ON" : "OFF"}
            size="small"
            sx={{
              backgroundColor: switchValue ? 'rgba(34,197,94,0.15)' : 'rgba(148,163,184,0.15)',
              color: switchValue ? 'rgba(34,197,94,0.9)' : 'rgba(100,116,139,0.8)',
              borderColor: switchValue ? 'rgba(34,197,94,0.3)' : 'rgba(148,163,184,0.3)',
              fontWeight: 600,
              fontSize: '0.7rem'
            }}
            variant="outlined"
          />
        </Box>
      </Card>

      <Paper
        sx={{
          marginBottom: ".5vh",
          flex: 1,
          width: "100%",
          bgcolor: "background.paper",
          borderRadius: "1vh",
          display: "flex",
        }}
      >
        <List
          component="nav"
          aria-label="relay controld"
          sx={{
            flex: 1,
            minHeight: "auto",
            height: { xs: "400px", sm: "40vh" },
            display: "flex",
            flexDirection: "column",
            overflow: "auto",
            paddingBottom: 0,
          }}
        >
          <Relay
            id="1"
            lable="R1: Low Fan"
            btn={res.r1}
            isDisable={switchValue}
            ind={res.r1_ind}
            onBtnClick={handleRelayBtnClick}
          />
          <Relay
            id="2"
            lable="R2: High Fan"
            btn={res.r2}
            isDisable={switchValue}
            ind={res.r2_ind}
            onBtnClick={handleRelayBtnClick}
          />
          <Relay
            id="3"
            lable="R3: UVC"
            btn={res.r3}
            isDisable={switchValue}
            ind={res.r3_ind}
            onBtnClick={handleRelayBtnClick}
          />
          <Relay
            id="4"
            lable="R4: Bipole"
            btn={res.r4}
            isDisable={switchValue}
            ind={res.r4_ind}
            onBtnClick={handleRelayBtnClick}
          />
          <Relay
            id="5"
            lable="R5: Return Damper"
            btn={res.r5}
            isDisable={switchValue}
            ind={res.r5_ind}
            onBtnClick={handleRelayBtnClick}
          />
          <Relay
            id="6"
            lable="R6: Supply Damper"
            btn={res.r6}
            isDisable={switchValue}
            ind={res.r6_ind}
            onBtnClick={handleRelayBtnClick}
          />
          <Relay
            id="7"
            lable="R7: Air Conditioning"
            btn={res.r7}
            isDisable={switchValue}
            ind={res.r7_ind}
            onBtnClick={handleRelayBtnClick}
          />
          <Relay
            id="8"
            lable="R8: Heat"
            btn={res.r8}
            isDisable={switchValue}
            ind={res.r8_ind}
            onBtnClick={handleRelayBtnClick}
          />
          <ListItem
            sx={{
              padding: "0 1rem",
              display: "flex",
            }}
          >
            <div
              style={{
                display: "flex",
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                sx={{ m: 0, fontSize: "2vh !important", p: 0 }}
                variant="h6"
              >
                MANNUAL
              </Typography>
              <Switch onChange={handleSwitchChange} checked={switchValue} />
              <Typography
                sx={{ m: 0, fontSize: "2vh !important", p: 0 }}
                variant="h6"
              >
                AUTO
              </Typography>
            </div>
            <CircleIcon
              sx={circleStyle}
              htmlColor={res.m_ind === "1" ? "red" : "#00c853"}
            />
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
}
export default Relays;
