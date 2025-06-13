import { useState, useEffect, useContext } from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import Contacts from '../components/Contacts';
import Welcome from '../components/Welcome';
import ChatContainer from '../components/ChatContainer';

const ChatPage = () => {
  const { user, socket, onlineUsers } = useContext(AuthContext);
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);

  useEffect(() => {
    if (user) {
      socket.emit('add-user', user._id);
    }
  }, [user, socket]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  return (
    <Container maxWidth="xl" sx={{ height: '100vh', py: 2 }}>
      <Grid container spacing={2} sx={{ height: '100%' }}>
        <Grid item xs={12} md={4}>
          <Contacts
            contacts={contacts}
            currentUser={user}
            changeChat={handleChatChange}
            onlineUsers={onlineUsers}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          {currentChat === undefined ? (
            <Welcome currentUser={user} />
          ) : (
            <ChatContainer currentChat={currentChat} currentUser={user} socket={socket} />
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default ChatPage;
