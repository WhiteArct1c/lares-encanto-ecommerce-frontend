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
   const api = useApi();

   // const userContext = useContext(AuthContext);

    const loadCreditCards = async () => {
        const data = await api.listCreditCards();
        setCreditCards(data.data);
    }

   useEffect(() => {
        async function loadPaymentMethods() {
            const data = await api.getPaymentTypes();
            setPaymentMethods([...data]);
        }
        loadPaymentMethods();
        loadCreditCards();
   }, []);

   const handlePaymentMethodChange = (method: string) => {
      setActualMethod(method);
   }
   
   return (
      <Grid2 container sx={{m:3, display:'flex', justifyContent:'center', gap:2}} spacing={2}>
         <Grid2 xs={12} sx={{border:'1px solid black', borderRadius:1}}>
            <Typography fontFamily={'Public Sans'} fontWeight={500} fontSize={20}>Seus cartões</Typography>
            <Divider sx={{mb:3}}/>
            <Grid2 container xs={12} spacing={2}>
               {
                   creditCards.length ?
                       creditCards.map((card, index) => {
                        return(
                           <Grid2 key={index} xs={4}>
                              <Card 
                                 sx={{
                                    width:'100%', 
                                    mb:2, 
                                    border:'1px solid #2d2d2d', 
                                    height:'160px'
                                 }}
                              >
                                 <CardContent>
                                    <Typography fontFamily={'Public Sans'} fontWeight={600} variant='h6'>
                                       {card.cardNumber}
                                    </Typography>
                                    <Typography fontFamily={'Public Sans'}>
                                       {card.cardName}
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
         <Grid2 xs={12}>
            {
               actualMethod === 'Cartão de Crédito' ?
                  <CreditCardFormComponent/>
               :
                  <></>
            }
         </Grid2>
      </Grid2>
   );
};

export default PaymentMethodsOrderComponent;