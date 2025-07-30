// src/components/ResponsiveNavBar.js
import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import { NavLink } from 'react-router-dom';
import AccountMenu from './AccountMenu';
import logo from '../assets/ottlogo.png';

function ResponsiveNavBar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // ~600px breakpoint
  const [openDrawer, setOpenDrawer] = useState(false);

  const handleDrawerToggle = () => {
    setOpenDrawer(!openDrawer);
  };

  // Signature navigation links
  const navLinks = [
    { label: 'Dashboard', path: '/' },
    { label: 'Clients', path: '/clients' },
    { label: 'Invoices', path: '/invoices' },
    { label: 'New Invoice', path: '/invoices/new' },
  ];

  const drawer = (
    <Box sx={{ width: 250, backgroundColor: '#d3d02c', height: '100%', color: '#fff' }} onClick={handleDrawerToggle}>
      <List>
        {navLinks.map((item) => (
          <ListItem button key={item.label} component={NavLink} to={item.path}>
            <ListItemText primary={item.label} sx={{ color: '#fff' }} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: '#d3d02c' }}>
        <Toolbar>
          <Box
            component="img"
            sx={{ height: 40, marginRight: 2 }}
            alt="Oak Town Tech Logo"
            src={logo}
          />
          <Typography variant="h6" sx={{ flexGrow: 1, color: '#fff' }}>
            Oak Town Tech
          </Typography>
          {isMobile ? (
            <Button color="inherit" onClick={handleDrawerToggle}>
              <MenuIcon sx={{ color: '#fff' }} />
            </Button>
          ) : (
            <>
              {navLinks.map((item) => (
                <Button
                  key={item.label}
                  component={NavLink}
                  to={item.path}
                  color="inherit"
                  sx={{ marginRight: 2, color: '#fff' }}
                >
                  {item.label}
                </Button>
              ))}
              <AccountMenu />
            </>
          )}
        </Toolbar>
      </AppBar>
      <Drawer anchor="right" open={openDrawer} onClose={handleDrawerToggle}>
        {drawer}
      </Drawer>
    </>
  );
}



export default ResponsiveNavBar;
