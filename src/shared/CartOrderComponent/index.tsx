import React, { useContext } from 'react';
import { Box, Divider, Typography } from '@mui/material';
import ProductItemCardComponent from '../ProductItemCardComponent';
import { ShoppingCartContext } from '../../contexts/ShoppingCartContext';

interface CartOrderComponentProps {
   
}

const CartOrderComponent: React.FC<CartOrderComponentProps> = () => {

   const cart = useContext(ShoppingCartContext);
   
   return (
      <>
         <Typography
            fontFamily={'Public Sans'}
            fontSize={'1.6rem'}
            fontWeight={500}
            color={'#000'}
         >
            Seu carrinho
         </Typography>
         <Box sx={{display:'flex', width:440, flexDirection:'column', gap:1, overflowY:'scroll', height:190, position: 'relative'}}>
            {
               cart?.cartProducts.map(productOrder => {
                  return(
                     <>
                        <ProductItemCardComponent
                           productItem={productOrder}
                           context='checkout'
                        />
                        <Divider/>
                     </>
                     
                  )
               })
            }
            
         </Box>
         <Divider/>
      </>
   );
};

export default CartOrderComponent;