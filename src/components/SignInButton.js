// src/components/SignInButton.js
import React from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../authConfig';
import { Button } from '@mui/material';

function SignInButton() {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance
      .loginPopup(loginRequest)
      .then((response) => {
        console.log('Login response:', response);
        // Check if account exists in the response
        if (response && response.account) {
          instance.setActiveAccount(response.account);
          console.log('Active account set:', response.account);
        }
      })
      .catch(e => {
        console.error(e);
      });
  };

  return (
    <Button variant="contained" color="primary" onClick={handleLogin}>
      Sign In
    </Button>
  );
}

export default SignInButton;
