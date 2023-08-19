import { Box, Checkbox, FormControlLabel, FormGroup, MenuItem, TextField, Typography } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import ProductCard from '../../shared/ProductCard';
import { useEffect, useState } from 'react';
import { Product } from '../../utils/interfaces/Product';

interface ProductsPageProps {
  
}

const ProductsPage: React.FC<ProductsPageProps> = () => {
   const [products, setProducts] = useState<Product[]>([]);

   const ordenation = [
      "Mais relevantes",
      "Maior valor",
      "Menor valor"
   ]

   useEffect(() =>{
      fetch('http://localhost:3000/products')
      .then(res => res.json())
      .then((data) => setProducts([...data]))
   },[])

   return (
      <>
         <Box sx={{flexGrow: 1, width:'100%', mt:8}}>
            <Grid2 
               container 
               spacing={2} 
               sx={{
                  width:'100%', 
                  pl:{
                     xs:"5%", 
                     md:"7%"
                  }, 
                  pr:{xs:"-4px"}
               }}
               >
               <Grid2 
                  xs={12}
               >
                  <Typography
                     fontFamily={'Public Sans'}
                     fontSize={'3rem'}
                     fontWeight={600}
                     color={'#000'}
                  >
                     Produtos
                  </Typography>
               </Grid2>
               <Grid2
                  container
                  xs={12}
                  sx={{
                     gap:'20px'
                  }}
               >
                  <Grid2 xs={2} sx={{display: 'flex', gap:'20px', alignItems:'center'}}>
                     <Typography
                        fontFamily={'Public Sans'}
                        fontSize={'1.5rem'}
                        fontWeight={600}
                        color={'#000'}
                     >
                        Filtros
                     </Typography>
                     {/* TODO: ARRUMAR PARA LIMPRAR OS FILTROS */}
                     <Typography
                        fontFamily={'Public Sans'}
                        fontSize={'1rem'}
                        fontWeight={100}
                        color={'#000'}
                        sx={{
                           borderBottom:'1px solid #999'
                        }}
                     >
                        Limpar filtros
                     </Typography>
                  </Grid2>
                  <Grid2 xs={9} sx={{display:'flex', alignItems:'end', justifyContent:'end'}}>
                     <TextField
                        select
                        defaultValue={"Mais relevantes"}
                        sx={{
                           width:200
                        }}
                     >
                        {ordenation.map((tipo, index) => (
                           <MenuItem key={index} value={tipo}>{tipo}</MenuItem>
                        ))}
                     </TextField>
                  </Grid2>
                  <Grid2 xs={2}>
                     <Typography
                        fontFamily={'Public Sans'}
                        fontSize={'0.875rem'}
                        fontWeight={700}
                        color={'#000'}
                     >
                        Marcas
                     </Typography>
                     <FormGroup>
                        <FormControlLabel control={<Checkbox />} label="Itar" />
                        <FormControlLabel control={<Checkbox />} label="Kafan" />
                        <FormControlLabel control={<Checkbox />} label="Caps" />
                        <FormControlLabel control={<Checkbox />} label="Foods" />
                     </FormGroup>
                     <Typography
                        fontFamily={'Public Sans'}
                        fontSize={'0.875rem'}
                        fontWeight={700}
                        color={'#000'}
                        sx={{
                           mt:'2rem'
                        }}
                     >
                        Categorias
                     </Typography>
                     <FormGroup>
                        <FormControlLabel control={<Checkbox />} label="Sala de estar" />
                        <FormControlLabel control={<Checkbox />} label="Cozinha" />
                        <FormControlLabel control={<Checkbox />} label="Quarto" />
                        <FormControlLabel control={<Checkbox />} label="Escritório" />
                     </FormGroup>
                  </Grid2>
                  <Grid2 
                     container
                     xs={9}
                     rowSpacing={10}
                  >
                     {products.map((product, index) => {
                        return(
                           <Grid2 
                              xs={4}
                              key={index}
                           >
                              <ProductCard
                                 id={product.id.toString()}
                                 name={product.name}
                                 price={product.price}
                                 photoUrl={product.photoUrl}
                              />
                           </Grid2>
                        );
                     })}
                  </Grid2>
               </Grid2>
            </Grid2>
         </Box>
      </>
   );
};

export default ProductsPage;