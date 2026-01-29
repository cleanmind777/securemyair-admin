/** @format */

import { useState, useContext, useMemo, useEffect } from 'react';
import {
  Box,
  Card,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Collapse,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Avatar,
  Chip,
  Divider,
  Badge
} from '@mui/material';
import {
  Search,
  Clear,
  Business,
  ExpandMore,
  ChevronRight,
  DeviceHub,
  CheckCircle,
  Error as ErrorIcon,
  Sensors,
  FilterList,
  AccountTree
} from '@mui/icons-material';
import axios from 'axios';
import { CustomerContext } from '../CustomerContext';
import { MachineContext } from '../MachineContext';
import { UpdateCustomersContext } from '../UpdateCustomersContext';
import { useNavigate } from 'react-router-dom';

function Customers({ onSelectionChange }) {
  const { updateCustomers } = useContext(UpdateCustomersContext);
  const { customerID, setCustomerID } = useContext(CustomerContext);
  const { machineID, setMachineID } = useContext(MachineContext);
  
  const [customers, setCustomers] = useState([]);
  const [allMachines, setAllMachines] = useState({});
  const [selectedCustomer, setSelectedCustomer] = useState(() => customerID);
  const [selectedMachine, setSelectedMachine] = useState(() => machineID);
  const [expandedCustomers, setExpandedCustomers] = useState(new Set());
  const [query, setQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all'); // all, online, offline
  
  const token = localStorage.getItem('authToken');
  const navigate = useNavigate();
  // Fetch customers
  useEffect(() => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    axios
      .get("secureCustomers.php", {
        cancelToken: source.token,
        headers: { Authorization: token },
      })
      .then((result) => {
        if(result.data.error === "Expired token"){
         localStorage.clear();
         setCustomerID(null);
         navigate("/login");
        }
        setCustomers(result.data);
        if (!customerID) {
          setCustomerID(result.data[0]?.id);
          setSelectedCustomer(result.data[0]?.id);
          localStorage.setItem("admin_client", result.data[0]?.id);
        } else {
          setCustomerID(customerID);
          setSelectedCustomer(customerID);
          localStorage.setItem("admin_client", customerID);
        }
        
        // Fetch machines for each customer
        result.data.forEach(customer => {
          fetchCustomerMachines(customer.id);
        });
      })
      .catch((error) => console.log(error));
    return () => {
      source.cancel();
    };
  }, [updateCustomers]);

  // Fetch machines for a specific customer
  const fetchCustomerMachines = async (customerId) => {
    try {
      const result = await axios.get("secureMachines.php", {
        params: { cid: customerId },
        headers: { Authorization: token },
      });
      
      if (result.data.error === "Expired token") {
        localStorage.clear();
        setCustomerID(null);
        navigate("/login");
        return;
      }
      
      setAllMachines(prev => ({
        ...prev,
        [customerId]: result.data || []
      }));
    } catch (error) {
      console.log(error);
      setAllMachines(prev => ({
        ...prev,
        [customerId]: []
      }));
    }
  };

  // Handle customer selection
  const handleCustomerClick = (customerId) => {
    setSelectedCustomer(customerId);
    setCustomerID(customerId);
    localStorage.setItem('admin_client', customerId);
  };

  // Handle customer expand/collapse
  const handleCustomerToggle = (customerId) => {
    const newExpanded = new Set(expandedCustomers);
    if (newExpanded.has(customerId)) {
      newExpanded.delete(customerId);
    } else {
      newExpanded.add(customerId);
    }
    setExpandedCustomers(newExpanded);
  };

  // Handle machine selection
  const handleMachineClick = (machine, customerId) => {
    // Trigger loading state
    if (onSelectionChange) {
      onSelectionChange(true);
    }
    
    setSelectedMachine(machine.apiToken);
    setSelectedCustomer(customerId);
    setCustomerID(customerId);
    setMachineID(machine.apiToken);
    localStorage.setItem('admin_client', customerId);
    localStorage.setItem('admin_machine', machine.apiToken);
    
    // End loading state after a brief delay
    setTimeout(() => {
      if (onSelectionChange) {
        onSelectionChange(false);
      }
    }, 500);
  };

  // Get status icon for machines
  const getStatusIcon = (machine) => {
    // This is a placeholder - you can implement actual status logic
    const isOnline = Math.random() > 0.3; // Simulated status
    return isOnline ? 
      <CheckCircle sx={{ color: '#10b981', fontSize: '1rem' }} /> :
      <ErrorIcon sx={{ color: '#ef4444', fontSize: '1rem' }} />;
  };

  // Filter customers based on search query
  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => {
      const matchesSearch = customer.name.toLowerCase().includes(query.toLowerCase());
      
      // Also search in machine names if query exists
      if (query && allMachines[customer.id]) {
        const machineMatch = allMachines[customer.id].some(machine => 
          (machine.name && machine.name.toLowerCase().includes(query.toLowerCase())) ||
          (machine.apiToken && machine.apiToken.toLowerCase().includes(query.toLowerCase()))
        );
        return matchesSearch || machineMatch;
      }
      
      return matchesSearch;
    });
  }, [query, customers, allMachines]);
  return (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      p: 1,
      gap: 1
    }}>
      {/* Header with Search */}
      <Card
        elevation={searchFocused ? 2 : 0}
        sx={{
          background: 'linear-gradient(145deg, rgba(248,250,252,0.85) 0%, rgba(241,245,249,0.9) 100%)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(226,232,240,0.6)',
          borderRadius: 1.5,
          transition: 'all 0.3s ease',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            transform: 'translateY(-0.5px)'
          }
        }}
      >
        <Box sx={{ p: 1.2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.2 }}>
            <Avatar sx={{ 
              width: 28, 
              height: 28,
              background: 'linear-gradient(135deg, rgba(99,102,241,0.8) 0%, rgba(34,197,94,0.8) 100%)',
              boxShadow: '0 2px 8px rgba(99,102,241,0.2)'
            }}>
              <AccountTree sx={{ fontSize: '0.9rem', color: 'white' }} />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 600, 
                color: 'rgba(30,41,59,0.95)', 
                fontSize: '1.1rem',
                letterSpacing: '0.02em'
              }}>
                Customer Tree
              </Typography>
              <Typography variant="body2" sx={{ 
                opacity: 0.8, 
                fontSize: '0.85rem',
                color: 'rgba(71,85,105,0.8)',
                fontWeight: 500
              }}>
                {filteredCustomers.length} customers • {Object.values(allMachines).flat().length} machines
              </Typography>
            </Box>
            <Chip
              icon={<FilterList sx={{ fontSize: '0.8rem' }} />}
              label="all"
              size="small"
              variant="outlined"
              sx={{ 
                textTransform: 'capitalize',
                fontSize: '0.65rem',
                height: '20px',
                borderColor: 'rgba(148,163,184,0.3)',
                color: 'rgba(100,116,139,0.7)',
                '& .MuiChip-icon': {
                  fontSize: '0.7rem'
                }
              }}
            />
          </Box>
          
          <TextField
            value={query}
            variant='outlined'
            size="small"
            fullWidth
            placeholder='Search customers, devices...'
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            onChange={e => setQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: 'rgba(148,163,184,0.6)', fontSize: '0.9rem' }} />
                </InputAdornment>
              ),
              endAdornment: query && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setQuery('')}
                    sx={{ 
                      color: 'rgba(148,163,184,0.6)',
                      '&:hover': {
                        color: 'rgba(100,116,139,0.8)'
                      }
                    }}
                  >
                    <Clear sx={{ fontSize: '0.8rem' }} />
                  </IconButton>
                </InputAdornment>
              ),
              sx: {
                height: '42px',
                borderRadius: 1.5,
                fontSize: '0.9rem',
                background: 'rgba(255,255,255,0.8)',
                '& .MuiOutlinedInput-input': {
                  padding: '10px 12px',
                  fontSize: '0.9rem',
                  color: 'rgba(30,41,59,0.95)',
                  fontWeight: 500
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(203,213,225,0.4)',
                  borderWidth: '1px'
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(148,163,184,0.5)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(99,102,241,0.4)',
                  borderWidth: '1px'
                },
                '&:hover': {
                  background: 'rgba(255,255,255,0.85)',
                },
                '&.Mui-focused': {
                  background: 'rgba(255,255,255,0.95)',
                }
              }
            }}
          />
        </Box>
      </Card>

      {/* Customer & Machine Tree */}
      <Card
        sx={{
          flex: 1,
          background: 'linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.85) 100%)',
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(226,232,240,0.4)',
          borderRadius: 1.5,
          overflow: 'hidden',
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {filteredCustomers.length > 0 ? (
          <List
            component='nav'
            sx={{
              flex: 1,
              overflow: 'auto',
              p: 0,
              minHeight: 0,
              maxHeight: 'calc(95vh - 160px)',
              '&::-webkit-scrollbar': {
                width: '3px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'rgba(226,232,240,0.2)',
                borderRadius: '1.5px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(148,163,184,0.3)',
                borderRadius: '1.5px',
                '&:hover': {
                  background: 'rgba(100,116,139,0.4)',
                },
              },
            }}
          >
            {filteredCustomers.map((customer, customerIndex) => {
              const customerMachines = allMachines[customer.id] || [];
              const isExpanded = expandedCustomers.has(customer.id);
              const isSelected = selectedCustomer === customer.id;
              
              return (
                <Box key={customer.id}>
                  {/* Customer Node */}
                  <ListItemButton
                    sx={{
                      py: 1,
                      px: 1.5,
                      backgroundColor: isSelected ? 'rgba(99,102,241,0.08)' : 'transparent',
                      borderLeft: isSelected ? '2px solid rgba(99,102,241,0.5)' : '2px solid transparent',
                      '&:hover': {
                        backgroundColor: 'rgba(99,102,241,0.04)',
                      },
                      transition: 'all 0.25s ease',
                      borderRadius: '6px',
                      mx: 0.5,
                      my: 0.2
                    }}
                    onClick={() => handleCustomerClick(customer.id)}
                  >
                    <ListItemIcon sx={{ minWidth: 28 }}>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCustomerToggle(customer.id);
                        }}
                        sx={{ 
                          color: customerMachines.length > 0 ? 'rgba(99,102,241,0.7)' : 'rgba(148,163,184,0.5)',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            color: customerMachines.length > 0 ? 'rgba(99,102,241,0.9)' : 'rgba(100,116,139,0.7)',
                            backgroundColor: 'rgba(99,102,241,0.1)'
                          }
                        }}
                      >
                        {customerMachines.length > 0 ? (
                          isExpanded ? <ExpandMore sx={{ fontSize: '0.9rem' }} /> : <ChevronRight sx={{ fontSize: '0.9rem' }} />
                        ) : (
                          <Business sx={{ fontSize: '0.85rem', opacity: 0.6 }} />
                        )}
                      </IconButton>
                    </ListItemIcon>
                    
                    <ListItemText 
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                          <Typography variant="subtitle1" sx={{ 
                            fontWeight: isSelected ? 600 : 500,
                            color: isSelected ? 'rgba(30,41,59,0.95)' : 'rgba(51,65,85,0.9)',
                            fontSize: '1rem',
                            lineHeight: 1.4
                          }}>
                            {customer.name}
                          </Typography>
                          {customerMachines.length > 0 && (
                            <Badge 
                              badgeContent={customerMachines.length} 
                              sx={{
                                '& .MuiBadge-badge': {
                                  fontSize: '0.55rem',
                                  height: '14px',
                                  minWidth: '14px',
                                  backgroundColor: 'rgba(34,197,94,0.8)',
                                  color: 'white',
                                  fontWeight: 500
                                }
                              }}
                            >
                              <DeviceHub sx={{ fontSize: '0.75rem', color: 'rgba(148,163,184,0.6)' }} />
                            </Badge>
                          )}
                        </Box>
                      }
                      secondary={
                        <Typography variant="body2" sx={{ 
                          fontSize: '0.8rem',
                          color: 'rgba(100,116,139,0.8)',
                          fontWeight: 500
                        }}>
                          {customerMachines.length > 0 ? 
                            `${customerMachines.length} machine${customerMachines.length !== 1 ? 's' : ''}` : 
                            'No machines'}
                        </Typography>
                      }
                    />
                  </ListItemButton>

                  {/* Machine Nodes */}
                  {customerMachines.length > 0 && (
                    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {customerMachines.map((machine, machineIndex) => (
                          <ListItemButton
                            key={machine.apiToken || machineIndex}
                            sx={{
                              pl: 4,
                              pr: 1.5,
                              py: 0.8,
                              ml: 2,
                              mr: 0.5,
                              backgroundColor: selectedMachine === machine.apiToken ? 'rgba(34,197,94,0.06)' : 'transparent',
                              borderLeft: selectedMachine === machine.apiToken ? '2px solid rgba(34,197,94,0.4)' : '2px solid transparent',
                              '&:hover': {
                                backgroundColor: 'rgba(34,197,94,0.04)',
                              },
                              transition: 'all 0.25s ease',
                              borderRadius: '4px',
                              my: 0.1
                            }}
                            onClick={() => handleMachineClick(machine, customer.id)}
                          >
                            <ListItemIcon sx={{ minWidth: 24 }}>
                              <Box sx={{ 
                                width: '6px', 
                                height: '6px', 
                                borderRadius: '50%',
                                backgroundColor: Math.random() > 0.3 ? 'rgba(34,197,94,0.8)' : 'rgba(239,68,68,0.8)',
                                boxShadow: Math.random() > 0.3 ? '0 0 4px rgba(34,197,94,0.3)' : '0 0 4px rgba(239,68,68,0.3)'
                              }} />
                            </ListItemIcon>
                            
                            <ListItemText 
                              primary={
                                <Typography variant="body1" sx={{ 
                                  fontWeight: selectedMachine === machine.apiToken ? 600 : 500,
                                  color: selectedMachine === machine.apiToken ? 'rgba(34,197,94,0.95)' : 'rgba(51,65,85,0.85)',
                                  fontSize: '0.9rem',
                                  lineHeight: 1.3
                                }}>
                                  {machine.name || `Machine ${machineIndex + 1}`}
                                </Typography>
                              }
                              secondary={
                                <Typography variant="body2" sx={{ 
                                  opacity: 0.7, 
                                  fontSize: '0.75rem',
                                  color: 'rgba(100,116,139,0.7)',
                                  fontFamily: 'monospace',
                                  fontWeight: 400
                                }}>
                                  {machine.apiToken ? machine.apiToken.substring(0, 10) + '...' : 'No Token'}
                                </Typography>
                              }
                            />
                          </ListItemButton>
                        ))}
                      </List>
                    </Collapse>
                  )}
                  
                  {customerIndex < filteredCustomers.length - 1 && (
                    <Divider sx={{ 
                      opacity: 0.15, 
                      my: 0.5,
                      mx: 1,
                      borderColor: 'rgba(148,163,184,0.2)'
                    }} />
                  )}
                </Box>
              );
            })}
          </List>
        ) : (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            flex: 1,
            p: 2.5
          }}>
            <AccountTree sx={{ 
              fontSize: '2.5rem', 
              color: 'rgba(148,163,184,0.4)', 
              mb: 1.5 
            }} />
            <Typography variant="subtitle2" sx={{ 
              color: 'rgba(100,116,139,0.7)', 
              textAlign: 'center',
              fontSize: '0.85rem',
              fontWeight: 500
            }}>
              No customers found
            </Typography>
            <Typography variant="caption" sx={{ 
              color: 'rgba(148,163,184,0.6)', 
              textAlign: 'center', 
              mt: 0.5,
              fontSize: '0.7rem',
              fontWeight: 400
            }}>
              Try adjusting your search query
            </Typography>
          </Box>
        )}
      </Card>
    </Box>
  );
}
export default Customers;
