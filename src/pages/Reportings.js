/** @format */

import React, { useContext, useState } from 'react';
import { Grid, Paper, Typography, Box, LinearProgress } from '@mui/material/';
import { styled } from '@mui/material/styles';
import Customers from '../components/Customers';
import Main from '../components/reportings/Main';
import { MachineContext } from '../MachineContext';
import { CustomerContext } from '../CustomerContext';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  backgroundColor: 'rgba(0,0,0,0)',
}));

const Reportings = () => {
  const { machineID } = useContext(MachineContext);
  const { customerID } = useContext(CustomerContext);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Grid container spacing={1} sx={{ p: 1 }}>
      {/* Elegant Enhanced Header */}
      <Grid item xs={12}>
        <Item
          elevation={0}
          sx={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.95) 100%)',
            backdropFilter: 'blur(25px)',
            border: '1px solid rgba(255,255,255,0.4)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
            borderRadius: '1vh',
            p: 2,
            mb: 1,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.8), rgba(16,185,129,0.8), transparent)',
              borderRadius: '1vh 1vh 0 0'
            }
          }}>
          <Typography variant='h4' sx={{
            fontWeight: 800,
            color: '#1e293b',
            textAlign: 'center',
            mb: 0.5,
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            📊 REPORTS & TRENDS
          </Typography>
          <Typography sx={{
            color: '#64748b',
            fontSize: '1rem',
            fontWeight: 500,
            textAlign: 'center'
          }}>
            Advanced Analytics & Data Insights Dashboard
          </Typography>
          
          {/* Loading Bar */}
          {isLoading && (
            <Box sx={{ mt: 2 }}>
              <LinearProgress sx={{
                backgroundColor: 'rgba(59,130,246,0.2)',
                borderRadius: 1,
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(90deg, #3b82f6, #06b6d4, #10b981)',
                  borderRadius: 1
                }
              }} />
            </Box>
          )}
        </Item>
      </Grid>

      <Grid item xs={12} md={4} lg={3}>
        <Item
          elevation={0}
          sx={{
            height: { xs: 'auto', sm: '85vh' },
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
          <Customers onSelectionChange={(loading) => setIsLoading(loading)} />
        </Item>
      </Grid>
      
      <Grid item xs={12} md={8} lg={9}>
        {machineID ? (
          <Item
            elevation={0}
            sx={{
              height: { xs: 'auto', sm: '85vh' },
              display: 'flex',
              flexDirection: 'column',
              overflow: 'auto',
              p: 1,
              borderRadius: '1vh',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.95) 100%)',
              backdropFilter: 'blur(25px)',
              border: '1px solid rgba(255,255,255,0.4)',
              boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
            }}>
            <Main onLoadingChange={(loading) => setIsLoading(loading)} />
          </Item>
        ) : (
          <Item
            elevation={0}
            sx={{
              height: { xs: 'auto', sm: '85vh' },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              p: 4,
              borderRadius: '1vh',
              background: 'linear-gradient(135deg, rgba(254,242,242,0.98) 0%, rgba(255,245,245,0.95) 100%)',
              backdropFilter: 'blur(25px)',
              border: '1px solid rgba(254,226,226,0.4)',
              boxShadow: '0 12px 40px rgba(239,68,68,0.1)',
            }}>
            <Typography sx={{
              color: '#dc2626',
              fontSize: '1.5rem',
              fontWeight: 700,
              mb: 2,
              textAlign: 'center'
            }}>
              🚨 No Machine Selected
            </Typography>
            <Typography sx={{
              color: '#6b7280',
              fontSize: '1rem',
              textAlign: 'center'
            }}>
              Please select a customer to view their machine reports and analytics
            </Typography>
          </Item>
        )}
      </Grid>
    </Grid>
  );
};

export default Reportings;
