import React, { useState } from 'react';
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
    Link,
    Paper,
} from '@mui/material';
import { useNavigate } from 'react-router-dom'; 
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const auth = getAuth();

        try {
            await signInWithEmailAndPassword(auth, email, password);
            // Redirect based on role after successful login
            if (role === 'jobseeker') {
                navigate('/jobseeker-dashboard');
            } else if (role === 'employer') {
                navigate('/employer-dashboard');
            } else if (role === 'collaborator') {
                navigate('/collaborator-dashboard');
            }
        } catch (error) {
            setError('Failed to log in. Please check your credentials.');
            console.error('Login error:', error);
        }
    };

    return (
        <Box 
            sx={{ 
                height: '100vh', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                backgroundImage: 'url(frontend/src/assets/login-bg.jpg)', // Assuming image is in public/assets
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            <Paper
                sx={{
                    display: 'flex',
                    maxWidth: '400px',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    boxShadow: 10,
                    backgroundColor: '#ffffff',
                    opacity: 0.9, // Slightly transparent for background blending
                }}
            >
                <Box sx={{ width: '100%', padding: 4 }}>
                    <Typography variant="h4" fontWeight="bold" gutterBottom color="#1976d2">
                        Login
                    </Typography>
                    {error && <Typography color="error">{error}</Typography>}
                    <form onSubmit={handleLogin}>
                        <FormControl fullWidth margin="normal" variant="outlined">
                            <InputLabel id="role-label">Select Role</InputLabel>
                            <Select
                                labelId="role-label"
                                id="role"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                required
                                sx={{ 
                                    backgroundColor: '#e3f2fd',
                                    zIndex: 1, // Ensure the dropdown does not overlap
                                    position: 'relative',
                                }} 
                            >
                                <MenuItem value="">
                                    <em>Select Role</em>
                                </MenuItem>
                                <MenuItem value="jobseeker">Jobseeker</MenuItem>
                                <MenuItem value="employer">Employer</MenuItem>
                                <MenuItem value="collaborator">Collaborator</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            fullWidth
                            margin="normal"
                            id="email"
                            label="Email ID"
                            variant="outlined"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            id="password"
                            label="Password"
                            type="password"
                            variant="outlined"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <Box mb={2}>
                            <Link href="#" variant="body2" color="#1976d2">
                                Forgot Password? Click Here
                            </Link>
                        </Box>
                        <Button 
                            type="submit" 
                            fullWidth 
                            variant="contained" 
                            color="primary" 
                            size="large"
                            sx={{ 
                                backgroundColor: '#1976d2',
                                borderRadius: '30px', // Curvy edges
                                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)', // Shadow effect
                                '&:hover': {
                                    backgroundColor: '#115293', // Darker shade on hover
                                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.4)', // Darker shadow on hover
                                },
                            }}
                        >
                            Login
                        </Button>
                        <Box sx={{ height: '20px' }}></Box>
                        <Link href="/">
                            <Button 
                                fullWidth 
                                variant="outlined" 
                                color="primary" 
                                size="large"
                                sx={{
                                    borderRadius: '30px', // Curvy edges
                                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)', // Shadow effect
                                    '&:hover': {
                                        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.4)', // Darker shadow on hover
                                    },
                                }}
                            >
                                Back
                            </Button>
                        </Link>
                    </form>
                </Box>
            </Paper>
        </Box>
    );
};

export default LoginPage;
