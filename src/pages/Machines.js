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
import { useEffect, useMemo, useState, useContext } from 'react';
import { Box } from '@mui/system';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UpdateCustomersContext } from '../UpdateCustomersContext';
import MyDialog from '../dialogs/MyDialog';
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
const MachinesPage = () => {
  const { updateCustomers, setUpdateCustomers } = useContext(UpdateCustomersContext);
  const [isLoading, setIsLoading] = useState(false);
  const [rows, setRows] = useState(gRows);
  const [openDialog, setOpenDialog] = useState(false);
  const [del, setDel] = useState({
    id: null,
    name: '',
  });
  const token = localStorage.getItem("authToken");

  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [query, setQuery] = useState('');
  const { setCustomerID } = useContext(CustomerContext);


  useEffect(() => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    setIsLoading(true);
    axios
      .get("secureMachines.php", {
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
      .post('delMachine.php', formData,{headers: { Authorization: token }})
      .then(result => {
        if (result.data.error === "Expired token") {
          localStorage.clear();
          setCustomerID(null);
          navigate("/login");
        }
        setUpdateCustomers(pre => !pre);
        setDel({ id: null, name: '' });
      })
      .catch(error => console.log(error));
  };
  const filteredRows = useMemo(() => {
    return rows.filter(item => {
      return item.name.toLowerCase().includes(query.toLowerCase());
    });
  }, [query, rows]);

  const handleShow = index => {
    let machine = filteredRows[index];
    navigate('/machines/detail', { state: machine });
  };
  const handleEdit = index => {
    let machine = filteredRows[index];

    navigate('/machines/edit', { state: machine });
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
              background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.8), rgba(14,165,233,0.8), transparent)',
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
            🏭 MACHINES MANAGEMENT
          </Typography>
          <Typography sx={{
            color: '#64748b',
            fontSize: '1rem',
            fontWeight: 500,
            textAlign: 'center'
          }}>
            Manage Air Quality Monitoring Devices
          </Typography>
          
          {/* Loading Bar */}
          {isLoading && (
            <Box sx={{ mt: 2 }}>
              <LinearProgress sx={{
                backgroundColor: 'rgba(59,130,246,0.2)',
                borderRadius: 1,
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(90deg, #3b82f6, #0ea5e9, #06b6d4)',
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
            label='Search Machine'
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
            onClick={() => navigate('/machines/new')}
            variant='contained'
            color='success'
            sx={{ maxWidth: 200 }}>
            Create New Machine
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
              <TableCell>Name</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell sx={{ display: isMobile ? 'none' : '' }}>Location</TableCell>
              <TableCell sx={{ display: isMobile ? 'none' : '' }}>ApiToken</TableCell>
              <TableCell sx={{ display: isMobile ? 'none' : '' }}>Inspection Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ marginTop: '10vh' }}>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} sx={{ textAlign: 'center', py: 8 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <CircularProgress 
                      size={40} 
                      sx={{ 
                        color: 'linear-gradient(45deg, #3b82f6, #1d4ed8)',
                        animation: 'pulse 2s ease-in-out infinite'
                      }} 
                    />
                    <Typography sx={{ 
                      color: '#64748b', 
                      fontSize: '0.9rem',
                      fontWeight: 500
                    }}>
                      Loading machines data...
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : filteredRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} sx={{ textAlign: 'center', py: 8 }}>
                  <Typography sx={{ color: '#64748b', fontSize: '0.9rem' }}>
                    No machines found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredRows.map((row, index) => (
                <StyledTableRow key={row.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.cName}</TableCell>
                  <TableCell sx={{ display: isMobile ? 'none' : '' }}>{row.location}</TableCell>
                  <TableCell sx={{ display: isMobile ? 'none' : '' }}>{row.apiToken}</TableCell>
                  <TableCell sx={{ display: isMobile ? 'none' : '' }}>{row.date}</TableCell>
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
                      sx={{
                        marginInline: { xs: 0, sm: 0.5 },
                        height: '20px',
                        width: '50px',
                        mb: '5px',
                      }}>
                      Show
                    </Button>
                    <Button
                      variant='contained'
                      onClick={() => handleEdit(index)}
                      sx={{
                        marginInline: { xs: 0, sm: 0.5 },
                        height: '20px',
                        width: '50px',
                        mb: '5px',
                      }}>
                      Edit
                    </Button>
                    {!isMobile && (
                      <Divider orientation='vertical' flexItem sx={{ marginInline: '5px' }} />
                    )}
                    <Button
                      onClick={() => {
                        // setDelid(row.id);
                        setDel({ id: row.id, name: row.name });
                        return setOpenDialog(true);
                      }}
                      variant='contained'
                      color='error'
                      sx={{ marginInline: { xs: 0, sm: 0.5 }, height: '20px', width: '50px' }}>
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
            No Machine with entered name.
          </Typography>
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

export default MachinesPage;
