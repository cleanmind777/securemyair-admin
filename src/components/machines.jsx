/** @format */

import React, { useContext, useEffect, useState } from 'react';
import Paper from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { Typography } from '@mui/material';
import axios from 'axios';
import { CustomerContext } from '../CustomerContext';
import { MachineContext } from '../MachineContext'; 
import { useNavigate } from 'react-router-dom';

function Machines() {
  const { customerID, setCustomerID } = useContext(CustomerContext);
  const { machineID, setMachineID } = useContext(MachineContext);
  const selectedApiClient = localStorage.getItem('admin_api_client');
  const selectedApi = localStorage.getItem('admin_api');
  const [machines, setMachines] = useState([]);
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = useState(() => (machineID ? machineID : 0));
  useEffect(() => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    if (customerID) {
      axios
        .get("secureMachines.php", {
          params: { cid: customerID },
          cancelToken: source.token,
          headers: { Authorization: token },
        })
        .then((result) => {
          if (result.data.error === "Expired token") {
            localStorage.clear();
            setCustomerID(null);
            navigate("/login");
          }
          setMachines(result.data);
          if (!machineID || selectedApiClient !== customerID) {
            setSelectedIndex(result.data[0].apiToken);
            setMachineID(result.data[0].apiToken);
            localStorage.setItem("admin_api", result.data[0].apiToken);
            localStorage.setItem("admin_api_client", customerID);
          } else if (selectedApiClient === customerID) {
            setSelectedIndex(selectedApi);
            setMachineID(selectedApi);
            localStorage.setItem("admin_api", selectedApi);
            localStorage.setItem("admin_api_client", customerID);
          }
        })
        .catch((error) => console.log(error));
    }
    return () => {
      source.cancel();
    };
  }, [customerID]);
  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
    setMachineID(index);
    localStorage.setItem('admin_api', index);
    localStorage.setItem('admin_api_client', customerID);
  };
  return (
    <div style={{ height: { xs: 'auto', sm: '50%' }, display: 'flex', flexDirection: 'column' }}>
      <Typography
        fontSize={'3.3vh'}
        variant='h4'
        fontWeight={'bold'}
        display={'inline'}
        sx={{ textDecoration: 'Underline', color: 'black', mb: 0.5, ml: 0.5, textAlign: 'left' }}>
        MACHINES
      </Typography>

      <Paper
        sx={{
          flex: 1,
          width: '100%',
          bgcolor: 'background.paper',
          borderRadius: '1vh',
          display: 'flex',
        }}>
          {machines[0]?.length !== 0 ?(
        <List
          component='nav'
          aria-label='secondary'
          sx={{
            flex: 1,
            minHeight: 'auto',
            // height: { xs: 'auto', sm: '43vh' },
            maxHeight: { xs: '300px', sm: '43vh' },
            overflow: 'auto',
            borderRadius: '1vh',
          }}>
          {machines.map(row => {
            return (
              <>
                <ListItemButton
                  sx={{ padding: '0.3rem 1rem' }}
                  divider
                  key={row.apiToken}
                  selected={selectedIndex === row.apiToken}
                  onClick={event => handleListItemClick(event, row.apiToken)}>
                  <ListItemText
                    primary={row.name}
                    key={row.apiToken}
                    sx={{ m: 0, fontSize: '2vh !important' }}
                  />
                </ListItemButton>
              </>
            );
          })}
        </List>):(<Typography sx={{ textAlign: 'center', fontSize: '2vh', margin: '3vh', width: '100%' }}>
            Selected customer has no machine.
          </Typography>)}
      </Paper>
    </div>
  );
}
export default Machines;
