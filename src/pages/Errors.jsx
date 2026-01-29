/** @format */

import React, { useContext, useEffect } from 'react';
import { Grid, Paper, Typography, Tabs, Tab, Box } from '@mui/material/';
import { styled } from '@mui/material/styles';
import Customers from '../components/Customers';
import { ErrorsLog, ErrorsHistory } from '../components/errors';
import { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { CustomerContext } from '../CustomerContext';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}>
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));
const Errors = () => {
  const { customerID } = useContext(CustomerContext);
  const [hasMachines, setHasMachines] = useState(false);
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  useEffect(() => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    axios
      .get(`errors/log.php?cid=${customerID}&isMachines=true`, { cancelToken: source.token })
      .then(res => setHasMachines(res.data.res))
      .catch(err => console.log(err));
    return () => {
      source.cancel();
    };
  }, [customerID]);

  return (
    <Grid container spacing={0.5} sx={{ p: 1 }}>
      <Grid item xs={12} md={5} lg={3}>
        <Item>
          <Customers />
        </Item>
      </Grid>
      <Grid item xs={12} md={7} lg={9}>
        <Typography
          fontWeight={'bold'}
          sx={{
            textDecoration: 'Underline',
            textAlign: 'center',
            color: 'black',
            mb: 0.5,
            fontSize: '3.3vh!important',
          }}>
          Errors in PLC
        </Typography>
        <Item>
          {hasMachines ? (
            <Box sx={{ width: '100%' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange}>
                  <Tab sx={{ fontSize: 17 }} label='Errors Log' />
                  <Tab sx={{ fontSize: 17 }} label='Errors History' />
                </Tabs>
              </Box>
              <TabPanel value={value} index={0}>
                <ErrorsLog />
              </TabPanel>
              <TabPanel value={value} index={1}>
                <ErrorsHistory />
              </TabPanel>
            </Box>
          ) : (
            <Typography
              sx={{
                paddingBlock: 2,
                color: 'rgba(0,0,0,0.8)',
                border: '2px solid black',
                borderRadius: 2,
              }}>
              No Machine is added for selected Customer
            </Typography>
          )}
        </Item>
      </Grid>
    </Grid>
  );
};

export default Errors;
