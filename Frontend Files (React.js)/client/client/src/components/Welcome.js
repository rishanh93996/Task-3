import { Box, Typography } from '@mui/material';

const Welcome = ({ currentUser }) => {
  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      textAlign: 'center'
    }}>
      <Box>
        <Typography variant="h4" gutterBottom>
          Welcome, {currentUser.username}!
        </Typography>
        <Typography variant="body1">
          Select a contact to start chatting
        </Typography>
      </Box>
    </Box>
  );
};

export default Welcome;
