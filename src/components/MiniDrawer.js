/** @format */

import logo from '../assests/logo.png';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { useLocation, useNavigate } from 'react-router-dom';
import { NavItems, SuperNavItems } from './constants';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { CustomerContext } from '../CustomerContext';

const drawerWidth = 250;

const openedMixin = theme => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = theme => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: prop => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

export default function MiniDrawer() {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const { setCustomerID } = React.useContext(CustomerContext);

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const id = localStorage.getItem('admin_id');
  const nav = id === '5' ? SuperNavItems : NavItems;
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const iconStyle = { width: '1.5em', height: '1.5em', color: '#2196f3 !important' };
  const handleLogout = () => {
    localStorage.clear();
    setCustomerID(null);
    navigate('/login');
  }
  const location = useLocation()
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Drawer
        variant='permanent'
        open={open}
        onMouseOver={handleDrawerOpen}
        onMouseOut={handleDrawerClose}>
        <DrawerHeader>
          <img className='logo' src={logo} alt='I am RedApple Logo' />
          {open && (
            <Typography
              sx={{
                position: 'fixed',
                left: 75,
                lineHeight: 1,
                fontSize: '2vh !important',
              }}>
              Red <br />
              Apple
            </Typography>
          )}
        </DrawerHeader>
        <List>
          {nav.map(item => {
            return (
              <ListItem
                className={location.pathname === item.route || location.pathname.startsWith(item.route + '/') ? 'active' : ''}
                key={item.id}
                disablePadding
                sx={{ display: 'block' }}>
                <ListItemButton
                  onClick={() => {
                    handleDrawerClose();
                    navigate(item.route);
                  }}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                  }}>
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                    }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.lable} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        <Divider />
        <List sx={{ marginTop: 'auto' }}>
          <ListItem
            disablePadding
            sx={{ display: 'block' }}
            className={location.pathname === '/profile' ? 'active' : ''}
            >
            <ListItemButton
              onClick={() => navigate('/profile')}
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}>
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}>
                <AccountCircleOutlinedIcon sx={iconStyle} />
              </ListItemIcon>
              <ListItemText
                primary={localStorage.getItem('admin_name')}
                sx={{ opacity: open ? 1 : 0 }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding sx={{ display: 'block' }}>
            <form onSubmit={handleLogout}>
              <ListItemButton
                type='submit'
                onClick={handleLogout}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}>
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}>
                  <LogoutOutlinedIcon sx={{ opacity: open ? 1 : 0, ...iconStyle }} />
                </ListItemIcon>
                <ListItemText primary={'Logout'} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </form>
          </ListItem>
        </List>
      </Drawer>
    </Box>
  );
}
