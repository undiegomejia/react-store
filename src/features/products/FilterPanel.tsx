import { FC, useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Slider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

export interface FilterState {
  search: string;
  categories: string[];
  priceRange: [number, number];
  sortBy: 'price_asc' | 'price_desc' | 'name_asc' | 'newest';
  inStock: boolean;
  onSale: boolean;
}

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  availableCategories: string[];
  maxPrice: number;
  categoryCounts: { [key: string]: number };
}

const FilterPanel: FC<FilterPanelProps> = ({
  filters,
  onFilterChange,
  availableCategories,
  maxPrice,
  categoryCounts,
}) => {
  const [sliderValue, setSliderValue] = useState<[number, number]>(filters.priceRange);
  
  // Synchronize the slider value with filters, but only on mount and when filters explicitly change
  useEffect(() => {
    setSliderValue(filters.priceRange);
  }, [filters.priceRange]);

  const handlePriceChange = (_event: Event | React.SyntheticEvent, newValue: number | number[]) => {
    if (!Array.isArray(newValue)) return;
    
    setSliderValue([newValue[0], newValue[1]]);
  };

  const handlePriceChangeCommitted = (_event: Event | React.SyntheticEvent | null, newValue: number | number[]) => {
    if (!Array.isArray(newValue)) return;
    
    // Only update if the values have actually changed
    if (newValue[0] !== filters.priceRange[0] || newValue[1] !== filters.priceRange[1]) {
      onFilterChange({
        priceRange: [
          Math.round(newValue[0]),
          Math.round(newValue[1])
        ]
      });
    }
  };

  const handleCategoryChange = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    onFilterChange({ categories: newCategories });
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* Search */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search products..."
          value={filters.search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Sort */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Sort By
        </Typography>
        <Select
          size="small"
          fullWidth
          value={filters.sortBy}
          onChange={(e) => onFilterChange({ sortBy: e.target.value as FilterState['sortBy'] })}
        >
          <MenuItem value="price_asc">Price: Low to High</MenuItem>
          <MenuItem value="price_desc">Price: High to Low</MenuItem>
          <MenuItem value="name_asc">Name: A to Z</MenuItem>
          <MenuItem value="newest">Newest First</MenuItem>
        </Select>
      </Box>

      {/* Categories */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Categories
        </Typography>
        <FormGroup>
          {availableCategories.map((category) => (
            <FormControlLabel
              key={category}
              control={
                <Checkbox
                  checked={filters.categories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                  size="small"
                />
              }
              label={
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <Typography variant="body2">
                    {category}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ({categoryCounts[category] || 0})
                  </Typography>
                </Box>
              }
            />
          ))}
        </FormGroup>
      </Box>

      {/* Price Range */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Price Range
        </Typography>
        <Box sx={{ px: 1 }}>
          <Slider
            value={sliderValue}
            onChange={handlePriceChange}
            onChangeCommitted={handlePriceChangeCommitted}
            min={0}
            max={maxPrice}
            step={1}
            getAriaLabel={(index) => index === 0 ? 'Minimum price' : 'Maximum price'}
            valueLabelDisplay="auto"
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              ${Math.round(sliderValue[0])}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ${Math.round(sliderValue[1])}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Additional Filters */}
      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Additional Filters
        </Typography>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.inStock}
                onChange={(e) => onFilterChange({ inStock: e.target.checked })}
                size="small"
              />
            }
            label={
              <Typography variant="body2">
                In Stock Only
              </Typography>
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.onSale}
                onChange={(e) => onFilterChange({ onSale: e.target.checked })}
                size="small"
              />
            }
            label={
              <Typography variant="body2">
                On Sale
              </Typography>
            }
          />
        </FormGroup>
      </Box>
    </Box>
  );
};

export default FilterPanel;