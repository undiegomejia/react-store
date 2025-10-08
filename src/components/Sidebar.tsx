import { Box, Drawer, List, ListItem, ListItemText, Typography, Divider } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const DRAWER_WIDTH = 240;

const Sidebar = () => {
  const { items } = useSelector((state: RootState) => state.cart);

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          position: 'relative',
        },
      }}
    >
      <Box sx={{ overflow: 'auto', p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Categories
        </Typography>
        <List>
          {['Electronics', 'Books', 'Clothing', 'Home & Garden'].map((text) => (
            <ListItem key={text}>
              <ListItemText primary={text} sx={{ cursor: 'pointer' }} />
            </ListItem>
          ))}
        </List>
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="h6" gutterBottom>
          Cart Summary
        </Typography>
        <Typography variant="body2">
          Items in cart: {items.length}
        </Typography>
      </Box>
    </Drawer>
  );
};

export default Sidebar;