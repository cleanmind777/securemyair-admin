/** @format */

import { Grid, Paper, Typography, Box, LinearProgress } from '@mui/material/';
import { styled } from '@mui/material/styles';
import Customers from '../components/Customers';
import MyStepper from '../components/installation/MyStepper';
import { useState } from 'react';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  backgroundColor: 'rgba(0,0,0,0)',
}));

const Installation = () => {
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
              background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.8), rgba(139,92,246,0.8), transparent)',
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
            ⚙️ INSTALLATION WIZARD
          </Typography>
          <Typography sx={{
            color: '#64748b',
            fontSize: '1rem',
            fontWeight: 500,
            textAlign: 'center'
          }}>
            Step-by-Step Device Installation Guide
          </Typography>
          
          {/* Loading Bar */}
          {isLoading && (
            <Box sx={{ mt: 2 }}>
              <LinearProgress sx={{
                backgroundColor: 'rgba(168,85,247,0.2)',
                borderRadius: 1,
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(90deg, #a855f7, #8b5cf6, #7c3aed)',
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
        <Item
          elevation={0}
          sx={{
            height: { xs: 'auto', sm: '85vh' },
            display: 'flex',
            flexDirection: 'column',
            overflow: 'auto',
            p: 2,
            borderRadius: '1vh',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.95) 100%)',
            backdropFilter: 'blur(25px)',
            border: '1px solid rgba(255,255,255,0.4)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
          }}>
          <MyStepper />
        </Item>
      </Grid>
    </Grid>
  );
};

export default Installation;
