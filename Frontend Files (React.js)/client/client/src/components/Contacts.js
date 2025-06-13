import { useState, useEffect } from 'react';
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, Divider } from '@mui/material';
import axios from 'axios';

const Contacts = ({ currentUser, changeChat, onlineUsers }) => {
  const [contacts, setContacts] = useState([]);
  const [currentSelected, setCurrentSelected] = useState(undefined);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const { data } = await axios.get('/api/auth/users');
        setContacts(data.filter(user => user._id !== currentUser._id));
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    };

    if (currentUser) {
      fetchContacts();
    }
  }, [currentUser]);

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };

  return (
    <Box sx={{ height: '100%', overflow: 'auto' }}>
      <Typography variant="h6" sx={{ p: 2 }}>Contacts</Typography>
      <Divider />
      <List>
        {contacts.map((contact, index) => (
          <ListItem
            button
            key={contact._id}
            selected={currentSelected === index}
            onClick={() => changeCurrentChat(index, contact)}
          >
            <ListItemAvatar>
              <Avatar src={contact.avatarImage} />
              {onlineUsers.includes(contact._id) && (
                <Box sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: 12,
                  height: 12,
                  bgcolor: 'success.main',
                  borderRadius: '50%',
                  border: '2px solid white'
                }} />
              )}
            </ListItemAvatar>
            <ListItemText
              primary={contact.username}
              secondary={onlineUsers.includes(contact._id) ? 'Online' : 'Offline'}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Contacts;
