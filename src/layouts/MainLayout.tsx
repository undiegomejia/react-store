import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import Cart from '../features/products/Cart';

const MainLayout = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box
        component="main"
        sx={{
          display: 'flex',
          flex: 1,
          backgroundColor: 'background.default',
          padding: 3,
        }}
      >
        <Box sx={{ flex: 1, ml: 2 }}>
          <Outlet />
        </Box>
      </Box>
      <Footer />
      <Cart />
    </Box>
  );
};

export default MainLayout;