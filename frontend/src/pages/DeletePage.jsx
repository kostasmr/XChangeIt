import { Box, Button, Input, Field, IconButton, Flex } from "@chakra-ui/react"
import { Link as RouterLink } from 'react-router-dom';
import { Link, Text } from '@chakra-ui/react';
import { IoMdArrowRoundBack } from "react-icons/io";


function DeletePage() {
    
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

        <Text fontWeight={"bold"} marginBottom={"10"}>Are you sure to delete this profile?</Text>
        <Button colorPalette={"red"} fontWeight={"bold"} as={RouterLink} to="/" textDecoration={"none"} width={"full"}>
            Delete
        </Button>
    </Box>
    )
}

export default DeletePage