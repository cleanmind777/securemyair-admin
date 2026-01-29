/** @format */

import {
  Alert,
  AlertTitle,
  Box,
  Button,
  DialogActions,
  DialogContent,
  TextField,
  Typography,
} from '@mui/material';
import axios from 'axios';
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NewPass = ({ email }) => {
  const [user, setUser] = useState();
  const [msg, setMsg] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const ref = useRef();
  const cRef = useRef();
  const [passError, setPassError] = useState(false);
  const handleSubmit = async e => {
    e.preventDefault();
    if (ref.current.value === cRef.current.value) {
      msg && setMsg(false);
      setLoading(true);
      let fd = new FormData();
      fd.append('password', ref.current.value);
      fd.append('passEmail', email);
      await axios
        .post('reset.php', fd)
        .then(res => {
          if (res.data.res) {
            localStorage.setItem('admin_id', res.data.id);
            localStorage.setItem('admin_name', res.data.name);
            setUser(res.data.username);
          } else {
            setPassError(true);
            setLoading(false);
          }
        })
        .catch(err => {
          setPassError(true);
          setLoading(false);
          console.log(err);
        });
    } else {
      setMsg(true);
    }
  };

  const handleChange = e => {
    e.target.value !== cRef.current.value ? setPassError(true) : setPassError(false);
  };

  return (
    <>
      <DialogContent className='box' dividers>
        {!user ? (
          <>
            <Alert severity='success'>
              <AlertTitle>Success</AlertTitle>
              Your email is verified. Please enter your new password
            </Alert>
            <form onSubmit={handleSubmit}>
              <TextField
                autoFocus
                inputRef={cRef}
                margin='normal'
                fullWidth
                label='Enter New Password'
                required
              />
              <TextField
                error={passError && true}
                inputRef={ref}
                margin='normal'
                onChange={handleChange}
                fullWidth
                label='Confirm New Password'
                required
                helperText={msg && 'The password did not match'}
              />
              <Button
                disabled={isLoading}
                type='submit'
                fullWidth
                variant='contained'
                sx={{ mt: 1, mb: 2 }}>
                {!isLoading ? 'Reset Password' : 'Submitting...'}
              </Button>
            </form>
          </>
        ) : (
          <>
            <Alert severity='success'>
              <AlertTitle>Success</AlertTitle>
              Your Password is Changed Successfully.
            </Alert>
            <Box sx={{ p: 2 }}>
              <Typography>Username: {user}</Typography>
              <Typography>Password: {ref.current.value}</Typography>
            </Box>
          </>
        )}
      </DialogContent>

      {user && (
        <DialogActions>
          <Button variant='contained' onClick={() => navigate('/')}>
            Go to Dashboard
          </Button>
        </DialogActions>
      )}
    </>
  );
};

export default NewPass;
