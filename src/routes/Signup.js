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
    Paper,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase-config'; 
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'; // Google Sign-In imports

const SignupPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Google sign-in provider
    const provider = new GoogleAuthProvider();

    const handleGoogleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            console.log("Google Sign-In successful:", user);

            navigate('/dashboard'); 
        } catch (error) {
            console.error('Google Sign-In error:', error);
            setError('Failed to sign in with Google.');
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            if (role === 'jobseeker') {
                navigate('/jobseeker-dashboard');
            } else if (role === 'employer') {
                navigate('/employer-dashboard');
            } else if (role === 'collaborator') {
                navigate('/collaborator-dashboard');
            }
        } catch (error) {
            setError('Failed to register. Please check your details.');
            console.error('Registration error:', error);
        }
    };

    return (
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundImage: 'url(/src/assets/login-bg.jpg)', // Adjust the path to your image
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
                    opacity: 0.9,
                }}
            >
                <Box sx={{ width: '100%', padding: 4 }}>
                    <Typography variant="h4" fontWeight="bold" gutterBottom color="#1976d2">
                        Register
                    </Typography>
                    {error && <Typography color="error">{error}</Typography>}
                    <form onSubmit={handleRegister}>
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
                                    zIndex: 1,
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
                            label="Email ID / Username"
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
                        <TextField
                            fullWidth
                            margin="normal"
                            id="confirm-password"
                            label="Confirm Password"
                            type="password"
                            variant="outlined"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <Box sx={{ height: '20px' }}></Box>

                        {/* Google Sign-In Button */}
                        <Button
                            fullWidth
                            variant="contained"
                            color="secondary"
                            size="large"
                            onClick={handleGoogleSignIn}
                            sx={{
                                backgroundColor: '#DB4437', // Google button color
                                color: '#fff',
                                borderRadius: '30px',
                                mb: 2,
                                '&:hover': {
                                    backgroundColor: '#c33d2f',
                                },
                            }}
                        >
                            Continue with Google
                        </Button>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            size="large"
                            sx={{
                                backgroundColor: '#1976d2',
                                borderRadius: '30px',
                                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                                '&:hover': {
                                    backgroundColor: '#115293',
                                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.4)',
                                },
                            }}
                        >
                            Register
                        </Button>
                        <Box sx={{ height: '20px' }}></Box>
                        <Link to="/">
                            <Button
                                fullWidth
                                variant="outlined"
                                color="primary"
                                size="large"
                                sx={{
                                    borderRadius: '30px',
                                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                                    '&:hover': {
                                        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.4)',
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

export default SignupPage;
