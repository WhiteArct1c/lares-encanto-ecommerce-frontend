import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { IProduct } from '../../utils/interfaces/IProduct';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { Box, Button, Typography } from '@mui/material';
import { ShoppingCartContext } from '../../contexts/ShoppingCartContext';
import { toast } from 'react-toastify';

interface ProductDetailsPageProps {
}

const ProductDetailsPage: React.FC<ProductDetailsPageProps> = () => {
   const [product, setProduct] = useState<IProduct>();
   const { id } = useParams();

   const cart = useContext(ShoppingCartContext);

   useEffect(() => {
      fetch(`http://localhost:3000/products/${id}`)
         .then(res => res.json())
         .then((data) => setProduct(data))
   }, [id])

   const handleAddProductOnCart = () => {
      cart!.addCartProduct(product!)
      toast.success("Produto adicionado ao carrinho!");
   }

   return (
      <>
         <Grid2
            container
            sx={{
               mt: 15,
               width: '100%',
               mb: 15
            }}
         >
            <Grid2
               container
               xs={6}
               paddingLeft={20}
            >
               <Grid2
                  xs={12}
                  sx={{
                     width: '100%',
                     maxHeight: '490px',
                     overflow: 'hidden',
                     pr: 10,
                     mb: 3
                  }}
               >
                  <Box
                     component='img'
                     src={product?.photoUrl}
                     sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain'
                     }}
                  />
               </Grid2>
               <Grid2
                  xs={12}
                  sx={{
                     width: '150px',
                     maxHeight: '150px',
                     overflow: 'hidden',
                     pr: 2,
                     mb: 3
                  }}
               >
                  <Box
                     component='img'
                     src={product?.photoUrl}
                     sx={{
                        width: '100%',
                        height: 'auto',
                        objectFit: 'cover'
                     }}
                  />
               </Grid2>
               <Grid2
                  xs={12}
                  sx={{
                     width: '150px',
                     maxHeight: '150px',
                     overflow: 'hidden',
                     pr: 2,
                     mb: 3
                  }}
               >
                  <Box
                     component='img'
                     src={product?.photoUrl}
                     sx={{
                        width: '100%',
                        height: 'auto',
                        objectFit: 'cover'
                     }}
                  />
               </Grid2>
               <Grid2
                  xs={12}
                  sx={{
                     width: '150px',
                     maxHeight: '150px',
                     overflow: 'hidden',
                     pr: 2,
                     mb: 3
                  }}
               >
                  <Box
                     component='img'
                     src={product?.photoUrl}
                     sx={{
                        width: '100%',
                        height: 'auto',
                        objectFit: 'cover'
                     }}
                  />
               </Grid2>
            </Grid2>
            <Grid2
               xs={6}
            >
               <Grid2
                  sx={{ mb: 1 }}
               >
                  <Typography fontWeight={700} fontSize={40} fontFamily={'Public Sans'}>{product?.name}</Typography>
               </Grid2>
               <Grid2
                  xs
                  sx={{ mb: 5 }}
               >
                  <Typography fontWeight={500} fontSize={25} fontFamily={'Public Sans'}>R$ {product?.price}</Typography>
               </Grid2>
               <Grid2
                  xs
                  sx={{ mb: 3 }}
               >
                  <Typography fontWeight={400} fontSize={17} fontFamily={'Public Sans'}>{product?.description}</Typography>
               </Grid2>
               <Grid2
                  xs={12}
                  sx={{ mb: 10 }}
               >
                  <Typography fontWeight={200} fontSize={17} fontFamily={'Public Sans'}>Vendido por: {product?.vendor}</Typography>
               </Grid2>
               <Grid2
                  xs={12}
                  sx={{
                     display: 'flex',
                     height: 60,
                     width: '100%'
                  }}
               >
                  <Button
                     variant='contained'
                     sx={{
                        bgcolor: '#000',
                        width: '350px',
                        fontWeight: 800,
                        '&:hover': {
                           bgcolor: '#fff',
                           color: '#000'
                        }
                     }}
                     onClick={handleAddProductOnCart}
                  >
                     Adicionar ao carrinho  - R$ {product?.price}
                  </Button>
               </Grid2>
            </Grid2>
         </Grid2>
      </>
   );
};

export default ProductDetailsPage;