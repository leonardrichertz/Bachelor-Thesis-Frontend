import { useState } from 'react';
import { Box, TextField, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleEnterPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleLogin();
    }
  };

  const handleLogin = async () => {

    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    try {
      const response = await fetch(`${import.meta.env.VITE_BACHELOR_THESIS_BACKEND}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        toast.error('Login failed. Please check your credentials');
        return;
      }

      const data = await response.json();
      const { access_token } = data;
      localStorage.setItem('access_token', access_token);
      toast.success('Login successful');
      navigate('/weather');
    } catch (error) {
      toast.error('Login failed');
    }
  };

  return (
    <>
      <Box onKeyDown={handleEnterPress} sx={{ mt: 1, backgroundColor: 'white', p: 3, borderRadius: '10px', color: 'black' }}>
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
            required: true,
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
            required: true,
            className: 'red-asterisk',
          }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <LoadingButton
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 1, mb: 2 }}
          className="bg-primary"
          onClick={handleLogin}
        >
          Login
        </LoadingButton>
      </Box>
      <ToastContainer />
    </>
  );
}