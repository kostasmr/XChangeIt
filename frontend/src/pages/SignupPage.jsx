import { Box, Button, Input, Field } from "@chakra-ui/react"
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Link, Text } from '@chakra-ui/react';
import '../css/LoginPage.css'
import api from '../api.js'
import { useState } from 'react';
import { useUser } from '../UserContext';



function SignupPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { setToken, setUser } = useUser();
    const navigate = useNavigate();

    let emailValid = true;

    const validate = () => {
        if (!name.trim()) {
        setError('Name is required');
        return false;
        }

        // Simple email regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
        emailValid = false;
        setError('Invalid email address');
        return false;
        }

        if (password.length < 6) {
        setError('Password must be at least 6 characters');
        return false;
        }

        setError('');
        return true;
    };

    const handleSignup = async () => {
        if (!validate()) return;
        try {
            await api.post('/user', {
                "name": name,
                "email": email,
                "password": password,
            });

            const response = await api.post(`/user/login`, { 
                "email": email,
                "password": password
            });
            const { user, token } = response.data;
            setToken(token);
            setUser(user);
            navigate('/home');
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed');
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
        <Field.Root>
            <Field.Label>Name</Field.Label>
            <Input 
            placeholder="Full-name" 
            marginBottom={5}
            value={name}
            onChange={(e) => setName(e.target.value)}
            />
        </Field.Root>
        <Field.Root>
            <Field.Label>Email</Field.Label>
            <Input 
            placeholder="me@example.com" 
            marginBottom={5}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            borderColor={emailValid ? 'gray.800' : 'red.500'}
            />
        </Field.Root>
        <Field.Root>
            <Field.Label>Password</Field.Label>
            <Input 
            placeholder="**********" 
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
            onClick={handleSignup}
        >
            Sign up
        </Button>
        {error && <Text color="red.500" mb={3}>{error}</Text>}
        <Link as={RouterLink} to="/" color="white" textDecoration={"underline"}>
            return to login page
        </Link>
    </Box>
  )
}

export default SignupPage