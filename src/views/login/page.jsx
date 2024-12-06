import { useState } from 'react';
import { Box, TextField, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { toast } from 'react-toastify';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACHELOR_THESIS_BACKEND}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      const { access_token } = data;
      localStorage.setItem('access_token', access_token);
      toast.success('Login successful');
      window.location.href = '/weather';
    } catch (error) {
      toast.error('Login failed');
    }
  };

  return (
    <Box sx={{ mt: 1 }}>
      <Typography
        component="h1"
        variant="h5"
        sx={{
          my: '15px',
          fontFamily: 'Karla, sans-serif',
          userSelect: 'none',
          textAlign: 'center',
          fontSize: '28px',
        }}
      >
        Login
      </Typography>
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="E-Mail"
        name="email"
        autoComplete="email"
        InputLabelProps={{
          shrink: true,
          required: false,
          className: 'red-asterisk',
        }}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        autoComplete="current-password"
        InputLabelProps={{
          shrink: true,
          required: false,
          className: 'red-asterisk',
        }}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <LoadingButton
        onClick={handleLogin}
        fullWidth
        variant="contained"
        sx={{ mt: 1, mb: 2 }}
        className="bg-primary"
      >
        Login
      </LoadingButton>
    </Box>
  );
}