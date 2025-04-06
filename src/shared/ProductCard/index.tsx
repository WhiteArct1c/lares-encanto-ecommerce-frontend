import { Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import './styles.css';
import {ProductResponse} from "../../utils/types/response/Product/ProductResponse.ts";
import {ProductService} from "../../services/ProductService.ts";

interface ProductCardProps {
   product: ProductResponse
}

const ProductCard: React.FC<ProductCardProps> = (props: ProductCardProps) => {

   const {
      id,
      name,
      salePrice,
      image
   } = props.product;

   const productService = new ProductService();

   return (
      <>
         <Link data-cy={`product-card-${id}`} to={`/products/${id}`}>
            <Card  sx={{ maxWidth: 345 }}>
               <CardActionArea>
                  <CardMedia
                     component="img"
                     height="300px"
                     image={image}
                     sx={{
                        objectFit: 'contain',
                        padding: '10px'
                     }}
                  />
                  <CardContent>
                     <Typography gutterBottom variant="h5" component="div">
                        {name}
                     </Typography>
                     <Typography variant="body1">
                        {productService.formatProductPrice(salePrice)}
                     </Typography>
                  </CardContent>
               </CardActionArea>
            </Card>
         </Link>
      </>
   );
};

export default ProductCard;