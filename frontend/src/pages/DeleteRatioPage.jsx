import { Box, Button, Input, Field, IconButton, Flex, Text } from "@chakra-ui/react"
import { Link as RouterLink, useNavigate, useSearchParams} from 'react-router-dom';
import { IoMdArrowRoundBack } from "react-icons/io";
import { useState } from 'react';
import api from '../api.js'

function DeleteRatioPage() {

    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [searchParams] = useSearchParams();
    const idToDelete = searchParams.get("id");
    const [ratio, setRatio] = useState(null);

    const fetchRatio = async () => {
        try {
            const response = await api.get(`/ratio/${idToDelete}`);
            setRatio(response.data); 
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch ratios');
        }
    };
    fetchRatio();

    const deleteRatio = async (id) => {
        try 
        {
            await api.delete(`/ratio/${id}`);
            navigate('/ratios');
        } catch (err) {
            setError(err.response?.data?.message || 'Delete failed');
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
        {error && <Text color="red.500" mb={3}>{error}</Text>}
        <Flex align={"center"} justify={"space-between"} marginBottom={"10"} >
            <IconButton as={RouterLink} to="/ratios" aria-label="Search database" key={"solid"} colorPalette={"teal"}>
               <IoMdArrowRoundBack/>
            </IconButton>
            <h2 className="brand"><a>X</a>ChangeIt</h2>
        </Flex>

        <Text fontWeight={"bold"} marginBottom={"10"}>Are you sure to delete the ratios between {ratio?.from},{ratio?.to}?</Text>
        <Button colorPalette={"red"} fontWeight={"bold"} textDecoration={"none"} width={"full"} onClick={() => deleteRatio(idToDelete)}>
            Delete
        </Button>
    </Box>
    )
}

export default DeleteRatioPage