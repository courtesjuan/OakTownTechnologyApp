// src/components/AccountMenu.js
import React, { useState } from 'react';
import { useMsal } from '@azure/msal-react';
import { 
  IconButton, 
  Avatar, 
  Menu, 
  MenuItem, 
  ListItemIcon 
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

function AccountMenu() {
  const { instance, accounts } = useMsal();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Use logoutPopup with a post-logout redirect URI to return to landing page
    instance.logoutPopup({
      postLogoutRedirectUri: 'http://localhost:3000'
    }).catch(e => console.error(e));
  };

  if (!accounts || accounts.length === 0) {
    return null;
  }

  // Use the first account's name to create initials
  const account = accounts[0];
  const nameParts = account.name ? account.name.split(' ') : [account.username];
  const initials = nameParts.map(part => part[0]).slice(0, 2).join('');

  return (
    <>
      <IconButton 
        onClick={handleClick} 
        size="small" 
        sx={{ ml: 2 }} 
        aria-controls={open ? 'account-menu' : undefined} 
        aria-haspopup="true" 
        aria-expanded={open ? 'true' : undefined}
      >
        <Avatar sx={{ width: 32, height: 32 }}>{initials}</Avatar>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            mt: 1.5,
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Sign Out
        </MenuItem>
      </Menu>
    </>
  );
}

export default AccountMenu;
