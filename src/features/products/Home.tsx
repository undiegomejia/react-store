import { FC, useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Rating,
  Skeleton,
  Container,
  useMediaQuery,
  useTheme,
  IconButton,
  Drawer,
} from '@mui/material';
import { FilterList as FilterListIcon } from '@mui/icons-material';
import FilterPanel, { FilterState } from './FilterPanel';
import { Product } from '../../models/types';

const ProductCard: FC<{ product: Product }> = ({ product }) => {
  const navigate = useNavigate();
  const hasDiscount = product.discountPercentage && 
    (!product.discountValidUntil || new Date(product.discountValidUntil) > new Date());
  
  const discountedPrice = hasDiscount
    ? product.price * (1 - (product.discountPercentage! / 100))
    : product.price;

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: '0.3s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
      onClick={() => navigate(`/products/${product.id}`)}
    >
      <CardMedia
        component="img"
        height="200"
        image={`${process.env.PUBLIC_URL}/images/${product.images[0]}`}
        alt={product.name}
        sx={{ 
          objectFit: 'contain', 
          p: 2,
          bgcolor: 'background.paper',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onError={(e) => {
          const img = e.target as HTMLImageElement;
          if (!img.src.includes('data:image')) {
            // Create a simple SVG placeholder
            const svg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="100%" height="100%" fill="%23f5f5f5"/><text x="50%" y="50%" font-family="Arial" font-size="14" fill="%23666" text-anchor="middle" dy=".3em">${product.name}</text></svg>`;
            img.src = svg;
          }
        }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div">
          {product.name}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            mb: 2,
          }}
        >
          {product.description}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6" color="primary">
            ${discountedPrice.toFixed(2)}
          </Typography>
          {hasDiscount && (
            <>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textDecoration: 'line-through', ml: 1 }}
              >
                ${product.price.toFixed(2)}
              </Typography>
              <Chip
                label={`-${product.discountPercentage}%`}
                color="error"
                size="small"
                sx={{ ml: 1 }}
              />
            </>
          )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Rating value={4.5} precision={0.5} size="small" readOnly />
          <Typography variant="body2" color="text.secondary">
            (24)
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

const ProductSkeleton: FC = () => (
  <Card sx={{ height: '100%' }}>
    <Skeleton variant="rectangular" height={200} />
    <CardContent>
      <Skeleton variant="text" sx={{ fontSize: '1.5rem' }} />
      <Box>
        <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
        <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
      </Box>
      <Skeleton variant="text" sx={{ fontSize: '2rem' }} width="60%" />
    </CardContent>
  </Card>
);

// Keep the max price as a constant outside the component
const INITIAL_MAX_PRICE = 1000;

const Home: FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  
  // Use ref to store the immutable max price after initial calculation
  const maxPriceRef = useRef(INITIAL_MAX_PRICE);
  
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    categories: [],
    priceRange: [0, INITIAL_MAX_PRICE],
    sortBy: 'newest',
    inStock: false,
    onSale: false,
  });
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);

  // Effect to set the max price only once when products are first loaded
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data);
        
        // Extract unique categories
        const categories = Array.from(new Set(data.map((p: Product) => p.category))).sort() as string[];
        setAvailableCategories(categories);
        
        // Set the max price only once and store it in the ref
        if (products.length === 0) {
          const calculatedMaxPrice = Math.max(...data.map((p: Product) => p.price));
          // Round up to next hundred for a cleaner number
          const roundedMaxPrice = Math.ceil(calculatedMaxPrice / 100) * 100;
          maxPriceRef.current = roundedMaxPrice;
          
          // Initialize the filter with the calculated max price
          setFilters(prev => ({
            ...prev,
            priceRange: [0, roundedMaxPrice]
          }));
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Search filter
      if (filters.search && !product.name.toLowerCase().includes(filters.search.toLowerCase()) &&
          !product.description.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }

      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
        return false;
      }

      // Price range filter
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false;
      }

      // In stock filter
      if (filters.inStock && product.stock === 0) {
        return false;
      }

      // On sale filter
      if (filters.onSale && (!product.discountPercentage || 
          (product.discountValidUntil && new Date(product.discountValidUntil) <= new Date()))) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      switch (filters.sortBy) {
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'name_asc':
          return a.name.localeCompare(b.name);
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  }, [products, filters]);

  // Calculate category counts from all products
  const categoryCounts = useMemo(() => {
    const counts: { [key: string]: number } = {};
    products.forEach(product => {
      counts[product.category] = (counts[product.category] || 0) + 1;
    });
    return counts;
  }, [products]);

  const handleFilterUpdate = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Featured Products
      </Typography>

      <Box sx={{ display: 'flex', gap: 4 }}>
        {/* Filter panel - Left side */}
        <Box sx={{ 
          width: 280, 
          flexShrink: 0,
          display: { xs: 'none', md: 'block' } 
        }}>
          <FilterPanel 
            filters={filters} 
            onFilterChange={handleFilterUpdate}
            availableCategories={availableCategories}
            maxPrice={maxPriceRef.current}
            categoryCounts={categoryCounts}
          />
        </Box>

        {/* Product grid - Right side */}
        <Box sx={{ 
          flex: 1,
          display: 'grid', 
          gap: 3, 
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)'
          }
        }}>
        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <Box key={`skeleton-${index}`}>
                <ProductSkeleton />
              </Box>
            ))
          : filteredProducts.map((product) => (
              <Box key={product.id}>
                <ProductCard product={product} />
              </Box>
            ))}
        </Box>
      </Box>
    </Container>
  );
};

export default Home;