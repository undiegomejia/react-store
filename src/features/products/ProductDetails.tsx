import { FC, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Card,
  CardMedia,
  Chip,
  Container,
  Divider,
  Grid,
  IconButton,
  Rating,
  Skeleton,
  Typography,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  ShoppingCart as CartIcon,
} from '@mui/icons-material';
import { Product } from '../../models/types';
import { RootState } from '../../store/store';
import { addToCart } from '../../features/cart/cartSlice';

const ProductImageGallery: FC<{ images: string[] }> = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <Box>
      <Card sx={{ mb: 2 }}>
        <CardMedia
          component="img"
          height={400}
          image={`${process.env.PUBLIC_URL}/images/${images[selectedImage]}`}
          alt="Product"
          sx={{ 
            objectFit: 'contain',
            bgcolor: 'background.paper',
            p: 2
          }}
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            if (!img.src.includes('data:image')) {
              const svg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="100%" height="100%" fill="%23f5f5f5"/><text x="50%" y="50%" font-family="Arial" font-size="14" fill="%23666" text-anchor="middle" dy=".3em">No Image Available</text></svg>`;
              img.src = svg;
            }
          }}
        />
      </Card>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {images.map((image, index) => (
          <Box key={index}>
            <Card 
              sx={{ 
                width: 60, 
                cursor: 'pointer',
                border: index === selectedImage ? 2 : 0,
                borderColor: 'primary.main',
              }}
              onClick={() => setSelectedImage(index)}
            >
              <CardMedia
                component="img"
                height={60}
                image={`${process.env.PUBLIC_URL}/images/${image}`}
                alt={`Product thumbnail ${index + 1}`}
                sx={{ 
                  objectFit: 'contain',
                  bgcolor: 'background.paper',
                  p: 0.5
                }}
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  if (!img.src.includes('data:image')) {
                    const svg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60"><rect width="100%" height="100%" fill="%23f5f5f5"/></svg>`;
                    img.src = svg;
                  }
                }}
              />
            </Card>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

const ProductSkeleton: FC = () => (
  <Container>
    <Box sx={{ display: 'grid', gap: 4, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
      <Box>
        <Skeleton variant="rectangular" height={400} sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', gap: 1 }}>
          {[1, 2, 3].map((i) => (
            <Box key={i}>
              <Skeleton variant="rectangular" width={60} height={60} />
            </Box>
          ))}
        </Box>
      </Box>
      <Box>
        <Skeleton variant="text" height={60} sx={{ mb: 2 }} />
        <Skeleton variant="text" height={30} sx={{ mb: 1 }} />
        <Skeleton variant="text" height={30} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={100} sx={{ mb: 2 }} />
        <Skeleton variant="text" height={50} width="60%" />
      </Box>
    </Box>
  </Container>
);

const ProductDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) {
          throw new Error('Product not found');
        }
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
        navigate('/404');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart({
        productId: product.id,
        quantity,
      }));
    }
  };

  if (loading) {
    return <ProductSkeleton />;
  }

  if (!product) {
    return null;
  }

  const hasDiscount = product.discountPercentage && 
    (!product.discountValidUntil || new Date(product.discountValidUntil) > new Date());
  
  const discountedPrice = hasDiscount
    ? product.price * (1 - (product.discountPercentage! / 100))
    : product.price;

  const isOwnProduct = user?.id === product.sellerId;

  return (
    <Container>
      <Box sx={{ display: 'grid', gap: 4, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
        <Box>
          <ProductImageGallery images={product.images} />
        </Box>
        <Box>
          <Typography variant="h4" gutterBottom>
            {product.name}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Typography variant="h5" color="primary">
              ${discountedPrice.toFixed(2)}
            </Typography>
            {hasDiscount && (
              <>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{ textDecoration: 'line-through' }}
                >
                  ${product.price.toFixed(2)}
                </Typography>
                <Chip
                  label={`${product.discountPercentage}% OFF`}
                  color="error"
                  size="small"
                />
              </>
            )}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <Rating value={4.5} precision={0.5} readOnly />
            <Typography variant="body2" color="text.secondary">
              (24 reviews)
            </Typography>
          </Box>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {product.description}
          </Typography>

          <Divider sx={{ my: 3 }} />

          {!isOwnProduct && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', border: 1, borderColor: 'divider', borderRadius: 1 }}>
                <IconButton 
                  size="small"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                >
                  <RemoveIcon />
                </IconButton>
                <Typography sx={{ px: 2 }}>
                  {quantity}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                >
                  <AddIcon />
                </IconButton>
              </Box>
              <Button
                variant="contained"
                startIcon={<CartIcon />}
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
            </Box>
          )}

          <Box sx={{ mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              {product.stock > 0 ? `${product.stock} items in stock` : 'Currently out of stock'}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default ProductDetails;