import { Box, Button, Input, Field, IconButton, Flex } from "@chakra-ui/react"
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { IoMdArrowRoundBack } from "react-icons/io";
import { useUser } from '../UserContext';
import { useState } from 'react';
import api from '../api.js'


function UpdatePage() {

    const { user, setUser } = useUser();
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [password, setPassword] = useState(user.password);
    const navigate = useNavigate();


    const handleUpdate = async () => {
        try {
            const response = await api.put(`/user/${user._id}`, {
                "name":name,
                "email":email,
                "password":password,
            });
            console.log(response)
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
        <Field.Root>
            <Field.Label>Name</Field.Label>
            <Input 
            variant="subtle"
            value={name} 
            onChange={(e) => setName(e.target.value)}
            marginBottom={5}
            />
        </Field.Root>
        <Field.Root>
            <Field.Label>Email</Field.Label>
            <Input 
            variant="subtle"
            value={email} 
            onChange={(e) => setEmail(e.target.value)}  
            marginBottom={5}
            />
        </Field.Root>
        <Field.Root>
            <Field.Label>Password</Field.Label>
            <Input 
            variant="subtle"
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            marginBottom={5}
            />
        </Field.Root>
        <Button colorPalette={"teal"} fontWeight={"bold"} onClick={handleUpdate} textDecoration={"none"} width={"full"}>
            Save
        </Button>
    </Box>
    )
}

export default UpdatePage