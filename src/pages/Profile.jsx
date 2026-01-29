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
import { useNavigate } from 'react-router-dom';
import MyDialog from '../dialogs/MyDialog';
import { CustomerContext } from '../CustomerContext';

let theme = createTheme();
const Profile = () => {
  const { setCustomerID } = useContext(CustomerContext);

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const nameRef = useRef();
  const emailRef = useRef();
  const phoneRef = useRef();
  const usernameRef = useRef();
  const id = localStorage.getItem('admin_id');
  const token = localStorage.getItem("authToken");


  useEffect(() => {
    axios
      .get(`profile.php?id=${id}`, {
        headers: { Authorization: token },
      })
      .then((res) => {
        if (res.data.error === "Expired token") {
          localStorage.clear();
          setCustomerID(null);
          navigate("/login");
        }
        const data = res.data;
        nameRef.current.value = data.name;
        emailRef.current.value = data.email;
        phoneRef.current.value = data.phone;
        usernameRef.current.value = data.username;
      })
      .catch((err) => console.log(err));
  }, []);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const handleSubmit = async e => {
    e.preventDefault();
    let formData = new FormData();

    formData.append('id', id);
    formData.append('name', nameRef.current.value);
    formData.append('email', emailRef.current.value);
    formData.append('phone', phoneRef.current.value);
    formData.append('username', usernameRef.current.value);
    await axios
      .post("profile.php", formData, {
        headers: { Authorization: token },
      })
      .then((result) => {
        if (result.data.error === "Expired token") {
          localStorage.clear();
          setCustomerID(null);
          navigate("/login");
        }
        const res = result.data["res"];
        if (res) {
          nameRef.current.value = "";
          emailRef.current.value = "";
          phoneRef.current.value = "";
          usernameRef.current.value = "";
          setOpen(true);
        }
      })
      .catch((error) => console.log(error));
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
            Update Admin Profile
          </Typography>
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
            <TextField
              autoComplete='off'
              margin='normal'
              inputRef={usernameRef}
              required
              InputLabelProps={{ shrink: true }}
              fullWidth
              label='Admin Username'
              size={isMobile ? 'small' : 'medium'}
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
          des='Admin Detail Edited Successfully.'
          actions={[{ onClick: () => navigate('/'), color: 'primary', text: 'Back to Dashboard' }]}
        />
      )}
    </div>
  );
};

export default Profile;
