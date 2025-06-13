import { useState, useEffect, useRef } from 'react';
import { Box, TextField, IconButton, Avatar, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';

const ChatContainer = ({ currentChat, currentUser, socket }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(`/api/messages/${currentChat._id}`);
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    if (currentChat) {
      fetchMessages();
    }
  }, [currentChat]);

  useEffect(() => {
    socket.on('msg-receive', (data) => {
      setMessages((prev) => [...prev, { fromSelf: false, message: data.message }]);
    });

    return () => {
      socket.off('msg-receive');
    };
  }, [socket]);

  const handleSendMsg = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    try {
      const { data } = await axios.post('/api/messages/', {
        from: currentUser._id,
        to: currentChat._id,
        message: newMessage,
      });

      socket.emit('send-msg', {
        to: currentChat._id,
        from: currentUser._id,
        message: newMessage,
      });

      setMessages([...messages, { fromSelf: true, message: newMessage }]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar src={currentChat.avatarImage} />
          <Typography variant="h6" sx={{ ml: 2 }}>
            {currentChat.username}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
        {messages.map((message, index) => (
          <Box
            key={index}
            ref={scrollRef}
            sx={{
              display: 'flex',
              justifyContent: message.fromSelf ? 'flex-end' : 'flex-start',
              mb: 2,
            }}
          >
            <Box
              sx={{
                bgcolor: message.fromSelf ? 'primary.main' : 'grey.200',
                color: message.fromSelf ? 'white' : 'text.primary',
                p: 1.5,
                borderRadius: 2,
                maxWidth: '70%',
              }}
            >
              {message.message}
            </Box>
          </Box>
        ))}
      </Box>
      <Box component="form" onSubmit={handleSendMsg} sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <IconButton type="submit" color="primary" sx={{ ml: 1 }}>
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatContainer;
