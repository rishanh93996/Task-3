import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { io } from 'socket.io-client';
import AuthPage from './pages/AuthPage';
import ChatPage from './pages/ChatPage';
import { AuthContext } from './context/AuthContext';

const socket = io('http://localhost:5000');

function App() {
  const [theme] = useState(createTheme());
  const [user, setUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    socket.on('online-users', (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off('online-users');
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthContext.Provider value={{ user, setUser, socket, onlineUsers }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AuthPage />} />
            <Route path="/chat" element={<ChatPage />} />
          </Routes>
        </BrowserRouter>
      </AuthContext.Provider>
    </ThemeProvider>
  );
}

export default App;
