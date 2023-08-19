import React, { useEffect, useState } from 'react';
import {useParams} from 'react-router-dom';
import { Product } from '../../utils/interfaces/Product';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { Box, Button, Typography } from '@mui/material';

interface ProductDetailsPageProps {

}

const ProductDetailsPage: React.FC<ProductDetailsPageProps> = () => {
   const [product, setProduct] = useState<Product>();
   const {id} = useParams();

   useEffect(() =>{
      fetch(`http://localhost:3000/products/${id}`)
      .then(res => res.json())
      .then((data) => setProduct(data))
   },[id])

   return (
      <>
         <Grid2 
            container 
            sx={{
               mt:10,
               width:'100%',
               mb:20
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
                     pr:10,
                     mb:3
                  }}
               >
                  <Box
                     component='img'
                     src={product?.photoUrl}
                     sx={{
                        width:'100%',
                        height: '100%',
                        objectFit:'contain'
                     }}
                  />
               </Grid2>
               <Grid2
                  xs={12}
                  sx={{
                     width: '150px',
                     maxHeight: '150px',
                     overflow: 'hidden',
                     pr:2,
                     mb:3
                  }}
               >
                  <Box
                     component='img'
                     src={product?.photoUrl}
                     sx={{
                        width:'100%',
                        height: 'auto',
                        objectFit:'cover'
                     }}
                  />
               </Grid2>
               <Grid2
                  xs={12}
                  sx={{
                     width: '150px',
                     maxHeight: '150px',
                     overflow: 'hidden',
                     pr:2,
                     mb:3
                  }}
               >
                  <Box
                     component='img'
                     src={product?.photoUrl}
                     sx={{
                        width:'100%',
                        height: 'auto',
                        objectFit:'cover'
                     }}
                  />
               </Grid2>
               <Grid2
                  xs={12}
                  sx={{
                     width: '150px',
                     maxHeight: '150px',
                     overflow: 'hidden',
                     pr:2,
                     mb:3
                  }}
               >
                  <Box
                     component='img'
                     src={product?.photoUrl}
                     sx={{
                        width:'100%',
                        height: 'auto',
                        objectFit:'cover'
                     }}
                  />
               </Grid2>
            </Grid2>
            <Grid2
               xs={6}
            >
               <Grid2
                  sx={{mb:1}}
               >
                  <Typography fontWeight={700} fontSize={40} fontFamily={'Public Sans'}>{product?.name}</Typography>
               </Grid2>
               <Grid2
                  xs
                  sx={{mb:5}}
               >
                  <Typography fontWeight={500} fontSize={25} fontFamily={'Public Sans'}>{product?.price}</Typography>
               </Grid2>
               <Grid2
                  xs
                  sx={{mb:3}}
               >
                  <Typography fontWeight={400} fontSize={17} fontFamily={'Public Sans'}>{product?.description}</Typography>
               </Grid2>
               <Grid2
                  xs={12}
                  sx={{mb:10}}
               >
                  <Typography fontWeight={200} fontSize={17} fontFamily={'Public Sans'}>Vendido por: {product?.vendor}</Typography>
               </Grid2>
               <Grid2
                  xs={12}
                  sx={{
                     display: 'flex',
                     height: 60,
                     width:'100%'
                  }}
               >
                  <Button 
                     variant='contained'
                     sx={{  
                        bgcolor: '#000',
                        width: '350px',
                        fontWeight: 800,
                        '&:hover':{
                           bgcolor: '#fff',
                           color: '#000'
                        }
                     }}
                  >
                     Adicionar ao carrinho  - {product?.price}
                  </Button>
               </Grid2>
            </Grid2>
         </Grid2>
      </>
   );
};

export default ProductDetailsPage;