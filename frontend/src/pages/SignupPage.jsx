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
    const [nameError, setNameError] = useState(null);
    const [emailError, setEmailError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);
    const { setToken, setUser } = useUser();
    const navigate = useNavigate();

    const validate = () => {
        if (!name.trim()) {
            setNameError('Name is required');
        }else{
            setNameError('')
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setEmailError('Invalid email address');
        }else{
            setEmailError('')
        }

        if (password.length < 6 || password.length == 0) {
            setPasswordError('Password must be at least 6 characters');
        }else{
            setPasswordError('')
        }

        if(nameError || emailError || passwordError){
            return false
        }else{
            return true
        }
    }

    const handleSignup = async () => {
        if(!validate()) return
        try {
            const res = await api.post('/user', {
                "name": name,
                "email": email,
                "password": password,
            });
            if(res.data.success == false){
                setError("User with this email already exists!")
                return;
            }

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
        <Field.Root marginBottom={5}>
            <Field.Label>Name</Field.Label>
            <Input 
            placeholder="Full-name" 
            value={name}
            borderColor={nameError ? 'red.500' : ''}
            onChange={(e) => {
                setName(e.target.value)
            }}
            />
            {nameError && <Text color="red.500">{nameError}</Text>}
        </Field.Root>
        <Field.Root marginBottom={5}>
            <Field.Label>Email</Field.Label>
            <Input 
            placeholder="me@example.com" 
            value={email}
            borderColor={emailError ? 'red.500' : ''}
            onChange={(e) => {
                setEmail(e.target.value)
            }}
            />
            {emailError && <Text color="red.500">{emailError}</Text>}
        </Field.Root>
        <Field.Root marginBottom={5}>
            <Field.Label>Password</Field.Label>
            <Input 
            placeholder="**********" 
            value={password}
            borderColor={passwordError ? 'red.500' : ''}
            onChange={(e) => {
                setPassword(e.target.value)
            }}
            />
            {passwordError && <Text color="red.500">{passwordError}</Text>}
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