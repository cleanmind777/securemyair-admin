/** @format */

import { useState, useContext } from 'react';
import { styled } from '@mui/material/styles';
import {
  Box,
  Drawer,
  CssBaseline,
  Toolbar,
  Menu,
  MenuItem,
  ListItemText,
  ListItemIcon,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
} from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { NavItems, SuperNavItems } from './constants';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { useNavigate } from 'react-router-dom';
import logo from '../assests/logo.png';
import { CustomerContext } from '../CustomerContext';

const drawerWidth = 200;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: prop => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));
const iconStyle = { width: '1.5em', height: '1.5em' };

export default function MobileDrawer() {
  const { setCustomerID } = useContext(CustomerContext);

  const [anchorEl, setAnchorEl] = useState(null);

  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const handleMenu = event => {
    setAnchorEl(event.currentTarget);
  };
  const id = localStorage.getItem('admin_id');
  const nav = id === '5' ? SuperNavItems : NavItems;
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position='fixed' open={open} sx={{ bgcolor: '#2599ca' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <IconButton
            color='inherit'
            aria-label='open drawer'
            onClick={handleDrawerOpen}
            edge='start'
            sx={{ mr: 2, ...(open && { display: 'none' }) }}>
            <MenuIcon sx={iconStyle} />
          </IconButton>
          <Typography sx={{ flex: 1 }} variant='h6' noWrap component='div'>
            SecureMyAir Admin
          </Typography>

          <div>
            <IconButton
              size='large'
              aria-label='account of current user'
              aria-controls='menu-appbar'
              aria-haspopup='true'
              onClick={handleMenu}
              color='inherit'>
              <AccountCircle sx={iconStyle} />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}>
              <MenuItem
                onClick={() => {
                  handleClose();
                  navigate('/profile');
                }}>
                <AccountCircle sx={{ mr: 2, width: '1.5em', height: '1.5em' }} />
                Profile
              </MenuItem>
              <MenuItem
                onClick={() => {
                  localStorage.clear();
                  setCustomerID(null);
                  navigate('/login');
                }}>
                <LogoutRoundedIcon sx={{ mr: 2, width: '1.5em', height: '1.5em' }} />
                Logout
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant='persistent'
        anchor='left'
        open={open}>
        <DrawerHeader sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box display={'flex'} alignItems={'center'}>
            <img style={{ width: '50px', display: 'inline' }} src={logo} alt='I am RedApple Logo' />
            <Typography
              variant='h5'
              sx={{
                position: 'fixed',
                left: 75,
                lineHeight: 1,
              }}>
              Red <br />
              Apple
            </Typography>
          </Box>

          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon sx={iconStyle} />
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {nav.map(item => (
            <ListItem key={item.id} disablePadding>
              <ListItemButton
                onClick={() => {
                  handleDrawerClose();
                  navigate(item.route);
                }}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.lable} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
      </Drawer>
    </Box>
  );
}
