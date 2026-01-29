/** @format */

import { Alert, AlertTitle, Button, DialogContent, TextField } from '@mui/material';
import axios from 'axios';
import React, { useRef, useState } from 'react';

export const Code = ({ next, email }) => {
  const [isLoading, setLoading] = useState(false);
  const ref = useRef();
  const [codeError, setCodeError] = useState(false);
  const handleSubmit = async e => {
    e.preventDefault();
    codeError && setCodeError(false);
    setLoading(true);
    let fd = new FormData();
    fd.append('code', ref.current.value);
    fd.append('codeEmail', email);
    await axios
      .post('reset.php', fd)
      .then(res => {
        if (res.data.res) {
          next(pre => pre + 1);
        } else {
          setCodeError(true);
          setLoading(false);
        }
      })
      .catch(err => {
        setCodeError(true);
        setLoading(false);
        console.log(err);
      });
  };
  return (
    <DialogContent className='box' dividers>
      <Alert severity='success'>
        <AlertTitle>Success</AlertTitle>
        Check your email {email} for a verification code to reset your password.
      </Alert>
      <form onSubmit={handleSubmit}>
        <TextField
          error={codeError && true}
          type='number'
          autoFocus
          inputRef={ref}
          margin='normal'
          fullWidth
          label='6 digit code'
          required
          helperText={codeError && 'Invalid Verification Code'}
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
    </DialogContent>
  );
};
