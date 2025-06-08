
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, IconButton, Flex, Text, Stack, For, Input} from "@chakra-ui/react"
import { IoMdArrowRoundBack } from "react-icons/io";
import api from '../api.js'
import { useState } from 'react';
import { IoSettingsOutline } from "react-icons/io5";
import { MdDeleteForever } from "react-icons/md";
import { IoAddOutline } from "react-icons/io5";
import { FaCheck } from "react-icons/fa6";
import { MdOutlineCancel } from "react-icons/md";


function RatiosPage() {

    const [error, setError] = useState(null);
    const [ratios, setRatios] = useState(null);
    const [editngRatio, setEditingRatio] = useState(null);
    const [editingId, setEditingId] = useState(null);


    const handleEditClick = (item) => {
        setEditingId(item._id);
        setEditingRatio(item.ratio);
    };

    const handleSave = async (id) => {
        if (editngRatio === '' || isNaN(editngRatio)) {
            setError("Please enter a valid number");
            return;
        }
        if(editngRatio.toString().replace('.', '').length  > 5){
            setError("Ratio must be less than 6 digits")
            return
        }
        try {
            await api.put(`/ratio/${id}`,{ "ratio": editngRatio});
        } catch (err) {
            setError(err.response?.data?.message || 'Update failed');
        }
        setEditingId(null);
        setEditingRatio(null)
        setError(null)
    };

    const handleCancel = async () => {
        setEditingId(null);
        setEditingRatio(null)
        setError(null)
    };

    const deleteRatio = async (id) => {
        try {
            await api.delete(`/ratio/${id}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Delete failed');
        }
    };

    const getRatios = async () => {
        try {
            const response = await api.get(`/ratio`);
            setRatios(response.data)
        } catch (err) {
            setError(err.response?.data?.message || 'Get ratios failed');
        }
    };
    getRatios()


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
            {error && <Text color="red.500" mb={3}>{error}</Text>}
            <Stack maxH="300px" overflowY="auto" scrollBehavior="smooth" marginBottom={5}>
                <For
                    each={ratios}
                >
                    {(item, index) => (
                    <Box borderWidth="1px" key={index} p="4" maxWidth={"full"}>
                        <Flex align={"center"} justify={"space-between"} wrap={"wrap"} width={"full"}>
                            {editingId === item._id ? (
                                <>
                                    <Flex gap={5} align={"center"} justify={"flex-start"}>
                                        <Text fontWeight="bold">{item.name}</Text>
                                        <Input
                                            value={editngRatio}
                                            onChange={(e) => setEditingRatio(e.target.value)}
                                            type="number"
                                            width={"40%"}
                                        />
                                    </Flex>
                                    <Flex gap={5} justify={"flex-end"}>
                                        <IconButton
                                            aria-label="Save"
                                            variant="outline"
                                            colorPalette="red"
                                            onClick={() => handleCancel()}
                                        >
                                            <MdOutlineCancel />
                                        </IconButton>
                                        <IconButton
                                            aria-label="Save"
                                            variant="outline"
                                            colorPalette="teal"
                                            onClick={() => handleSave(item._id)}
                                        >
                                            <FaCheck />
                                        </IconButton>
                                    </Flex>
                                </>
                                ) : (
                                <>
                                    <Flex gap={5}>
                                        <Text fontWeight="bold">{item.name}</Text>
                                        <Text color="fg.muted">Ratio: {item.ratio}</Text>
                                    </Flex>
                                    <Flex gap={5}>
                                        <IconButton aria-label="Search database" variant={"outline"} colorPalette={"teal"} onClick={() => handleEditClick(item)}>
                                            <IoSettingsOutline />
                                        </IconButton>
                                        <IconButton aria-label="Search database" variant={"outline"} colorPalette={"red"} onClick={() => deleteRatio(item._id)}>
                                            <MdDeleteForever />
                                        </IconButton>
                                    </Flex>
                                </>
                            )}
                        </Flex>
                    </Box>
                    )}
                </For>
            </Stack>
            <Flex justifyContent={"flex-start"}>
                <IconButton as={RouterLink} to="/create-ratio" aria-label="Search database" variant={"outline"} colorPalette={"teal"}>
                    <IoAddOutline />
                </IconButton>
            </Flex>
        </Box>
    )
    
}

export default RatiosPage