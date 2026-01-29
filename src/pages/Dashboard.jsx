/** @format */

import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import classe from '../index.css';
import Customers from '../components/Customers.jsx';
import CDashboard from '../components/CDashboard';
import Relays from '../components/Relays';
import Sensors from '../components/Sensors';
import TestSystem from '../components/TestSystem';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  backgroundColor: 'rgba(0,0,0,0)',
}));
function DashboardPage() {
  return (
    <Grid className={classe.mainContet} container spacing={1} columns={12}>
      <Grid pl={0} item xs={12} md={4} lg={2}>
        <Item
          elevation={0}
          sx={{
            height: { xs: 'auto', sm: '97.51vh' },
            display: 'flex',
            flexDirection: 'column',
            overflow: 'auto',
            padding: 0,
            borderRadius: '1vh',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.9) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.3)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          }}>
          <Customers />
        </Item>
      </Grid>
      <Grid item xs={12} md={8} lg={4}>
        <Item
          elevation={0}
          sx={{
            display: 'flex',
            height: { xs: 'auto', sm: '97.51vh' },
            p: 1,
            overflow: 'hidden',
            fontSize: '2vh',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.95) 100%)',
            backdropFilter: 'blur(25px)',
            border: '1px solid rgba(255,255,255,0.4)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
            borderRadius: '1vh',
          }}>
          <CDashboard />
        </Item>
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        <Item
          elevation={0}
          sx={{
            p: 1.5,
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            height: { xs: 'auto', sm: '97.51vh' },
            background: 'linear-gradient(145deg, rgba(216, 212, 236, 0.95) 0%, rgba(248,250,252,0.9) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(226,232,240,0.5)',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          }}>
          <Relays />
          <TestSystem />
        </Item>
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        <Item
          elevation={0}
          sx={{
            height: { xs: '650px', sm: '97.51vh' },
            p: 1.5,
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.9) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(226,232,240,0.5)',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          }}>
          <Sensors />
        </Item>
      </Grid>
    </Grid>
  );
}

export default DashboardPage;
