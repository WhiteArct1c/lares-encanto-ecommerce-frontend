import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { Box, Button, Typography } from '@mui/material';
import { ShoppingCartContext } from '../../contexts/ShoppingCartContext';
import { toast } from 'react-toastify';
import {useApi} from "../../hooks/useApi.ts";
import {ProductResponse} from "../../utils/types/response/Product/ProductResponse.ts";
import {ProductService} from "../../services/ProductService.ts";

interface ProductDetailsPageProps {
}

const ProductDetailsPage: React.FC<ProductDetailsPageProps> = () => {
   const [product, setProduct] = useState<ProductResponse>();
   const { id } = useParams();

   const cart = useContext(ShoppingCartContext);
   const api = useApi();
   const productService = new ProductService();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await api.getAvailableProductById(Number(id));

                if (response.data && Array.isArray(response.data)) {
                    setProduct(response.data?.[0]);
                } else {
                    toast.error("Os dados recebidos estão em um formato inválido");
                    setProduct(undefined);
                }
            } catch (error) {
                toast.error("Ocorreu um erro ao carregar o produto");
            }
        }

        fetchProduct();
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
               mt: 20,
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
                     src={product?.image}
                     sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain'
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
                  <Typography fontWeight={500} fontSize={25} fontFamily={'Public Sans'}>{productService.formatProductPrice(product?.salePrice)}</Typography>
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
                  <Typography fontWeight={200} fontSize={17} fontFamily={'Public Sans'}>Vendido por: Lares Encanto</Typography>
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
                      data-cy="btn-add-to-cart"
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
                     Adicionar ao carrinho  - {productService.formatProductPrice(product?.salePrice)}
                  </Button>
               </Grid2>
            </Grid2>
         </Grid2>
      </>
   );
};

export default ProductDetailsPage;