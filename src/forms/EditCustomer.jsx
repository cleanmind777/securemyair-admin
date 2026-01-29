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
import { useEffect } from 'react';
import { useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import MyDialog from '../dialogs/MyDialog';
import { UpdateCustomersContext } from '../UpdateCustomersContext';
import { CustomerContext } from '../CustomerContext';

let theme = createTheme();
const EditCustomer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const nameRef = useRef();
  const emailRef = useRef();
  const phoneRef = useRef();
  const cNameRef = useRef();
  const cIdRef = useRef();
  const cEmailRef = useRef();
  const { setUpdateCustomers } = useContext(UpdateCustomersContext);
const token = localStorage.getItem("authToken");
  const { setCustomerID } = useContext(CustomerContext);
  const user = location.state;

  useEffect(() => {
    nameRef.current.value = user.name;
    emailRef.current.value = user.email;
    phoneRef.current.value = user.phone;
    cNameRef.current.value = user.cName;
    cIdRef.current.value = user.cId;
    cEmailRef.current.value = user.cEmail;
  }, []);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const handleSubmit = async e => {
    e.preventDefault();
    let formData = new FormData();

    formData.append('id', user.id);
    formData.append('name', nameRef.current.value);
    formData.append('email', emailRef.current.value);
    formData.append('phone', phoneRef.current.value);
    formData.append('cName', cNameRef.current.value);
    formData.append('cId', cIdRef.current.value);
    formData.append('cEmail', cEmailRef.current.value);

    await axios
      .post("editCustomer.php", formData, { headers: { Authorization: token } })
      .then((result) => {
         if (result.data.error === "Expired token") {
           localStorage.clear();
           setCustomerID(null);
           navigate("/login");
         }
        const res = result.data["res"];
        if (res === "true") {
          nameRef.current.value = "";
          emailRef.current.value = "";
          phoneRef.current.value = "";
          cNameRef.current.value = "";
          cIdRef.current.value = "";
          cEmailRef.current.value = "";
          setUpdateCustomers((pre) => !pre);
          setOpen(true);
        } else {
          console.log("New Customer is not added");
        }
      })
      .catch((error) => console.log(error));
  };
  const handleBack = () => {
    return navigate('/clients');
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
            Edit Customer Detail
          </Typography>
          <Button onClick={handleBack} variant='contained' sx={{ maxWidth: 200 }}>
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
              InputLabelProps={{ shrink: true }}
              label='Full Name'
              autoFocus
              size={isMobile ? 'small' : 'medium'}
            />
            <TextField
              margin='normal'
              type='email'
              inputRef={emailRef}
              required
              InputLabelProps={{ shrink: true }}
              fullWidth
              label='Email'
              size={isMobile ? 'small' : 'medium'}
            />
            <TextField
              autoComplete='off'
              margin='normal'
              inputRef={phoneRef}
              required
              InputLabelProps={{ shrink: true }}
              fullWidth
              label='Phone No'
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
              InputLabelProps={{ shrink: true }}
              fullWidth
              label='Installation Company Name'
              size={isMobile ? 'small' : 'medium'}
            />
            <TextField
              margin='normal'
              size={isMobile ? 'small' : 'medium'}
              inputRef={cIdRef}
              required
              InputLabelProps={{ shrink: true }}
              fullWidth
              label='Company Username'
            />
            <TextField
              margin='normal'
              size={isMobile ? 'small' : 'medium'}
              inputRef={cEmailRef}
              required
              InputLabelProps={{ shrink: true }}
              fullWidth
              label='Company Email'
            />
          </div>
          <Button
            type='submit'
            variant='contained'
            sx={{ maxWidth: 200, ml: '1vh', mt: '1vh' }}
            color='success'>
            Update
          </Button>
        </Box>
      </Paper>
      {open && (
        <MyDialog
          title='Success Update'
          des='Customer Detail Edited Successfully.'
          actions={[{ onClick: handleBack, color: 'primary', text: 'Back to List' }]}
        />
      )}
    </div>
  );
};

export default EditCustomer;
