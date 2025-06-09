
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Box, Button, IconButton, Flex, Field, Input, Text} from "@chakra-ui/react"
import { IoMdArrowRoundBack } from "react-icons/io";
import api from '../api.js'
import { useState } from 'react';



function RatiosPage() {

    const [error, setError] = useState(null);
    const [currency1, setCurrency1] = useState(null);
    const [currency2, setCurrency2] = useState(null);
    const [ratio, setRatio] = useState(null);
    const [cur1Error, setCur1Error] = useState(null);
    const [cur2Error, setCur2Error] = useState(null);
    const [ratioError, setRatioError] = useState(null);

    const navigate = useNavigate("");

    const validateCurrency1 = (currency) => {
        if(currency.length != 3 || !/^[A-Za-z]+$/.test(currency)){
            setCur1Error("Please enter 3 characters (EUR, USD etc.)")
            return
        }else{
            setCur1Error(null)
            return
        }
    }

    const validateCurrency2 = (currency) => {
        if(currency.length != 3 || !/^[A-Za-z]+$/.test(currency)){
            setCur2Error("Please enter 3 characters (EUR, USD etc.)")
            return
        }else if (currency == currency1){
            setCur2Error("Same currency")
            return
        }else{
            setCur2Error(null)
            return
        }
    }

    const validateRatio = (ratio) => {
        if (ratio === '' || isNaN(ratio)) {
            setRatioError("Please enter a valid number");
            return;
        } else if(ratio.toString().replace('.', '').length  > 5){
            setRatioError("Ratio must be less than 6 digits")
            return
        }else{
            setRatioError(null)
            return
        }
    }
    const addRatio = async () =>{
        try {
            const res = await api.post(`/ratio`, { 
                "from": currency1,
                "to": currency2,
                "ratio": ratio
            });
            if(res?.data?.success == false){
                setError("Ratio already exists")
                return
            }
            setError(null)
            navigate('/ratios');
        } catch (err) {
            setError(err.response?.data?.message || 'Add a ratio failed');
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
            <Flex align={"center"} justify={"space-between"} marginBottom={"10"} >
                <IconButton as={RouterLink} to="/ratios" aria-label="Search database" key={"solid"} colorPalette={"teal"}>
                    <IoMdArrowRoundBack/>
                </IconButton>
                <h2 className="brand"><a>X</a>ChangeIt</h2>
            </Flex>
            {error && <Text color="red.500" mb={3}>{error}</Text>}

            <Field.Root marginBottom={5}>
                <Field.Label>First currency</Field.Label>
                <Input 
                    value={currency1}
                    onChange={(e) => {
                        setCurrency1(e.target.value)
                        validateCurrency1(e.target.value)
                    }}
                    borderColor={cur1Error ? 'red.500' : ''}
                />
                {cur1Error && <Text color="red.500">{cur1Error}</Text>}
            </Field.Root>
            <Field.Root marginBottom={5}>
                <Field.Label>Second currency</Field.Label>
                <Input 
                    value={currency2}
                    onChange={(e) => {
                        setCurrency2(e.target.value)
                        validateCurrency2(e.target.value)
                    }}
                    borderColor={cur2Error ? 'red.500' : ''}
                />
                {cur2Error && <Text color="red.500">{cur2Error}</Text>}
            </Field.Root>
            <Field.Root marginBottom={5}>
                <Field.Label>Ratio</Field.Label>
                <Input 
                    value={ratio}
                    onChange={(e) => {
                        setRatio(e.target.value)
                        validateRatio(e.target.value)
                    }}
                    borderColor={ratioError ? 'red.500' : ''}
                />
                {ratioError && <Text color="red.500">{ratioError}</Text>}
            </Field.Root>
            <Button 
                colorPalette={"teal"} 
                fontWeight={"bold"}
                width={"full"}
                marginBottom={5}
                onClick={addRatio}
            > Add</Button>
        </Box>
    )
    
}

export default RatiosPage