import { Box, Button, Input, Field, IconButton, Flex, CloseButton, Dialog, Portal } from "@chakra-ui/react"
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { IoMdArrowRoundBack } from "react-icons/io";
import { useUser } from '../UserContext';
import { useState } from 'react';
import api from '../api.js'



function ProfilePage() {

    const { user } = useUser();
    const { logout } = useUser();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const deleteProfile = async () => {
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
                <Dialog.Root open={isDialogOpen} onOpenChange={(e) => setIsDialogOpen(e.open)} key={"center"} placement={"center"}>
                    <Dialog.Trigger asChild>
                        <IconButton colorPalette={"red"} variant={"outline"} padding={4}>
                            Delete
                        </IconButton>
                    </Dialog.Trigger>
                    <Portal>
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                        <Dialog.Title>Confirm Deletion</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                        <p>Are you sure you want to delete this profile?</p>
                        </Dialog.Body>
                        <Dialog.Footer>
                        <Dialog.ActionTrigger asChild>
                            <Button variant="outline">Cancel</Button>
                        </Dialog.ActionTrigger>
                        <Button variant={"solid"} colorPalette={"red"} onClick={() => {
                            deleteProfile();
                        }}>
                            Confirm
                        </Button>
                        </Dialog.Footer>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                    </Dialog.Positioner>
                </Portal>
            </Dialog.Root>
                <Button colorPalette={"teal"} fontWeight={"bold"} as={RouterLink} to="/update" textDecoration={"none"}>
                    Update
                </Button>
            </Flex>
        </Box>
    )
}

export default ProfilePage