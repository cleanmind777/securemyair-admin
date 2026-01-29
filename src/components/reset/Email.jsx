/** @format */

import { 
  Button, 
  DialogContent, 
  TextField, 
  Typography, 
  Box, 
  CircularProgress,
  InputAdornment
} from '@mui/material';
import { Email as EmailIcon } from '@mui/icons-material';
import axios from 'axios';
import { useRef, useState } from 'react';

const Email = ({ next, email }) => {
  const [isLoading, setLoading] = useState(false);
  const emailRef = useRef();
  const [emailError, setEmailError] = useState(false);
  
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    emailError && setEmailError(false);
    let fd = new FormData();
    fd.append('email', emailRef.current.value);
    await axios
      .post('reset.php', fd)
      .then(res => {
        // console.log(res.data);
        if (res.data.res === 'true') {
          email(emailRef.current.value);
          next(pre => pre + 1);
        } else {
          setEmailError(true);
          setLoading(false);
        }
      })
      .catch(err => {
        setEmailError(true);
        setLoading(false);
        console.log(err);
      });
  };
  
  return (
    <DialogContent sx={{ px: 4, pb: 4 }}>
      <Box component='form' onSubmit={handleSubmit}>
        <TextField
          error={emailError}
          type='email'
          inputRef={emailRef}
          required
          fullWidth
          label='Email Address'
          autoComplete='email'
          autoFocus
          helperText={emailError ? 'This email address is not registered' : 'Enter the email associated with your account'}
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
        />
        
        <Button
          disabled={isLoading}
          type='submit'
          fullWidth
          variant='contained'
          size='large'
          sx={{ mb: 1 }}
        >
          {isLoading ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
              Sending Code...
            </Box>
          ) : (
            'Send Reset Code'
          )}
        </Button>
        
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 1 }}>
          You'll receive a 6-digit verification code via email
        </Typography>
      </Box>
    </DialogContent>
  );
};

export default Email;
