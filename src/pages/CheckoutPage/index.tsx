import { Typography } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import React from 'react';
import OrderResumeComponent from '../../shared/OrderResumeComponent';

interface CheckoutPageProps {
   
}

const CheckoutPage: React.FC<CheckoutPageProps> = () => {
   return (
      <Grid2
         container
         xs={12}
         sx={{mt:15, mb:30, width:'100%'}}
      >
         <Grid2 xs={12}>
            <Typography
               fontFamily={'Public Sans'}
               fontSize={'2.5rem'}
               fontWeight={600}
               color={'#000'}
               sx={{
                  ml:20
               }}
            >
               Checkout
            </Typography>
         </Grid2>
         <Grid2 container xs={12}>
            <Grid2 xs={6}>
               
            </Grid2>
            <Grid2 >
               <OrderResumeComponent 
                  redirectUrl={'/shipping'}
                  buttonLabel='Continuar para o frete'
               />
            </Grid2>
         </Grid2>

      </Grid2>
   );
};

export default CheckoutPage;