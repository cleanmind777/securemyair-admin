/** @format */

import {
  Box,
  Button,
  createTheme,
  Paper,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import axios from 'axios';
import { useContext, useState } from 'react';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import MyDialog from '../dialogs/MyDialog';
import { UpdateCustomersContext } from '../UpdateCustomersContext';
import { CustomerContext } from '../CustomerContext';

let theme = createTheme();
const AddCustomer = () => {
  const [open, setOpen] = useState(false);
  const nameRef = useRef();
  const emailRef = useRef();
  const phoneRef = useRef();
  const pwdRef = useRef();

  const cNameRef = useRef();
  const cEmailRef = useRef();
  const cIdRef = useRef();
  const cPwdRef = useRef();

  const { setUpdateCustomers } = useContext(UpdateCustomersContext);
  const { setCustomerID } = useContext(CustomerContext);
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const handleSubmit = async e => {
    e.preventDefault();
    let formData = new FormData();
  const token = localStorage.getItem("authToken");

    formData.append('name', nameRef.current.value);
    formData.append('email', emailRef.current.value);
    formData.append('phone', phoneRef.current.value);
    formData.append('pwd', pwdRef.current.value);
    formData.append('companyName', cNameRef.current.value);
    formData.append('companyEmail', cEmailRef.current.value);
    formData.append('companyId', cIdRef.current.value);
    formData.append('companyPwd', cPwdRef.current.value);

    await axios
      .post('addCustomer.php', formData,{headers:{Authorization:token}})
      .then(result => {
        if (result.data.error === "Expired token") {
          localStorage.clear();
          setCustomerID(null);
          navigate("/login");
        }
        const res = result.data['res'];
        if (res === 'true') {
          nameRef.current.value = '';
          emailRef.current.value = '';
          phoneRef.current.value = '';
          pwdRef.current.value = '';
          cNameRef.current.value = '';
          cEmailRef.current.value = '';
          cIdRef.current.value = '';
          cPwdRef.current.value = '';
          setUpdateCustomers(pre => !pre);
          setOpen(true);
        } else {
          alert('New Customer is not added. Make sure Customer email is not already added.');
        }
      })
      .catch(error => console.log(error));
  };
  return (
    <div className='centerTable'>
      <Paper sx={{ p: 2, width: '95%', pt: 0, overflow: 'auto', maxHeight: '93vh' }}>
        <div
          style={{
            background: 'white',
            position: 'sticky',
            height: '8vh',
            zIndex: '1',
            top: 0,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}>
          <Typography
            pl={1}
            display={'inline'}
            sx={{
              fontSize: '2.3vh',

              fontWeight: 'bold',
              color: 'black',
            }}>
            Add New Customer
          </Typography>
          <Button onClick={() => navigate('/clients')} variant='contained' sx={{ maxWidth: 200 }}>
            Back to List
          </Button>
        </div>
        <Box component='form' onSubmit={handleSubmit}>
          <div className='formContainer'>
            <Typography
              pl={1}
              display={'inline'}
              sx={{
                fontSize: '2vh',
                fontWeight: 'bold',
                color: 'black',
              }}>
              Customer Details
            </Typography>
            <TextField
              autoComplete='off'
              margin='normal'
              inputRef={nameRef}
              required
              fullWidth
              label='Full Name'
              autoFocus
              size={isMobile ? 'small' : 'medium'}
            />
            <TextField
              margin='normal'
              type='email'
              inputRef={emailRef}
              required
              fullWidth
              label='Email'
              size={isMobile ? 'small' : 'medium'}
            />
            <TextField
              autoComplete='off'
              margin='normal'
              inputRef={phoneRef}
              required
              fullWidth
              label='Phone No'
              size={isMobile ? 'small' : 'medium'}
            />
            <TextField
              inputProps={{
                autoComplete: 'new-password',
              }}
              autoComplete='off'
              margin='normal'
              inputRef={pwdRef}
              required
              fullWidth
              label='Password'
              type='password'
              size={isMobile ? 'small' : 'medium'}
            />
          </div>
          <div className='formContainer'>
            <Typography
              pl={1}
              display={'inline'}
              sx={{
                fontSize: '2vh',
                fontWeight: 'bold',
                color: 'black',
              }}>
              Installation Company Details
            </Typography>
            <TextField
              autoComplete='off'
              margin='normal'
              inputRef={cNameRef}
              required
              fullWidth
              label='Company Name'
              size={isMobile ? 'small' : 'medium'}
            />
            <TextField
              autoComplete='off'
              margin='normal'
              inputRef={cEmailRef}
              required
              fullWidth
              label='Company Email'
              size={isMobile ? 'small' : 'medium'}
            />
            <TextField
              margin='normal'
              size={isMobile ? 'small' : 'medium'}
              inputRef={cIdRef}
              required
              fullWidth
              label='Company Username'
            />

            <TextField
              inputProps={{
                autoComplete: 'new-password',
              }}
              autoComplete='off'
              margin='normal'
              inputRef={cPwdRef}
              required
              fullWidth
              label='Password'
              type='password'
              size={isMobile ? 'small' : 'medium'}
            />
          </div>
          <Button
            type='submit'
            variant='contained'
            sx={{ maxWidth: 200, ml: '1vh', mt: '1vh' }}
            color='success'>
            Create Customer
          </Button>
        </Box>
      </Paper>
      {open && (
        <MyDialog
          title='Success'
          des='New Customer is added Successful.'
          actions={[
            { onClick: () => navigate('/clients'), color: 'primary', text: 'Back to List' },
            { onClick: () => setOpen(false), color: 'success', text: 'Create New' },
          ]}
        />
      )}
    </div>
  );
};

export default AddCustomer;
