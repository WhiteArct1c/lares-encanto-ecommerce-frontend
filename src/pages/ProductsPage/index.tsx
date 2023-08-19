import { Box, Button, Checkbox, FormControlLabel, FormGroup, MenuItem, TextField, Typography } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import ProductCard from '../../shared/ProductCard';
import { useEffect, useState } from 'react';
import { Product } from '../../utils/interfaces/Product';

interface ProductsPageProps {

}

const ProductsPage: React.FC<ProductsPageProps> = () => {
   const [products, setProducts] = useState<Product[]>([]);
   const [filters, setFilters] = useState<string[]>([]);

   const apiURL = 'http://localhost:3000/products'

   const ordenation = [
      "Mais relevantes",
      "Maior valor",
      "Menor valor"
   ]

   const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = (event.target as HTMLInputElement).value;

      if (event.target.checked) {
         setFilters((prevFilter) => [...prevFilter, value]); 
      } else {
         setFilters((prevFilter) => prevFilter.filter(item => item !== value)); 
      }
   };

   useEffect(() => {
      fetch(apiURL)
         .then(res => res.json())
         .then((data) => setProducts([...data]))
   }, [filters])

   return (
      <>
         <Box sx={{ flexGrow: 1, width: '100%', mt: 8 }}>
            <Grid2
               container
               spacing={2}
               sx={{
                  width: '100%',
                  pl: {
                     xs: "5%",
                     md: "7%"
                  },
                  pr: { xs: "-4px" }
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
                     gap: '20px'
                  }}
               >
                  <Grid2 xs={2} sx={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                     <Typography
                        fontFamily={'Public Sans'}
                        fontSize={'1.5rem'}
                        fontWeight={600}
                        color={'#000'}
                     >
                        Filtros
                     </Typography>
                     {/* TODO: ARRUMAR PARA LIMPRAR OS FILTROS */}
                     <Button
                        variant='text'
                        sx={{
                           color: '#000',
                           fontWeight: 100,
                           fontFamily: 'Public Sans'
                        }}
                     >
                        Limpar filtros
                     </Button>
                  </Grid2>
                  <Grid2 xs={9} sx={{ display: 'flex', alignItems: 'end', justifyContent: 'end' }}>
                     <TextField
                        select
                        defaultValue={"Mais relevantes"}
                        sx={{
                           width: 200
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
                           mt: '2rem'
                        }}
                     >
                        Categorias
                     </Typography>
                     <FormGroup>
                        <FormControlLabel control={<Checkbox value='Sala de estar' checked={filters.includes("Sala de estar")} onChange={handleFilterChange} />} label="Sala de estar" />
                        <FormControlLabel control={<Checkbox value='Cozinha' checked={filters.includes("Cozinha")} onChange={handleFilterChange} />} label="Cozinha" />
                        <FormControlLabel control={<Checkbox value='Quarto' checked={filters.includes("Quarto")} onChange={handleFilterChange} />} label="Quarto" />
                        <FormControlLabel control={<Checkbox value='Escritório' checked={filters.includes("Escritório")} onChange={handleFilterChange} />} label="Escritório" />
                     </FormGroup>
                  </Grid2>
                  <Grid2
                     container
                     xs={9}
                     rowSpacing={10}
                  >
                     {products.map((product, index) => {
                        return (
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