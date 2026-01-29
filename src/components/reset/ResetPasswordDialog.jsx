/** @format */

import { 
  Dialog, 
  DialogTitle, 
  createTheme, 
  ThemeProvider, 
  Box, 
  Typography, 
  IconButton,
  Fade
} from '@mui/material';
import { Close } from '@mui/icons-material';
import Email from './Email';
import { useState } from 'react';
import { Code } from './Code';
import NewPass from './NewPass';

let theme = createTheme({
  typography: { 
    button: { textTransform: 'none' },
    h6: { fontWeight: 600 }
  },
  shape: { borderRadius: 20 },
  components: {
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.2)',
          boxShadow: '0 25px 50px rgba(0,0,0,0.15)'
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: 'rgba(255,255,255,0.8)',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.9)',
              transform: 'translateY(-1px)',
            },
            '&.Mui-focused': {
              backgroundColor: 'rgba(255,255,255,0.95)',
              transform: 'translateY(-1px)',
            }
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          paddingBlock: 12,
          fontWeight: 600,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
            transform: 'translateY(-1px)',
            boxShadow: '0 8px 25px rgba(102,126,234,0.3)'
          }
        }
      }
    }
  }
});

export default function MyDialog() {
  const [page, setPage] = useState(1);
  const [email, setEmail] = useState();
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    // You might want to call a parent callback here to close the dialog
  };

  const getTitle = () => {
    switch(page) {
      case 1: return 'Reset Your Password';
      case 2: return 'Verify Your Email';
      case 3: return 'Create New Password';
      default: return 'Reset Password';
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Dialog 
        open={open} 
        maxWidth="sm" 
        fullWidth
        TransitionComponent={Fade}
        transitionDuration={400}
      >
        <Box sx={{ position: 'relative', p: 2 }}>
          <IconButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'text.secondary',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.04)',
                transform: 'scale(1.1)'
              }
            }}
          >
            <Close />
          </IconButton>
          
          <DialogTitle sx={{ 
            textAlign: 'center', 
            pb: 1,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            {getTitle()}
          </DialogTitle>
          
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ textAlign: 'center', mb: 2, px: 2 }}
          >
            {page === 1 && "We'll send you a verification code to reset your password"}
            {page === 2 && "Enter the 6-digit code sent to your email"}
            {page === 3 && "Choose a strong password to secure your account"}
          </Typography>
        </Box>
        
        {page === 1 ? (
          <Email next={setPage} email={setEmail} />
        ) : page === 2 ? (
          <Code email={email} next={setPage} />
        ) : (
          <NewPass email={email} next={setPage} />
        )}
      </Dialog>
    </ThemeProvider>
  );
}
