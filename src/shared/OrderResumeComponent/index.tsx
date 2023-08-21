import { Button, Divider, TextField, Typography } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import React, { useContext, useEffect, useState } from 'react';
import { Link, To } from 'react-router-dom';
import { ShoppingCartContext } from '../../contexts/ShoppingCartContext';
import { IOrder } from '../../utils/interfaces/Order';
import { OrderStatusEnum } from '../../utils/enum/OrderStatusEnum';

interface OrderResumeComponentProps {
   redirectUrl: To,
   buttonLabel: string
   shipmentPrice?: string
}

const OrderResumeComponent: React.FC<OrderResumeComponentProps> = ({redirectUrl, buttonLabel, shipmentPrice}:OrderResumeComponentProps) => {
   
   const cart = useContext(ShoppingCartContext);

   const [totalPrice, setTotalPrice] = useState(0);
   //TODO: ordem vai virar um context provavelmente
   const [order, setOrder] = useState<IOrder>();
   const [shippingPrice, setShippingPrice] = useState('');

   const actualDate = new Date();


   const handleSubmitOrder = () => {
      const newOrder: IOrder = {
         products: cart!.cartProducts,
         shippingPrice: shipmentPrice!,
         totalPrice: totalPrice.toString(),
         createdAt: actualDate,
         status: OrderStatusEnum.EM_PROCESSAMENTO
      }

      setOrder(newOrder);
   }

   useEffect(() => {
      let price: number = 0

      cart?.cartProducts.map(productItem => {
         price += parseFloat(productItem.product.price) * productItem.quantity;
      })

      setTotalPrice(price)

   }, [cart?.cartProducts])

   return (
      <Grid2 container 
         sx={{
            display:'flex', 
            flexDirection:'column',
            gap:3, 
            ml:20, 
            border:'1px solid #777', 
            padding:2, 
            borderRadius:2, 
            maxHeight:500,
         }}
      >
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
               R$ {totalPrice}
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
               {shipmentPrice || 'Calculado no checkout'}
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
            {redirectUrl === '/checkout' &&
               <Link to={redirectUrl}>
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
                     onClick={handleSubmitOrder}
                     variant='contained'
                  >
                     {buttonLabel}
                  </Button>
               </Link>
            }
         </Grid2>
      </Grid2>
   );
};

export default OrderResumeComponent;