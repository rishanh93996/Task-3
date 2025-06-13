import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, TextField, Button } from '@mui/material';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [credentials, setCredentials] = useState({
    username: '',
    email: '',
    password: '',
  });
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const { data } = await axios.post(endpoint, credentials);
      
      if (data.user) {
        setUser(data.user);
        localStorage.setItem('token', data.token);
        navigate('/chat');
      }
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {isLogin ? 'Login' : 'Register'}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          {!isLogin && (
            <TextField
              margin="normal"
              required
              fullWidth
              label="Username"
              name="username"
              value={credentials.username}
              onChange={handleChange}
            />
          )}
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={credentials.email}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={credentials.password}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {isLogin ? 'Login' : 'Register'}
          </Button>
          <Button
            fullWidth
            variant="text"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default AuthPage;
