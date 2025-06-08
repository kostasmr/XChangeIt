import { Box, Button, Input, Field, IconButton, Flex, Text } from "@chakra-ui/react"
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { IoMdArrowRoundBack } from "react-icons/io";
import { useUser } from '../UserContext';
import { useState } from 'react';
import api from '../api.js'
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";


function UpdatePage() {

    const { user, setUser } = useUser();
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [nameError, setNameError] = useState("")
    const [emailError, setEmailError] = useState(null)

    const navigate = useNavigate();


    const validateName = (value) => {
        if (!value.trim()) {
            setNameError("Name is required");
        } else {
            setNameError("");
        }
    };

    const validateEmail = (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            setEmailError("Invalid email address");
        } else {
            setEmailError("");
        }
    };

    const handleUpdate = async () => {
        try {
            const response = await api.put(`/user/${user._id}`, {
                "name":name,
                "email":email,
            });
            console.log("User Updated")
            setUser(response.data.updatedUser);
            navigate('/profile');
        } catch (err) {
            console.error('Update failed:', err.response?.data || err.message);
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
        <Flex align={"center"} justify={"space-between"} marginBottom={"10"} >
            <IconButton as={RouterLink} to="/profile" aria-label="Search database" key={"solid"} colorPalette={"teal"}>
               <IoMdArrowRoundBack/>
            </IconButton>
            <h2 className="brand"><a>X</a>ChangeIt</h2>
        </Flex>
        <Field.Root marginBottom={5}>
            <Field.Label>Name</Field.Label>
            <Input 
            variant="subtle"
            value={name} 
            borderColor={nameError ? 'red.500' : ''}
            onChange={(e) => { 
                setName(e.target.value) 
                validateName(e.target.value)
            }}
            />
            {nameError && <Text color="red.500">{nameError}</Text>}
        </Field.Root>
        <Field.Root marginBottom={5}>
            <Field.Label>Email</Field.Label>
            <Input 
            variant="subtle"
            value={email} 
            borderColor={emailError ? 'red.500' : ''}
            onChange={(e) => { 
                setEmail(e.target.value)
                validateEmail(e.target.value)
            }}  
            />
            {emailError && <Text color="red.500">{emailError}</Text>}
        </Field.Root>
            
        <Button colorPalette={"teal"} fontWeight={"bold"} onClick={handleUpdate} textDecoration={"none"} width={"full"}>
            Save
        </Button>
    </Box>
    )
}

export default UpdatePage