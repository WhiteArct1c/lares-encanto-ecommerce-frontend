import React, { useContext } from 'react';
import { ShoppingCartContext } from '../../contexts/ShoppingCartContext';
import Grid2 from '@mui/material/Unstable_Grid2';
import { Button, Divider, TextField, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import './styles.css';
import ProductItemCardComponent from '../../shared/ProductItemCardComponent';

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
            pr:10,
            mb: 30,
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
         <Grid2 xs={6} sx={{mr:10}}>
            {
               cart!.cartProducts.length >= 0 ?
                  cart!.cartProducts.map(cartProduct => {
                     return(
                        <ProductItemCardComponent productItem={cartProduct}/>
                     )
                  })
               :
                  //TODO: Colocar componente de "Sem compras"
                  <span>Sem compras irmão...</span>
            }
         </Grid2>
         <Grid2 xs={4} sx={{display:'flex', flexDirection:'column', gap:3, ml:10, border:'1px solid #777', padding:2, borderRadius:2, maxHeight:470}}>
            {/* TODO: ARRUMAR AQUI PRA MOSTRAR O VALOR REAL DO PEDIDO, CANDIDATO A VIRAR COMPONENTE DE RESUMO DE PEDIDO */}
            <Typography
               fontFamily={'Public Sans'}
               fontSize={'2rem'}
               fontWeight={600}
               color={'#000'}
            >
               Resumo do pedido
            </Typography>
            <Grid2 sx={{display:'flex', gap:3, mb:3}}>
               <TextField
                  fullWidth
                  id="cupom-input"
                  placeholder='Digite o código do cupom aqui'
                  variant="outlined" 
               />
               <Button
                  sx={{
                     width:220,
                     color:'#fff',
                     fontWeight:600,
                     bgcolor:'#000',
                     '&:hover':{
                        bgcolor:'#fff',
                        color:'#000'
                     }
                  }}
                  variant='contained'
               >
                  Aplicar cupom
               </Button>
            </Grid2>
            <Grid2 sx={{display:'flex', justifyContent:'space-between'}}>
               <Typography
                  fontFamily={'Public Sans'}
                  fontSize={'1rem'}
                  fontWeight={600}
                  color={'#000'}
               >
                  Subtotal
               </Typography>
               <Typography
                  fontFamily={'Public Sans'}
                  fontSize={'1rem'}
                  fontWeight={600}
                  color={'#000'}
               >
                  R$ 0,00
               </Typography>
            </Grid2>
            <Grid2 sx={{display:'flex', justifyContent:'space-between'}}>
               <Typography
                  fontFamily={'Public Sans'}
                  fontSize={'1rem'}
                  fontWeight={400}
                  color={'#000'}
               >
                  Frete
               </Typography>
               <Typography
                  fontFamily={'Public Sans'}
                  fontSize={'1rem'}
                  fontWeight={400}
                  color={'#000'}
               >
                 Calculado no checkout
               </Typography>
            </Grid2>
            <Divider/>
            <Grid2 sx={{display:'flex', justifyContent:'space-between'}}>
               <Typography
                  fontFamily={'Public Sans'}
                  fontSize={'1rem'}
                  fontWeight={600}
                  color={'#000'}
               >
                  Total
               </Typography>
               <Typography
                  fontFamily={'Public Sans'}
                  fontSize={'1rem'}
                  fontWeight={600}
                  color={'#000'}
               >
                 R$ 0,00
               </Typography>
            </Grid2>
            <Grid2>
               <Button
                  sx={{
                     width:'100%',
                     height:50,
                     mt:3,
                     color:'#fff',
                     fontWeight:600,
                     bgcolor:'#000',
                     '&:hover':{
                        bgcolor:'#fff',
                        color:'#000'
                     }
                  }}
                  variant='contained'
               >
                  Continuar para o checkout
               </Button>
         </Grid2>
         </Grid2>
         
      </Grid2>
   );
};

export default ShoppingCartPage;