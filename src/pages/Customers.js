/** @format */
import { styled } from '@mui/material/styles';

import {
  Button,
  createTheme,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useMediaQuery,
  Grid,
  LinearProgress,
  CircularProgress
} from '@mui/material';
import MyDialog from '../dialogs/MyDialog';

import { useEffect, useMemo, useState, useContext } from 'react';
import { Box } from '@mui/system';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UpdateCustomersContext } from '../UpdateCustomersContext';
import { CustomerContext } from '../CustomerContext';

let theme = createTheme();

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));
let gRows = [];

const headStyle = {
  color: 'black',
  fontWeight: 'bold',
};
const Customers = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showUser, setShowUser] = useState({ status: false });
  const { updateCustomers, setUpdateCustomers } = useContext(UpdateCustomersContext);
  const [del, setDel] = useState({ id: null, name: '' });
  const [rows, setRows] = useState(gRows);
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [query, setQuery] = useState('');
  const token = localStorage.getItem("authToken");
  const { setCustomerID } = useContext(CustomerContext);


  useEffect(() => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    setIsLoading(true);
    axios
      .get("secureCustomers.php", {
        cancelToken: source.token,
        headers: { Authorization: token },
      })
      .then((result) => {
        if (result.data.error === "Expired token") {
          localStorage.clear();
          setCustomerID(null);
          navigate("/login");
        }
        setRows(result.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
    return () => {
      source.cancel();
    };
  }, [updateCustomers]);
  const handleDel = async id => {
    let formData = new FormData();
    formData.append('toDel', id);
    await axios
      .post('delCustomer.php', formData,{headers:{Authorization:token}})
      .then(result => {
         if (result.data.error === "Expired token") {
           localStorage.clear();
           setCustomerID(null);
           navigate("/login");
         }
        setUpdateCustomers(pre => !pre);
        setShowUser({ status: false });
      })
      .catch(error => console.log(error));
  };
  const filteredRows = useMemo(() => {
    return rows.filter(item => {
      return item.name.toLowerCase().includes(query.toLowerCase());
    });
  }, [query, rows]);

  const handleShow = index => {
    let user = filteredRows[index];
    setShowUser({
      status: true,
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      cName: user.cName,
      cEmail: user.cEmail,
    });
  };
  const handleEdit = index => {
    let user = filteredRows[index];
    navigate('/clients/edit', { state: user });
  };

  return (
    <Grid container spacing={1} sx={{ p: 1 }}>
      {/* Elegant Enhanced Header */}
      <Grid item xs={12}>
        <Paper
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
              background: 'linear-gradient(90deg, transparent, rgba(34,197,94,0.8), rgba(16,185,129,0.8), transparent)',
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
            👥 CUSTOMERS MANAGEMENT
          </Typography>
          <Typography sx={{
            color: '#64748b',
            fontSize: '1rem',
            fontWeight: 500,
            textAlign: 'center'
          }}>
            Manage Customer Accounts & Information
          </Typography>
          
          {/* Loading Bar */}
          {isLoading && (
            <Box sx={{ mt: 2 }}>
              <LinearProgress sx={{
                backgroundColor: 'rgba(34,197,94,0.2)',
                borderRadius: 1,
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(90deg, #22c55e, #16a34a, #15803d)',
                  borderRadius: 1
                }
              }} />
            </Box>
          )}
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Paper
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
        {showUser.status ? (
          <>
            <div
              style={{
                borderBottom: '1px solid black',
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
                  fontSize: '1.2rem',
                  fontWeight: 600,
                  color: '#1e293b',
                }}>
                📋 Customer Details
              </Typography>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Button
                  onClick={() => setShowUser({ status: false })}
                  variant='contained'
                  size='small'
                  sx={{ 
                    background: 'linear-gradient(145deg, #64748b, #475569)',
                    '&:hover': { background: 'linear-gradient(145deg, #475569, #334155)' }
                  }}>
                  Back to List
                </Button>
                <Button
                  type='submit'
                  onClick={() => {
                    setDel({ id: showUser.id, name: showUser.name });
                    return setOpenDialog(true);
                  }}
                  variant='contained'
                  color='error'
                  size='small'>
                  Delete
                </Button>
              </div>
            </div>
            <Table sx={{ fontSize: '1.7vh' }}>
              <TableRow>
                <TableCell sx={headStyle}>Full Name</TableCell>
                <TableCell>{showUser.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={headStyle}>Email</TableCell>
                <TableCell>{showUser.email}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={headStyle}>Phone</TableCell>
                <TableCell>{showUser.phone}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={headStyle}>Company Name</TableCell>
                <TableCell>{showUser.cName}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ color: 'black', fontWeight: 'bold', borderBottom: 0 }}>
                  Company Email
                </TableCell>
                <TableCell sx={{ borderBottom: 0 }}>{showUser.cEmail}</TableCell>
              </TableRow>
            </Table>
          </>
        ) : (
          <>
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
              <TextField
                value={query}
                variant='outlined'
                onChange={e => setQuery(e.target.value)}
                label='Search Customer'
                size='small'
                sx={{
                  display: isMobile ? 'none' : '',
                  bgcolor: 'white',
                  minWidth: '250px',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
              <div style={{ flexGrow: 1 }} />
              <Button
                onClick={() => navigate('/clients/new')}
                variant='contained'
                color='success'
                sx={{ maxWidth: 200 }}>
                Create New Customer
              </Button>
            </div>
            <Table sx={{ fontSize: '1.65vh' }}>
              <TableHead
                sx={{
                  outline: '1px solid black',
                  position: 'sticky',
                  top: '8.1vh',
                  background: 'white',
                  zIndex: 1,
                  borderRadius: '.3em',
                }}>
                <TableRow sx={headStyle}>
                  <TableCell>Ser</TableCell>
                  <TableCell>Full Name</TableCell>
                  <TableCell sx={{ display: isMobile ? 'none' : '' }}>Email</TableCell>
                  <TableCell sx={{ display: isMobile ? 'none' : '' }}>Cell No</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody sx={{ marginTop: '10vh' }}>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} sx={{ textAlign: 'center', py: 8 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <CircularProgress 
                          size={40} 
                          sx={{ 
                            color: 'linear-gradient(45deg, #10b981, #059669)',
                            animation: 'pulse 2s ease-in-out infinite'
                          }} 
                        />
                        <Typography sx={{ 
                          color: '#64748b', 
                          fontSize: '0.9rem',
                          fontWeight: 500
                        }}>
                          Loading customers data...
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : filteredRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} sx={{ textAlign: 'center', py: 8 }}>
                      <Typography sx={{ color: '#64748b', fontSize: '0.9rem' }}>
                        No customers found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRows.map((row, index) => (
                    <StyledTableRow key={row.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell sx={{ display: isMobile ? 'none' : '' }}>{row.email}</TableCell>
                      <TableCell sx={{ display: isMobile ? 'none' : '' }}>{row.phone}</TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: { xs: 'column', sm: 'row' },
                          justifyContent: 'flex-start',
                        }}>
                        <Button
                          onClick={() => handleShow(index)}
                          variant='contained'
                          color='success'
                          sx={{ marginInline: 0.5, height: '20px', width: '50px', mb: '5px' }}>
                          Show
                        </Button>
                        <Button
                          variant='contained'
                          onClick={() => handleEdit(index)}
                          sx={{ marginInline: 0.5, height: '20px', width: '50px', mb: '5px' }}>
                          Edit
                        </Button>
                        {!isMobile && (
                          <Divider orientation='vertical' flexItem sx={{ marginInline: '5px' }} />
                        )}
                        <Button
                          onClick={() => {
                            setDel({ id: row.id, name: row.name });
                            return setOpenDialog(true);
                          }}
                          variant='contained'
                          color='error'
                          sx={{ marginInline: 0.5, height: '20px', width: '50px' }}>
                          Delete
                        </Button>
                      </Box>
                    </TableCell>
                    </StyledTableRow>
                  ))
                )}
              </TableBody>
            </Table>
            {filteredRows.length === 0 && (
              <Typography sx={{ textAlign: 'center', fontSize: '2vh', margin: '4vh' }}>
                No Customer with entered name.
              </Typography>
            )}
          </>
        )}
        </Paper>
      </Grid>
      
      {openDialog && (
        <MyDialog
          title='Alert'
          des={`Are you sure you want to delete ${del.name}?`}
          actions={[
            {
              onClick: () => {
                handleDel(del.id);
                return setOpenDialog(false);
              },
              color: 'error',
              text: 'Delete',
            },
            { onClick: () => setOpenDialog(false), color: 'primary', text: 'Cancel' },
          ]}
        />
      )}
    </Grid>
  );
};

export default Customers;
