import { Button, Divider, Typography } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import React, { useEffect, useState } from 'react';
import { IPaymentMethods } from '../../utils/interfaces/IPaymentMethods';
import CreditCardFormComponent from '../CreditCardFormComponent';

interface PaymentMethodsOrderComponentProps {

}

const PaymentMethodsOrderComponent: React.FC<PaymentMethodsOrderComponentProps> = () => {

   const [paymentMethods, setPaymentMethods] = useState<IPaymentMethods[]>([]);
   const [actualMethod, setActualMethod] = useState('Cartão de Crédito');

   const apiURL = 'http://localhost:3000/paymentMethods';

   useEffect(() => {

      async function loadPaymentMethods() {
         fetch(apiURL)
            .then(res => res.json())
            .then(data => setPaymentMethods([...data]));

      }

      loadPaymentMethods();

   }, [])

   const handlePaymentMethodChange = (method: string) => {
      setActualMethod(method);
   }
   
   return (
      <Grid2 container sx={{m:3, display:'flex', justifyContent:'center', gap:3}} spacing={2}>
         <Grid2 xs={8} sx={{border:'1px solid black', borderRadius:1}}>
            <Typography fontFamily={'Public Sans'} fontWeight={500} fontSize={20}>Seus cartões</Typography>
            <Divider sx={{mb:5}}/>
            {/* TODO: seus cartões aqui */}
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
                        }
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