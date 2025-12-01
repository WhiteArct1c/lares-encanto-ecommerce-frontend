import { Button, Card, CardContent, Chip, Divider, Typography } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import React, { useEffect, useState } from 'react';
import { IPaymentMethods } from '../../utils/interfaces/IPaymentMethods';
import CreditCardFormComponent from '../CreditCardFormComponent';
import { useApi } from '../../hooks/useApi';
import {CreditCardRequest} from "../../utils/types/request/CreditCard/CreditCardRequest.ts";

interface PaymentMethodsOrderComponentProps {

}

const PaymentMethodsOrderComponent: React.FC<PaymentMethodsOrderComponentProps> = () => {

   const [paymentMethods, setPaymentMethods] = useState<IPaymentMethods[]>([]);
   const [actualMethod, setActualMethod] = useState('Cartão de Crédito');
   const [creditCards, setCreditCards] = useState<CreditCardRequest[]>([]);
   const [selectedCard, setSelectedCard] = useState<CreditCardRequest | null>(null);

   const api = useApi();

   // const userContext = useContext(AuthContext);

    const loadCreditCards = async () => {
        const data = await api.listCreditCards();
        setCreditCards(data.data);
    }

    const handlePaymentMethodChange = (method: string) => {
        setActualMethod(method);
    }

    const handleSelectedCard = (event: React.MouseEvent<HTMLElement>) => {
        const ccName = event.currentTarget.innerText.match(/\d+/g);
        if(ccName !== null){
            const card = creditCards.find((card) =>  String(card.cardNumber) === ccName[0]);
            if(card !== undefined){
                setSelectedCard(card);
            }
        }
    }

    useEffect(() => {
        async function loadPaymentMethods() {
            const data = await api.getPaymentTypes();
            setPaymentMethods([...data]);
        }
        loadPaymentMethods();
        loadCreditCards();
    }, []);
   
   return (
    <Grid2 container sx={{width: '100%', mt:2, ml:2,  display:'flex', justifyContent:'center', gap:2}} spacing={3}>
        <Grid2 xs={12} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <Typography
                fontFamily={'Public Sans'}
                fontSize={'1.2rem'}
                fontWeight={500}
                color={'#000'}
            >
                Formas de Pagamento:
            </Typography>
            {paymentMethods.map((method, index)=> {
                return(
                    <Button
                        key={index}
                        variant='contained'
                        sx={{
                            bgcolor: '#000',
                            color: 'white',
                            height:50,
                            '&:hover': {
                              bgcolor: 'white',
                              color: 'black',
                            },
                            ml:5
                        }}
                        onClick={() => handlePaymentMethodChange(method.name)}
                    >
                        {method.name}
                    </Button>
                )
            })}
        </Grid2>
         <Grid2 xs={12} sx={{border:'1px solid black', borderRadius:1}}>
            <Typography fontFamily={'Public Sans'} fontWeight={500} fontSize={20}>Seus cartões</Typography>
            <Divider sx={{mb:3}}/>
            <Grid2 container xs={12} spacing={2}>
               {
                   creditCards.length ?
                       creditCards.map((card, index) => {
                        return(
                           <Grid2
                                key={index}
                                xs={3}
                                onClick={handleSelectedCard}
                                sx={{
                                    cursor: 'pointer',
                                    transition: '0.2s linear',
                                    '&:hover': {
                                        scale: 1.05,
                                        transition: '0.2s linear',
                                        bgColor: '#f0f0f0',
                                    },
                                    display:'flex',
                                }}
                           >
                              <Card 
                                    sx={{
                                        width:'100%',
                                        border:'1px solid #2d2d2d',
                                        height:'160px',
                                    }}
                              >
                                 <CardContent>
                                    <Typography fontFamily={'Public Sans'} fontWeight={600} variant='h6'>
                                        {card.cardName}
                                    </Typography>
                                    <Typography fontFamily={'Public Sans'}>
                                        {card.cardNumber}
                                    </Typography>
                                    <Typography fontFamily={'Public Sans'}>
                                        {card.cardFlag}
                                    </Typography>
                                    {
                                       card.mainCard ?
                                          <Chip
                                             label='Principal'
                                             sx={{bgcolor:'#484646', color:'#fff', mt:1}}
                                          />
                                       :
                                          <></>
                                    }
                                 </CardContent>
                              </Card>
                           </Grid2>
                        )
                     })
                     :
                     <Grid2 xs={12} sx={{
                        display:'flex', 
                        justifyContent:'center', 
                        alignItems:'start',
                        height:70
                     }}>
                        <Typography fontFamily={'Public Sans'} fontWeight={500} fontSize={20}>
                           Nenhum cartão cadastrado
                        </Typography>
                     </Grid2>
               }
            </Grid2>
         </Grid2>
         <Grid2 xs={12}>
            {
               actualMethod === 'Cartão de Crédito' ?
                  <CreditCardFormComponent
                        selectedCard={selectedCard || undefined}
                        availableCreditCards={creditCards}
                  />
               :
                  <></>
            }
         </Grid2>
      </Grid2>
   );
};

export default PaymentMethodsOrderComponent;