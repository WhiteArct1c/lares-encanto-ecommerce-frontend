import React from 'react';
import { Link } from 'react-router-dom';
import {
   Card,
   CardActionArea,
   CardContent,
   CardMedia,
   Typography,
   Box,
   useTheme,
   useMediaQuery,
   Chip
} from '@mui/material';
import { ProductResponse } from "../../utils/types/response/Product/ProductResponse.ts";
import { ProductService } from "../../services/ProductService.ts";

interface ProductCardProps {
   product: ProductResponse;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
   const theme = useTheme();
   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
   const productService = new ProductService();

   const {
      id,
      name,
      salePrice,
      image,
      category,
      pricingGroup,
      tags
   } = product;

   return (
       <Box
           sx={{
              width: '100%',
              maxWidth: '100%',
              boxSizing: 'border-box',
              '&:hover': {
                 transform: 'translateY(-4px)',
                 transition: 'transform 0.3s ease-in-out',
              }
           }}
       >
          <Link
              to={`/products/${id}`}
              style={{ textDecoration: 'none' }}
              data-cy={`product-card-${id}`}
          >
             <Card
                 sx={{
                    width: '100%',
                    maxWidth: '100%',
                    height: '400px',
                    borderRadius: '12px',
                    boxShadow: theme.shadows[2],
                    boxSizing: 'border-box',
                    '&:hover': {
                       boxShadow: theme.shadows[6],
                    }
                 }}
             >
                <CardActionArea sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                   <CardMedia
                       component="img"
                       sx={{
                          height: '250px',
                          objectFit: 'contain',
                          p: 2,
                          backgroundColor: '#f9f9f9'
                       }}
                       image={image}
                       alt={name}
                       loading="lazy"
                   />
                   <CardContent sx={{ width: '100%', mt: 'auto' }}>
                      <Typography
                          gutterBottom
                          variant="h6"
                          component="div"
                          sx={{
                             fontWeight: 600,
                             whiteSpace: 'nowrap',
                             overflow: 'hidden',
                             textOverflow: 'ellipsis'
                          }}
                      >
                         {name}
                      </Typography>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                         <Typography variant="h6" color="primary" fontWeight="bold">
                            {productService.formatProductPrice(salePrice)}
                         </Typography>

                         {pricingGroup && (
                             <Box
                                 sx={{
                                    bgcolor: theme.palette.secondary.light,
                                    color: theme.palette.secondary.contrastText,
                                    px: 1,
                                    borderRadius: '4px',
                                    fontSize: '0.75rem'
                                 }}
                             >
                                {pricingGroup.name}
                             </Box>
                         )}
                      </Box>

                      {category && (
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                             {category.name}
                          </Typography>
                      )}
                      
                      {/* Tags */}
                      {tags && tags.length > 0 && (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                              {tags.slice(0, 2).map((tag) => (
                                  <Chip
                                      key={tag.id}
                                      label={tag.name}
                                      size="small"
                                      sx={{ height: 20, fontSize: '0.65rem' }}
                                  />
                              ))}
                              {tags.length > 2 && (
                                  <Typography variant="caption" color="text.secondary">
                                     +{tags.length - 2}
                                  </Typography>
                              )}
                          </Box>
                      )}
                   </CardContent>
                </CardActionArea>
             </Card>
          </Link>
       </Box>
   );
};

export default React.memo(ProductCard);