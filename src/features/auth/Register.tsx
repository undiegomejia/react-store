import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  Link,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { registerSchema, RegisterFormData } from './schemas';
import { useDispatch } from 'react-redux';
import { setCredentials } from './authSlice';

export const Register: FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    mode: 'onBlur',
    resolver: zodResolver(registerSchema),
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const role = watch('role');

  const onSubmit = async (data: RegisterFormData) => {
    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const result = await response.json();
      dispatch(setCredentials(result));
      navigate('/');
    } catch (error) {
      console.error('Registration error:', error);
      // TODO: Show error message to user
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Paper
        elevation={3}
        sx={{
          marginTop: 8,
          padding: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ mt: 3 }}
          noValidate
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Full Name"
            autoComplete="name"
            autoFocus
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name?.message as string}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            autoComplete="email"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message as string}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="password"
            label="Password"
            type="password"
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message as string}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            {...register('confirmPassword')}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message as string}
          />
          <FormControl fullWidth margin="normal" error={!!errors.role}>
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              id="role"
              label="Role"
              {...register('role')}
              defaultValue=""
            >
              <MenuItem value="BUYER">Buyer</MenuItem>
              <MenuItem value="SELLER">Seller</MenuItem>
            </Select>
            {errors.role?.message && (
              <FormHelperText>{errors.role.message as string}</FormHelperText>
            )}
          </FormControl>

          {role === 'SELLER' && (
            <>
              <TextField
                margin="normal"
                required
                fullWidth
                id="storeName"
                label="Store Name"
                {...register('storeName')}
                error={!!errors.storeName}
                helperText={errors.storeName?.message as string}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="storeDescription"
                label="Store Description"
                multiline
                rows={3}
                {...register('storeDescription')}
                error={!!errors.storeDescription}
                helperText={errors.storeDescription?.message as string}
              />
            </>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isSubmitting}
          >
            Register
          </Button>
          <Box sx={{ textAlign: 'center' }}>
            <Link component={RouterLink} to="/signin" variant="body2">
              Already have an account? Sign In
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;