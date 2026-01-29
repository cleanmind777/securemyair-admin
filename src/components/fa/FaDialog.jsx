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
} from "@mui/material";
import { Close, Security } from "@mui/icons-material";
import { useState } from "react";
import { Code } from "./Code";

let theme = createTheme({
  typography: { 
    button: { textTransform: "none" },
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
            fontSize: '1.2rem',
            textAlign: 'center',
            '& input': {
              textAlign: 'center',
              fontSize: '1.4rem',
              fontWeight: 600,
              letterSpacing: '0.5rem'
            },
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
          background: 'linear-gradient(135deg, #059669 0%, #3b82f6 50%, #8b5cf6 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 50%, #059669 100%)',
            transform: 'translateY(-1px)',
            boxShadow: '0 8px 25px rgba(59,130,246,0.3)'
          }
        }
      }
    }
  }
});

export default function MyDialog({email}) {
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    // You might want to call a parent callback here to close the dialog
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
          
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <Security sx={{ 
              color: '#3b82f6', 
              fontSize: '2rem', 
              mr: 1,
              background: 'linear-gradient(135deg, #059669 0%, #3b82f6 50%, #8b5cf6 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }} />
            <DialogTitle sx={{ 
              textAlign: 'center', 
              pb: 0,
              background: 'linear-gradient(135deg, #059669 0%, #3b82f6 50%, #8b5cf6 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Security Verification
            </DialogTitle>
          </Box>
          
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ textAlign: 'center', mb: 2, px: 2 }}
          >
            We've sent a 6-digit verification code to secure your login
          </Typography>
        </Box>
        
        <Code email={email} />
      </Dialog>
    </ThemeProvider>
  );
}
