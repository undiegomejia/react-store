import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import PrivateRoute from './PrivateRoute';
import NotFoundPage from '../components/NotFoundPage';
import ServerErrorPage from '../components/ServerErrorPage';
import SignIn from '../features/auth/SignIn';
import Register from '../features/auth/Register';
import Home from '../features/products/Home';
import ProductDetails from '../features/products/ProductDetails';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Public routes */}
        <Route index element={<Navigate to="/home" />} />
        <Route path="home" element={<Home />} />
        <Route path="products/:id" element={<ProductDetails />} />
        <Route path="signin" element={<SignIn />} />
        <Route path="register" element={<Register />} />

        {/* Protected routes */}
        <Route element={<PrivateRoute />}>
          <Route path="profile" element={<div>Profile</div>} />
          <Route path="seller/profile" element={<div>Seller Profile</div>} />
          <Route path="cart" element={<div>Cart</div>} />
        </Route>

        {/* Error routes */}
        <Route path="500" element={<ServerErrorPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;