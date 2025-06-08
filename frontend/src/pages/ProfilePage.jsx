import { Box, Button, Input, Field, IconButton, Flex } from "@chakra-ui/react"
import { Link as RouterLink } from 'react-router-dom';
import { Link, Text } from '@chakra-ui/react';
import { IoMdArrowRoundBack } from "react-icons/io";
import { useUser } from '../UserContext';


function ProfilePage() {

    const { user } = useUser();
    
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
                <IconButton as={RouterLink} to="/home" aria-label="Search database" key={"solid"} colorPalette={"teal"}>
                <IoMdArrowRoundBack/>
                </IconButton>
                <h2 className="brand"><a>X</a>ChangeIt</h2>
            </Flex>
            <Field.Root>
                <Field.Label>Name</Field.Label>
                <Input 
                disabled
                variant="subtle"
                placeholder={user.name}
                marginBottom={5}
                />
            </Field.Root>
            <Field.Root>
                <Field.Label>Email</Field.Label>
                <Input 
                disabled
                variant="subtle"
                placeholder={user.email}
                marginBottom={5}
                />
            </Field.Root>
            <Field.Root>
                <Field.Label>Password</Field.Label>
                <Input 
                disabled
                variant="subtle"
                placeholder="••••••••"
                type="password" 
                marginBottom={5}
                />
            </Field.Root>
            <Flex justifyContent={"space-between"}>
                <Button colorPalette={"red"} fontWeight={"bold"} as={RouterLink} to="/delete" textDecoration={"none"}>
                    Delete
                </Button>
                <Button colorPalette={"teal"} fontWeight={"bold"} as={RouterLink} to="/update" textDecoration={"none"}>
                    Update
                </Button>
            </Flex>
        </Box>
    )
}

export default ProfilePage