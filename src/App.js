/** @format */
import { HashRouter, BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/Login';
import { CustomerContext } from './CustomerContext';
import { MachineContext } from './MachineContext';
import { UpdateCustomersContext } from './UpdateCustomersContext';
import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { NavItems, SuperNavItems } from './components/constants';
import Profile from './pages/Profile';
import { AddCustomer, AddMachine, EditMachine } from './forms';
import EditCustomer from './forms/EditCustomer';
import DashboardPage from './pages/Dashboard';
import ShowMachine from './miniPages/ShowMachine';
import Ptd from './Protected';

import Layout from './components/Layout';

let theme = createTheme({
  palette: {
    mode: 'light',
    primary: { 
      main: '#3b82f6',
      light: '#60a5fa',
      dark: '#1d4ed8',
      contrastText: '#ffffff'
    },
    secondary: { 
      main: '#059669',
      light: '#10b981',
      dark: '#047857',
    },
    background: { 
      default: '#f8fafc',
      paper: 'rgba(255,255,255,0.95)'
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b'
    }
  },
  shape: { borderRadius: 8 },
  typography: { 
    fontSize: '2vh',
    fontFamily: "'Inter', 'SF Pro Display', system-ui, -apple-system, 'Segoe UI', Roboto",
    button: { textTransform: 'none', fontWeight: 600 },
    h1: { fontWeight: 700, letterSpacing: '-0.02em' },
    h2: { fontWeight: 700, letterSpacing: '-0.01em' },
    h3: { fontWeight: 600, letterSpacing: '-0.01em' },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 }
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.9)',
            boxShadow: '0 8px 25px rgba(0,0,0,0.12)'
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          background: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.2)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          paddingBlock: 8,
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: '0 2px 8px rgba(59,130,246,0.2)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(59,130,246,0.3)'
          }
        },
        contained: {
          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)'
          }
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: 'rgba(255,255,255,0.8)',
            transition: 'all 0.3s ease',
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
    }
  }
});

function App() {
  const [customerID, setCustomerID] = useState(() => localStorage.getItem('admin_client'));
  const [machineID, setMachineID] = useState(localStorage.getItem('admin_api'));
  const [updateCustomers, setUpdateCustomers] = useState(false);
  const id = localStorage.getItem('admin_id');
  const nav = id === '5' ? SuperNavItems : NavItems;
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <HashRouter>
          <CustomerContext.Provider value={{ customerID, setCustomerID }}>
            <MachineContext.Provider value={{ machineID, setMachineID }}>
              <UpdateCustomersContext.Provider value={{ updateCustomers, setUpdateCustomers }}>
                <Routes>
                  <Route element={<Ptd />}>
                    <Route element={<Layout />}>
                      {nav.map((item) => (
                        <Route key={item.lable} path={`/${item.route}`} element={<item.element />}/>
                      ))}
                      <Route element={<AddCustomer />} path="/clients/new" />
                      <Route element={<EditCustomer />} path="/clients/edit" />
                      <Route element={<AddMachine />} path="/machines/new" />
                      <Route element={<EditMachine />} path="/machines/edit" />
                      <Route element={<ShowMachine />} path="/machines/detail" />
                      <Route element={<Profile />} path="/profile" />
                      <Route element={<DashboardPage />} path="/*" />
                    </Route>
                  </Route>
                  <Route element={<LoginPage />} path="/login" />
                </Routes>
              </UpdateCustomersContext.Provider>
            </MachineContext.Provider>
          </CustomerContext.Provider>
        </HashRouter>
      </ThemeProvider>
    </div>
  );
}

export default App;
