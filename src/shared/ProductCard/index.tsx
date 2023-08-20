import { Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import './styles.css';

interface ProductCardProps {
   id: string,
   name: string,
   price: string,
   photoUrl: string
}

const ProductCard: React.FC<ProductCardProps> = ({id, name, price, photoUrl}: ProductCardProps) => {
   return (
      <>
         <Link to={`/products/${id}`}>
            <Card sx={{ maxWidth: 345 }}>
               <CardActionArea>
                  <CardMedia
                     component="img"
                     height="300px"
                     image={photoUrl}
                  />
                  <CardContent>
                     <Typography gutterBottom variant="h5" component="div">
                        {name}
                     </Typography>
                     <Typography variant="body1">
                        R$ {price}
                     </Typography>
                  </CardContent>
               </CardActionArea>
            </Card>
         </Link>
      </>
   );
};

export default ProductCard;