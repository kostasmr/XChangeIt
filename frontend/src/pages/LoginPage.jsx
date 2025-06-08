import { Box, Button, Input, Field } from "@chakra-ui/react"
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Link, Text } from '@chakra-ui/react';
import '../css/LoginPage.css'
import { useState } from 'react';
import api from '../api.js'
import { useUser } from '../UserContext';


function LoginPage() {
    const { setToken, setUser } = useUser();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await api.post(`/user/login`, { 
                "email": email,
                "password": password
            });
            const { user, token } = response.data;
            setToken(token);
            setUser(user);
            navigate('/home');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

  return (
    <Box
        borderWidth="1px"
        borderRadius="20px"
        borderColor="white"
        color="fg.disabled"
        padding="30px"
        width="100%"
        >
        <h1 className="brand"><a>X</a>ChangeIt</h1>
        {error && <Text color="red.500" mb={3}>{error}</Text>}
        <Field.Root>
            <Field.Label>Email</Field.Label>
            <Input 
            placeholder="me@example.com" 
            marginBottom={5}
            value={email}
            onChange={(e) => 
                setEmail(e.target.value)
            }
            />
        </Field.Root>
        <Field.Root>
            <Field.Label>Password</Field.Label>
            <Input 
            placeholder="Password" 
            type="password" 
            marginBottom={5}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />
        </Field.Root>
        <Button 
            colorPalette={"teal"} 
            fontWeight={"bold"}
            width={"full"}
            marginBottom={5}
            onClick={handleLogin}
        >
            Login
        </Button>
        <Text textAlign="center">
            Don't have an account?{' '}
            <Link as={RouterLink} to="/signup" color="white" textDecoration={"underline"}>
                Sign up
            </Link>
        </Text>
    </Box>
  )
}

export default LoginPage