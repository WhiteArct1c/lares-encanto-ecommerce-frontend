import React, { useContext } from 'react';
import { ShoppingCartContext } from '../../contexts/ShoppingCartContext';
import Grid2 from '@mui/material/Unstable_Grid2';
import { Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import './styles.css';
import ProductItemCardComponent from '../../shared/ProductItemCardComponent';
import OrderResumeComponent from '../../shared/OrderResumeComponent';

interface ShoppingCartPageProps {
   
}

const ShoppingCartPage: React.FC<ShoppingCartPageProps> = () => {

   const cart = useContext(ShoppingCartContext);

   return (
      <Grid2 
         container
         sx={{
            width: '100%',
            mt:15,
            pl: 10,
            mb: 20,
            display:'flex',
            // justifyContent:'space-between',
            // '*':{
            //    border:'1px solid red'
            // }
         }}
      >
         <Grid2 xs={12} sx={{height:100}}>
            <Typography
               fontFamily={'Public Sans'}
               fontSize={'2.5rem'}
               fontWeight={600}
               color={'#000'}
            >
               Seu Carrinho
            </Typography>
            <Typography
               fontFamily={'Public Sans'}
               fontSize={'1rem'}
               fontWeight={400}
               color={'#000'}
               sx={{
                  mb: 5
               }}
            >
               Ainda não quer finalizar sua compra? <Link to='/products' className='link-redirect'>Continue comprando!</Link>
            </Typography>
         </Grid2>
         <Grid2 xs={6}>
            {
               cart!.cartProducts.length >= 0 ?
                  cart!.cartProducts.map((cartProduct, index) => {
                     return(
                        <ProductItemCardComponent key={index} productItem={cartProduct} context='cart'/>
                     )
                  })
               :
                  //TODO: Colocar componente de "Sem compras"
                  <span>Sem compras irmão...</span>
            }
         </Grid2>
         <OrderResumeComponent
            redirectUrl={'/checkout'}
            buttonLabel='Continuar para o checkout'
         />
      </Grid2>
   );
};

export default ShoppingCartPage;