import React, { useContext } from 'react';
import { IProductItem } from '../../utils/interfaces/IProductItem';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { Box, Button, IconButton, Typography } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import { ShoppingCartContext } from '../../contexts/ShoppingCartContext';

interface ProductItemCardComponentProps {
   productItem: IProductItem
   context: string
}

const ProductItemCardComponent: React.FC<ProductItemCardComponentProps> = ({ productItem, context }: ProductItemCardComponentProps) => {

   const cart = useContext(ShoppingCartContext);

   const handleRemoveItem = () => {
      cart!.removeCartItemProduct(productItem.id)
   }

   const handleAddMoreItem = () => {
      cart!.addCartProduct(productItem.product)
   }

   const handleRemoveProduct = () => {
      cart!.removeCartProduct(productItem.id)
   }

   return (
      <Grid2
         container
         sx={{
            display: 'flex',
            alignItems: 'center'
         }}
      >
         {
            context === 'cart' ?
               <>
                  <Grid2
                     xs={3}
                     sx={{
                        padding: 2,
                        display: 'flex',
                     }}
                  >
                     <Box
                        component='img'
                        src={productItem.product.photoUrl}
                        sx={{
                           width: 150,
                           height: 150
                        }}
                     />
                  </Grid2>
                  <Grid2
                     xs={7}
                     sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1
                     }}
                  >
                     <Typography fontFamily={'Public Sans'} fontSize={30} fontWeight={600}>{productItem.product.name}</Typography>
                     <Grid2
                        sx={{
                           display: 'flex',
                           alignItems: 'center',
                           gap: 2
                        }}
                     >
                        <Typography fontFamily={'Public Sans'} fontSize={16} fontWeight={400}>Quantidade:</Typography>
                        <Box
                           sx={{ border: '1px solid #000', width: 120, height: 40, borderRadius: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                        >
                           <IconButton aria-label='addItem' onClick={handleAddMoreItem}>
                              <Add />
                           </IconButton>
                           <Typography fontWeight={600} fontSize={20}>{productItem.quantity}</Typography>
                           <IconButton aria-label='addItem' onClick={handleRemoveItem}>
                              <Remove />
                           </IconButton>
                        </Box>
                     </Grid2>
                     <Typography textAlign={'end'}>vendido por: {productItem.product.vendor}</Typography>
                     <Grid2 sx={{
                        display: 'flex',
                        justifyContent: 'space-between'
                     }}>
                        <Typography fontWeight={600} fontSize={20}>R$ {productItem.product.price}</Typography>
                        <Button
                           variant='text'
                           sx={{
                              color: '#999',
                              textDecoration: 'underline'
                           }}
                           onClick={handleRemoveProduct}
                        >
                           Remover
                        </Button>
                     </Grid2>
                  </Grid2>
               </>
               :
               <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, width: 400 }}>
                  <Grid2
                     xs={3}
                     sx={{
                        display: 'flex',
                        justifyContent: 'center'
                     }}
                  >
                     <Box
                        component='img'
                        src={productItem.product.photoUrl}
                        sx={{
                           maxWidth: 120,
                           maxHeight: 100
                        }}
                     />
                  </Grid2>
                  <Grid2
                     xs={7}
                     sx={{
                        display: 'flex',
                        flexDirection: 'column',
                     }}
                  >
                     <Typography fontFamily={'Public Sans'} fontSize={20} fontWeight={600}>{productItem.product.name}</Typography>
                     <Grid2
                        sx={{
                           display: 'flex',
                           alignItems: 'center',
                           gap: 2
                        }}
                     >
                        <Typography fontFamily={'Public Sans'} fontSize={16} fontWeight={400}>Quantidade:</Typography>
                        <Typography fontWeight={600} fontSize={15}>{productItem.quantity}</Typography>
                     </Grid2>
                     <Typography textAlign={'start'}>{productItem.product.vendor}</Typography>
                     <Grid2 sx={{
                        display: 'flex',
                        justifyContent: 'space-between'
                     }}>
                        <Typography fontWeight={600} fontSize={15}>R$ {productItem.product.price}</Typography>
                     </Grid2>
                  </Grid2>
               </Box>
         }
      </Grid2>
   );
};

export default ProductItemCardComponent;