import { FC, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Drawer,
  Typography,
  IconButton,
  Divider,
  Button,
  Card,
  CardMedia,
  Stack,
  Badge,
  useTheme,
} from '@mui/material';
import {
  Close as CloseIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  ShoppingBag as ShoppingBagIcon,
} from '@mui/icons-material';
import { RootState } from '../../store/store';
import { CartItem, Product } from '../../models/types';
import { updateQuantity, removeFromCart, toggleCart } from '../cart/cartSlice';

interface CartItemWithDetails extends CartItem {
  product: Product | null;
  loading: boolean;
}

const CartItemCard: FC<{
  item: CartItemWithDetails;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
}> = ({ item, onUpdateQuantity, onRemove }) => {
  if (item.loading || !item.product) {
    return (
      <Card sx={{ display: 'flex', mb: 2, p: 2, opacity: 0.7 }}>
        <Box sx={{ width: 80, height: 80, bgcolor: 'grey.200' }} />
        <Box sx={{ flex: 1, ml: 2 }}>
          <Box sx={{ width: 120, height: 20, bgcolor: 'grey.200', mb: 1 }} />
          <Box sx={{ width: 60, height: 20, bgcolor: 'grey.200' }} />
        </Box>
      </Card>
    );
  }

  const { product } = item;
  const hasDiscount = product.discountPercentage && 
    (!product.discountValidUntil || new Date(product.discountValidUntil) > new Date());
  
  const price = hasDiscount
    ? product.price * (1 - (product.discountPercentage! / 100))
    : product.price;

  return (
    <Card sx={{ display: 'flex', mb: 2, p: 2 }}>
      <CardMedia
        component="img"
        sx={{ 
          width: 80,
          height: 80,
          objectFit: 'contain',
          bgcolor: 'background.paper'
        }}
        image={`${process.env.PUBLIC_URL}/images/${product.images[0]}`}
        alt={product.name}
        onError={(e) => {
          const img = e.target as HTMLImageElement;
          if (!img.src.includes('data:image')) {
            const svg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="100%" height="100%" fill="%23f5f5f5"/></svg>`;
            img.src = svg;
          }
        }}
      />
      <Box sx={{ flex: 1, ml: 2 }}>
        <Typography variant="subtitle1" noWrap>
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          ${price.toFixed(2)}
          {hasDiscount && (
            <Typography
              component="span"
              variant="body2"
              color="text.secondary"
              sx={{ textDecoration: 'line-through', ml: 1 }}
            >
              ${product.price.toFixed(2)}
            </Typography>
          )}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <IconButton 
            size="small"
            onClick={() => onUpdateQuantity(item.quantity - 1)}
            disabled={item.quantity <= 1}
          >
            <RemoveIcon fontSize="small" />
          </IconButton>
          <Typography sx={{ mx: 1 }}>
            {item.quantity}
          </Typography>
          <IconButton
            size="small"
            onClick={() => onUpdateQuantity(item.quantity + 1)}
            disabled={item.quantity >= (product.stock || 0)}
          >
            <AddIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={onRemove}
            sx={{ ml: 'auto' }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Card>
  );
};

const Cart: FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { items, isOpen } = useSelector((state: RootState) => state.cart);
  const [cartItems, setCartItems] = useState<CartItemWithDetails[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const itemsWithDetails = await Promise.all(
          items.map(async (item) => {
            try {
              const response = await fetch(`/api/products/${item.productId}`);
              if (!response.ok) throw new Error('Product not found');
              const product = await response.json();
              return { ...item, product, loading: false };
            } catch (error) {
              console.error('Error fetching product:', error);
              return { ...item, product: null, loading: false };
            }
          })
        );
        setCartItems(itemsWithDetails);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && items.length > 0) {
      fetchProducts();
    }
  }, [items, isOpen]);

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    dispatch(updateQuantity({ productId, quantity }));
  };

  const handleRemoveItem = (productId: string) => {
    dispatch(removeFromCart(productId));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      if (!item.product) return total;
      const price = item.product.discountPercentage && 
        (!item.product.discountValidUntil || new Date(item.product.discountValidUntil) > new Date())
        ? item.product.price * (1 - (item.product.discountPercentage / 100))
        : item.product.price;
      return total + (price * item.quantity);
    }, 0);
  };

  const handleClose = () => {
    dispatch(toggleCart());
  };

  const handleCheckout = () => {
    // TODO: Implement checkout
    console.log('Proceeding to checkout');
  };

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={handleClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 400 },
          p: 2,
        },
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Badge 
            badgeContent={items.length} 
            color="primary"
            sx={{ mr: 1 }}
          >
            <ShoppingBagIcon />
          </Badge>
          <Typography variant="h6" sx={{ flex: 1 }}>
            Shopping Cart
          </Typography>
          <IconButton onClick={handleClose} edge="end">
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {items.length === 0 ? (
          <Box 
            sx={{ 
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'text.secondary',
              textAlign: 'center',
              p: 3,
            }}
          >
            <ShoppingBagIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
            <Typography variant="h6" gutterBottom>
              Your cart is empty
            </Typography>
            <Typography variant="body2">
              Start shopping to add items to your cart
            </Typography>
          </Box>
        ) : (
          <>
            <Stack
              spacing={2}
              sx={{
                flex: 1,
                overflowY: 'auto',
                mb: 2,
                mr: -2,
                pr: 2,
              }}
            >
              {cartItems.map((item) => (
                <CartItemCard
                  key={item.productId}
                  item={item}
                  onUpdateQuantity={(quantity) => handleUpdateQuantity(item.productId, quantity)}
                  onRemove={() => handleRemoveItem(item.productId)}
                />
              ))}
            </Stack>

            <Box>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1">
                  Total
                </Typography>
                <Typography variant="h6" sx={{ ml: 'auto' }}>
                  ${calculateTotal().toFixed(2)}
                </Typography>
              </Box>
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handleCheckout}
                disabled={loading || cartItems.length === 0}
              >
                Proceed to Checkout
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Drawer>
  );
};

export default Cart;