import { Button, Divider, Typography, Box } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import React, { useContext, useEffect, useState } from 'react';
import { Link, To } from 'react-router-dom';
import { ShoppingCartContext } from '../../contexts/ShoppingCartContext';
import { OrderContext } from '../../contexts/OrderContext/OrderContext.tsx';
import CartOrderComponent from '../CartOrderComponent';
import CouponSelectionComponent from '../CouponSelectionComponent';
import {ProductService} from "../../services/ProductService.ts";

interface OrderResumeComponentProps {
   redirectUrl: To,
   buttonLabel: string
}

const OrderResumeComponent: React.FC<OrderResumeComponentProps> = ({redirectUrl, buttonLabel}:OrderResumeComponentProps) => {
   const [totalPrice, setTotalPrice] = useState(0);

   const cart = useContext(ShoppingCartContext);
   const order = useContext(OrderContext);
   const productService = new ProductService();

   const handleStartOrder = () => {
      order!.setOrderProducts(cart!.cartProducts);
      order!.updateOrderTotalPrice(totalPrice);
   }

   useEffect(() => {
      let price: number = 0

      cart?.cartProducts.map(productItem => {
         price += productItem.product.salePrice * productItem.quantity;
      })

      setTotalPrice(price);

   }, [cart?.cartProducts, order]);

   return (
      <Box
         sx={{
            display:'flex', 
            flexDirection:'column',
            border:'1px solid #777', 
            padding:2, 
            borderRadius:2, 
            minHeight: '400px',
            maxHeight: 'calc(100vh - 150px)',
            position: 'sticky',
            top: 100,
            alignSelf: 'flex-start',
            width: '100%',
            maxWidth: '100%',
            boxSizing: 'border-box',
            overflow: 'hidden',
            zIndex: 1,
         }}
      >
         <Box sx={{ 
            overflowY: 'auto', 
            overflowX: 'hidden',
            flex: '1 1 auto',
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            pr: 1,
            width: '100%',
            maxWidth: '100%'
         }}>
            {redirectUrl !== '/checkout' &&
               <CartOrderComponent/>
            }
            <Typography
               fontFamily={'Public Sans'}
               fontSize={'2rem'}
               fontWeight={600}
               color={'#000'}
            >
               Resumo do pedido
            </Typography>
            {redirectUrl === '/checkout' && (
               <Box sx={{ 
                  width: '100%',
                  maxWidth: '100%',
                  flexShrink: 0,
                  boxSizing: 'border-box',
                  overflow: 'hidden'
               }}>
                  <CouponSelectionComponent orderTotal={totalPrice + (order?.shippingPrice || 0)} />
               </Box>
            )}
            <Box sx={{display:'flex', justifyContent:'space-between', width: '100%'}}>
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
                  {productService.formatProductPrice(totalPrice)}
               </Typography>
            </Box>
            <Box sx={{display:'flex', justifyContent:'space-between', width: '100%'}}>
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
                  {
                     order?.shippingPrice === undefined || order?.shippingPrice === 0 ?
                        'Calculado no checkout'
                     :
                        `R$ ${order?.shippingPrice}`
                  }
               </Typography>
            </Box>
            <Box sx={{display:'flex', justifyContent:'space-between', width: '100%'}}>
               <Typography
                   fontFamily={'Public Sans'}
                   fontSize={'1rem'}
                   fontWeight={400}
                   color={'#000'}
               >
                  Prazo
               </Typography>
               <Typography
                   fontFamily={'Public Sans'}
                   fontSize={'1rem'}
                   fontWeight={400}
                   color={'#000'}
               >
                  {
                     order?.shippingPrice === undefined || order?.shippingPrice === 0 ?
                         'Calculado no checkout'
                         :
                         `${order?.shippingType?.deliveryTime}`
                  }
               </Typography>
            </Box>
            {order?.orderCoupons && order.orderCoupons.length > 0 && (
               <Box sx={{display:'flex', justifyContent:'space-between', width: '100%'}}>
                  <Typography
                     fontFamily={'Public Sans'}
                     fontSize={'1rem'}
                     fontWeight={400}
                     color={'#000'}
                  >
                     Desconto (cupons)
                  </Typography>
                  <Typography
                     fontFamily={'Public Sans'}
                     fontSize={'1rem'}
                     fontWeight={400}
                     color={'success.main'}
                  >
                     - {productService.formatProductPrice(
                        order.orderCoupons.reduce((sum, coupon) => sum + coupon.amountToUse, 0)
                     )}
                  </Typography>
               </Box>
            )}
            <Divider/>
            <Box sx={{display:'flex', justifyContent:'space-between', width: '100%'}}>
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
                  {(() => {
                     const subtotal = order?.shippingPrice 
                        ? order.orderTotalPrice + order.shippingPrice 
                        : totalPrice;
                     const discount = order?.orderCoupons 
                        ? order.orderCoupons.reduce((sum, coupon) => sum + coupon.amountToUse, 0)
                        : 0;
                     return productService.formatProductPrice(Math.max(0, subtotal - discount));
                  })()}
               </Typography>
            </Box>
         </Box>
         {redirectUrl === '/checkout' && cart!.cartProducts.length > 0 && (
            <Box sx={{ 
               width: '100%', 
               flexShrink: 0, 
               pt: 2,
               borderTop: '1px solid #eee',
               boxSizing: 'border-box',
               overflow: 'hidden'
            }}>
               <Link 
                  to={redirectUrl} 
                  style={{ 
                     textDecoration: 'none', 
                     width: '100%', 
                     display: 'block',
                     boxSizing: 'border-box'
                  }}
               >
                  <Button
                     data-cy="btn-checkout"
                     sx={{
                        width:'100%',
                        maxWidth: '100%',
                        height:50,
                        color:'#fff',
                        fontWeight:600,
                        bgcolor:'#000',
                        boxSizing: 'border-box',
                        '&:hover':{
                           bgcolor:'#fff',
                           color:'#000'
                        }
                     }}
                     variant='contained'
                     onClick={handleStartOrder}
                  >
                     {buttonLabel}
                  </Button>
               </Link>
            </Box>
         )}
      </Box>
   );
};

export default OrderResumeComponent;