// src/authConfig.js

export const msalConfig = {
    auth: {
      clientId: '6134b2cb-0576-4c10-b5af-768e321940b0', // Your App (client) ID
      authority: 'https://login.microsoftonline.com/1e2feef3-9ba1-44e4-afca-7eca8402b3c0', // Your Tenant ID
      redirectUri: 'https://07febedf.oaktowntechnologyapp.pages.dev/', // For local development; update for production as needed.
      
    },
    cache: {
      cacheLocation: 'sessionStorage', // or 'localStorage'
      storeAuthStateInCookie: false,
    },
  };
  
  export const loginRequest = {
    scopes: ['openid', 'profile', 'email'],
  };
  