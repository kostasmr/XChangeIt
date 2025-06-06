import { Box, Button, Input, Field, NativeSelect, Flex, IconButton,NumberInput} from "@chakra-ui/react"
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Link, Text } from '@chakra-ui/react';
import { FaRegUser } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { useState } from 'react';

import '../css/HomePage.css'
import api from '../api.js'
import { useUser } from '../UserContext';


function HomePage() {
    const { user } = useUser();

    const exchangeRates = {
        'eur->usd': 1.3764,
        'usd->eur': 1 / 1.3764,

        'eur->chf': 1.2079,
        'chf->eur': 1 / 1.2079,

        'eur->gbp': 0.8731,
        'gbp->eur': 1 / 0.8731,

        'usd->jpy': 76.72,
        'jpy->usd': 1 / 76.72,

        'chf->usd': 1.1379,
        'usd->chf': 1 / 1.1379,

        'gbp->cad': 1.5648,
        'cad->gbp': 1 / 1.5648,
    };

    const [amount, setAmount] = useState(1);
    const [fromCurrency, setFromCurrency] = useState('eur');
    const [toCurrency, setToCurrency] = useState('usd');
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleConvert = () => {
        if (fromCurrency === toCurrency) {
            setError("The type of currency is the same. Please choose differently");
            setResult(null); 
            return;
        }
        const key = `${fromCurrency}->${toCurrency}`;
        const rate = exchangeRates[key];

        const converted = (amount * rate).toFixed(4);
        setResult(converted);
        setError(null);
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
            <Box 
                bg="white" 
                width="100%"
                borderRadius="5px"
            >
                <Flex align={"center"} justify={"space-between"} padding={2}>
                    <Input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                        min={0}
                        step="0.1"
                        placeholder="Enter amount"
                        color={"black"}
                        width={"35%"}
                    />
                    <NativeSelect.Root width="35%" key={"plain"} variant={"plain"}>
                        <NativeSelect.Field placeholder="Euros" color={"black"} value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
                            <option value="usd">US Dollar</option>
                            <option value="gbp">British Pound</option>
                            <option value="jpy">JPY</option>
                            <option value="chf">Swiss Franc</option>
                            <option value="cad">CAD</option>
                        </NativeSelect.Field>
                        <NativeSelect.Indicator />
                    </NativeSelect.Root>
                </Flex>
            </Box>
            <Flex justify={"center"} padding={5}>
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAq0lEQVR4nO2UvQ3CMBCF3ZCsgMQkljJP6mwRRoAOJZtQwCKgzED1ISNHihwn5x9Kf9I1tnXPz/I9pQo5AB3hvIEzUO01bE05awNx9FvNNfCxpRPcNrMT3+YReC1uMQGnBJEf7uIBuHusPoH6HwLXnfe8ZQtEHRAoAiLlibwI3/yS/U3ZHtTHalBT54DQqLGRa2gSRLQYliZqiWOU4t4VqKzI7CSELtZtQS35Ao2HRjghsRAxAAAAAElFTkSuQmCC" alt="refresh--v1"></img>
            </Flex>
            <Box 
                bg="white" 
                width="100%"
                borderRadius="5px"
                marginBottom={5}
            >
                <Flex align={"center"} justify={"space-between"} padding={2}>
                    <Input
                        type="number"
                        value={result}
                        min={0}
                        step="0.01"
                        placeholder="1.376"
                        color={"black"}
                        width={"35%"}
                    />
                    <NativeSelect.Root width="35%" key={"plain"} variant={"plain"}>
                        <NativeSelect.Field placeholder="US Dollar" color={"black"} value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
                            <option value="eur">Euros</option>
                            <option value="gbp">British Pound</option>
                            <option value="jpy">JPY</option>
                            <option value="chf">Swiss Franc</option>
                            <option value="cad">CAD</option>
                        </NativeSelect.Field>
                        <NativeSelect.Indicator />
                    </NativeSelect.Root>
                </Flex>
            </Box>

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
            <Text>{amount} {fromCurrency.toUpperCase()} = {' '}
                <Text as={"span"} color={"teal"}>{result}</Text> {toCurrency.toUpperCase()}
            </Text>
        </Box>
    )
}

export default HomePage