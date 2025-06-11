import { Box, Button, Input, NativeSelect, Flex, IconButton, Text, Switch, Spinner} from "@chakra-ui/react"
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { FaRegUser } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { useState, useEffect } from 'react';
import { TbArrowsExchange } from "react-icons/tb";
import { useUser } from '../UserContext';

import '../css/HomePage.css'
import api from '../api.js'
import externalApi from '../externalApi.js'



function HomePage() {
    const { user } = useUser();
    const [amount, setAmount] = useState(null);
    const [fromCurrency, setFromCurrency] = useState(null);
    const [toCurrency, setToCurrency] = useState(null);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [checked, setChecked] = useState(false)
    const navigate = useNavigate();
    const [ratios, setRatios] = useState([]);
    const [externalCurrencies, setExternalCurrencies] = useState("")
    const [externalRatios, setExternalRatios] = useState("")
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRatios = async () => {
            setLoading(true);
            try {
                const response = await api.get('/ratio');
                setRatios(response.data); 
                setError(null)
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch custom ratios');
            } finally {
                setLoading(false);
            }
        };
        fetchRatios();
        fetchExternalCurrencies();
    }, []);

    const fetchExternalCurrencies = async () => {
        setLoading(true);
        try {
            const response = await externalApi.get('/currencies.min.json')
            setExternalCurrencies(response.data)
            setError(null)
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch external currencies');
        } finally {
            setLoading(false);
        }
    };


    const fetchExternalRatios = async (currency) => {
        setLoading(true);
        try {
            if(checked){
                const response = await externalApi.get(`/currencies/${currency}.json`)

                const ratios = response.data[currency];

                if (Object.keys(ratios).length === 0) {
                    setError("Ratio for this currency doesn't exist");
                    setExternalRatios(null);
                    return;
                }

                setExternalRatios(ratios);
                setError(null);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch external ratios');
        } finally {
            setLoading(false);
        }
    }

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
        }else if(fromCurrency == null || toCurrency == null || toCurrency == ""){
            setError("Choose currency")
            setResult(null)
            return
        }
        setError(null)
        
        const ratioName = `${fromCurrency.toUpperCase()}->${toCurrency.toUpperCase()}`;
        if(!checked){
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
        }else{
            const ratio = externalRatios[toCurrency]
            const converted = (amount * ratio).toFixed(3);
            setResult(converted);
            setError(null);
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
            borderColor={'white'}
            color="fg.disabled"
            padding="30px"
            width="100%"
            animation={checked ? `borderPulse 2s infinite` : 'white'}
            >
            <Flex align={"center"} justify={"space-between"} width={"full"} wrap={"wrap"}>
                <IconButton aria-label="Search database" variant={"solid"} colorPalette={"teal"} onClick={handleLogout}>
                        <BiLogOut />
                </IconButton>
                <h2 className="brand"><a>X</a>ChangeIt</h2>
                <IconButton onClick={goToProfile} aria-label="Search database" variant={"solid"} colorPalette={"teal"} >
                        <FaRegUser />
                </IconButton>
            </Flex>
            <h3>Convert money at the real exchange rate</h3>
            {loading && <Spinner size="xl" color="teal" />}
            <Flex align={"stretch"} justify={"space-between"} wrap={"wrap"}>
                <Flex width={"50%"}>
                    <Box
                        borderRadius="5px"
                        borderWidth="1px"
                        borderColor="teal"
                        color="fg.disabled"
                        bg={"white"}
                        display={"flex"}
                        alignItems={"center"}
                        width={"full"}
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
                </Flex>
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
                            <NativeSelect.Field 
                                placeholder="- -" 
                                color={"white"} 
                                height={"full"} 
                                value={fromCurrency} 
                                onChange={(e) => {
                                    const selectedValue = e.target.value;
                                    setFromCurrency(selectedValue)
                                    setResult(null)
                                    setToCurrency("")
                                    fetchExternalRatios(selectedValue)
                                }}
                                >
                                {!checked ? uniqueFromCurrencies.map((currency) => (
                                    <option key={currency} value={currency}>
                                        {currency}
                                    </option>
                                    )) :
                                    Object.keys(externalCurrencies).map((currency) => (
                                    <option key={currency} value={currency}>
                                        {currency.toUpperCase()}
                                    </option>))
                                }
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
                                placeholder="- -" 
                                color={"white"} 
                                height={"full"} 
                                value={toCurrency} 
                                onChange={(e) => {
                                    setToCurrency(e.target.value)
                                    setResult(null)
                                }}
                                >  
                                {!checked ? ratios
                                    .filter((item) => item.from === fromCurrency)
                                    .map((item) => (
                                        <option key={item.to} value={item.to}>
                                            {item.to}
                                        </option>)) :
                                     externalRatios && Object.keys(externalRatios)
                                    .map((item) => (
                                        <option key={item} value={item}>
                                            {item.toUpperCase()}
                                        </option>))
                                }
                            </NativeSelect.Field>
                            <NativeSelect.Indicator />
                        </NativeSelect.Root>
                    </Box>
                </Flex>
            </Flex>


            <Button 
                colorPalette={"teal"} 
                width={"full"}
                fontWeight={"bold"}
                onClick={handleConvert}
            >
                Convert
            </Button>
            <Text color="red.500" fontWeight="medium" mt={5} error>
                {error}
            </Text>
            <Flex justify={"space-between"} align={"center"}>
                <IconButton as={RouterLink} to="/ratios" variant={"outline"} colorPalette={"teal"} padding={4}>Custom Ratios</IconButton>
                <Switch.Root
                    checked={checked}
                    onCheckedChange={(e) => {
                        setError(null)
                        setFromCurrency("")
                        setToCurrency("")
                        setResult(null)
                        setAmount("")
                        setChecked(e.checked)
                    }}
                    size={"lg"}
                    colorPalette={"teal"} 
                    defaultChecked
                >
                    <Switch.HiddenInput />
                    <Switch.Label color={ checked ? "teal": "gray"} fontSize={"16px"}>Live Ratios</Switch.Label>
                    <Switch.Control>
                        <Switch.Thumb />
                    </Switch.Control>
                </Switch.Root>
            </Flex>
            {result &&        
                <Text marginTop={5} fontSize={18}>{amount} {fromCurrency.toUpperCase()} = {' '}
                    <Text as={"span"} color={"teal"}>{result} </Text>{toCurrency.toUpperCase()}
                </Text>
            }

        </Box>
    )
}

export default HomePage