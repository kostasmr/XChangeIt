import { Box, Button, Input, NativeSelect, Flex, IconButton, Text} from "@chakra-ui/react"
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { FaRegUser } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { useState, useEffect } from 'react';
import { TbArrowsExchange } from "react-icons/tb";

import '../css/HomePage.css'
import api from '../api.js'
import { useUser } from '../UserContext';


function HomePage() {
    const { user } = useUser();

    const [amount, setAmount] = useState("");
    const [fromCurrency, setFromCurrency] = useState(null);
    const [toCurrency, setToCurrency] = useState(null);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const [ratios, setRatios] = useState([]);
    useEffect(() => {
        const fetchRatios = async () => {
            try {
                const response = await api.get('/ratio');
                setRatios(response.data); 
            } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch ratios');
            }
    };
        fetchRatios();
    }, []);

    const uniqueFromCurrencies = Array.from(
        new Set(ratios.map(item => item.from))
    );

    const getIdByName = (name) => {
        const match = ratios.find(item => item.name === name);
        return match ? match._id : null;
     };

    const handleConvert = async () => {
        if(amount == null){
            setError("Enter amount")
            setResult(null)
            return
        }else if(isNaN(parseFloat(amount))){
            setError("Enter a number")
            setResult(null)
            return
        }else if(fromCurrency == null || toCurrency == null){
            setError("Choose currency")
            setResult(null)
            return
        }
        setError(null)
        
        const ratioName = `${fromCurrency.toUpperCase()}->${toCurrency.toUpperCase()}`;
        const ratioId = getIdByName(ratioName)
        try {
            const response = await api.get(`/ratio/${ratioId}`);
            const rate = response.data.ratio
            const converted = (amount * rate).toFixed(3);
            setResult(converted);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch ratio by name:', err);
        }
    };

    const handleLogout = async () => {
        try {
            await api.get(`/user/logout${user.email}`);

            localStorage.removeItem('token');
            console.log("user with email: "+user.email+" logout successfully.")
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Logout failed');
        }
    };

    const goToProfile = () => {
        navigate('/profile', { state: { user } });
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
            <Flex align={"center"} justify={"space-between"} width={"full"}>
                <IconButton aria-label="Search database" variant={"solid"} colorPalette={"teal"} onClick={handleLogout}>
                        <BiLogOut />
                </IconButton>
                <h2 className="brand"><a>X</a>ChangeIt</h2>
                <IconButton onClick={goToProfile} aria-label="Search database" variant={"solid"} colorPalette={"teal"} >
                        <FaRegUser />
                </IconButton>
            </Flex>
            <h3>Convert money at the real exchange rate</h3>
            <Flex align={"stretch"} justify={"space-between"} wrap={"wrap"}>
                <Box
                    borderRadius="5px"
                    borderWidth="1px"
                    borderColor="teal"
                    color="fg.disabled"
                    bg={"white"}
                    display={"flex"}
                    alignItems={"center"}
                    width={"60%"}
                    height={"60px"}
                    marginBottom={3}
                >
                    <Input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(parseFloat(e.target.value) || "")}
                        min={0}
                        placeholder="Enter amount"
                        color={"black"}
                        display="flex"
                        alignItems="center"
                        height={"full"}
                        bg="transparent"           
                        border="none" 
                    />
                </Box>
                <Flex gap={3}>
                    <Box 
                        borderRadius="5px"
                        borderWidth="1px"
                        borderColor="teal"
                        color="fg.disabled"
                        height={"60px"}
                        marginBottom={5}
                    >
                        <NativeSelect.Root key={"select-from"} variant={"plain"} height={"full"}>
                            <NativeSelect.Field placeholder="Select" color={"white"} height={"full"} value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>  
                                {uniqueFromCurrencies.map((currency) => (
                                    <option key={currency} value={currency}>
                                        {currency}
                                    </option>
                                ))}
                            </NativeSelect.Field>
                            <NativeSelect.Indicator />
                        </NativeSelect.Root>
                    </Box>
                    <Box display={"flex"} alignItems={"center"} height={"60px"} marginBottom={5}>
                        <TbArrowsExchange size={20}/>
                    </Box>
                    <Box 
                        borderRadius="5px"
                        borderWidth="1px"
                        borderColor="teal"
                        color="fg.disabled"
                        height={"60px"}
                        marginBottom={5}
                    >
                        <NativeSelect.Root key={"select-to"} variant={"plain"} height={"full"}>
                            <NativeSelect.Field 
                                placeholder="Select" 
                                color={"white"} 
                                height={"full"} 
                                value={toCurrency} 
                                onChange={(e) => setToCurrency(e.target.value)}>  
                                {ratios
                                    .filter((item) => item.from === fromCurrency)
                                    .map((item) => (
                                        <option key={item.to} value={item.to}>
                                            {item.to}
                                        </option>
                                ))}
                            </NativeSelect.Field>
                            <NativeSelect.Indicator />
                        </NativeSelect.Root>
                    </Box>
                </Flex>
            </Flex>


            <Button 
                colorPalette={"teal"} 
                width={"full"}
                marginBottom={5}
                fontWeight={"bold"}
                onClick={handleConvert}
            >
                Convert
            </Button>
            <Text color="red.500" fontWeight="medium" mt={2} error marginBottom={5}>
                {error}
            </Text>
            {result && 
                <>
                    <Text marginBottom={5}>{amount} {fromCurrency.toUpperCase()} = {' '}
                        <Text as={"span"} color={"teal"}>{result} </Text>{toCurrency.toUpperCase()}
                    </Text>
                    <Flex justify={"center"}>
                        <IconButton as={RouterLink} to="/ratios" variant={"outline"} colorPalette={"teal"} padding={4}>Explore Ratios</IconButton>
                    </Flex>
                </>
            }
        </Box>
    )
}

export default HomePage