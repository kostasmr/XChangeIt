import { Box, Button, Input, Field, IconButton, Flex, Text } from "@chakra-ui/react"
import { Link as RouterLink, useNavigate} from 'react-router-dom';
import { IoMdArrowRoundBack } from "react-icons/io";
import { useUser } from '../UserContext';
import { useState } from 'react';
import api from '../api.js'

function DeletePage() {
    const { logout } = useUser();
    const { user } = useUser();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    
    
    const deleteUser = async () => {
        try {
            const res = await api.delete(`/user/${user._id}`);
            console.log(res.data)
            logout()
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Delete failed');
        }
    }
    return (
        <Box
            borderWidth="1px"
            borderRadius="20px"
            borderColor="white"
            color="fg.disabled"
            padding="30px"
            width="100%"
        >
        {error && <Text color="red.500" mb={3}>{error}</Text>}
        <Flex align={"center"} justify={"space-between"} marginBottom={"10"} >
            <IconButton as={RouterLink} to="/profile" aria-label="Search database" key={"solid"} colorPalette={"teal"}>
               <IoMdArrowRoundBack/>
            </IconButton>
            <h2 className="brand"><a>X</a>ChangeIt</h2>
        </Flex>

        <Text fontWeight={"bold"} marginBottom={"10"}>Are you sure to delete this profile?</Text>
        <Button colorPalette={"red"} fontWeight={"bold"} textDecoration={"none"} width={"full"} onClick={deleteUser}>
            Delete
        </Button>
    </Box>
    )
}

export default DeletePage