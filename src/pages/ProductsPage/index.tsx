import { Box, Button, Checkbox, FormControlLabel, FormGroup, MenuItem, TextField, Typography } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import ProductCard from '../../shared/ProductCard';
import React, { useEffect, useState } from 'react';
import { useApi } from '../../hooks/useApi';
import {ProductResponse} from "../../utils/types/response/Product/ProductResponse.ts";
import {toast} from "react-toastify";
import {OK} from "../../utils/constants/apiCodes.ts";

interface ProductsPageProps {}

const ProductsPage: React.FC<ProductsPageProps> = () => {
   const [products, setProducts] = useState<ProductResponse[]>([]);
   const [filters, setFilters] = useState<string[]>([]);
   const [loading, setLoading] = useState(true); // Adicionando estado de loading

   const api = useApi();

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
         setFilters((prevFilter) => prevFilter.filter((filter) => filter !== value));
      }
   };

   useEffect(() => {
      const fetchProducts = async () => {
         try {
            setLoading(true);
            const response = await api.getAvailableProducts();

            if(response.code === OK){
               if (response.data && Array.isArray(response.data)) {
                  setProducts(response.data);
               } else {
                  toast.error("Os dados recebidos estão em um formato inválido");
                  setProducts([]);
               }
            } else {
               toast.error(response.message || "Erro ao carregar produtos");
               setProducts([]);
            }
         } catch (error) {
            toast.error("Ocorreu um erro ao carregar os produtos");
            setProducts([]);
         } finally {
            setLoading(false);
         }
      };

      fetchProducts();
   }, []);

   // Se estiver carregando, mostra um indicador de loading
   if (loading) {
      return (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
             <Typography variant="h6">Carregando produtos...</Typography>
          </Box>
      );
   }

   return (
       <>
          <Box sx={{ flexGrow: 1, width: '100%', mt: 20 }}>
             <Grid2
                 container
                 spacing={2}
                 sx={{
                    width: '100%',
                    pl: {
                       xs: "5%",
                       md: "7%"
                    },
                    pr: { xs: "-4px" },
                    mb: 10
                 }}
             >
                <Grid2 xs={12}>
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
                      <Button
                          variant='text'
                          sx={{
                             color: '#000',
                             fontWeight: 100,
                             fontFamily: 'Public Sans',
                             fontSize: 12
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
                      {products.length > 0 ? (
                          products.map((product, index) => (
                              <Grid2
                                  xs={4}
                                  key={product.id || index} // Preferir usar product.id se existir
                              >
                                 <ProductCard
                                     product={product}
                                 />
                              </Grid2>
                          ))
                      ) : (
                          <Grid2 xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
                             <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h5" sx={{ mb: 2 }}>
                                   Nenhum produto disponível
                                </Typography>
                                <Typography variant="body1">
                                   Não encontramos produtos cadastrados.
                                </Typography>
                             </Box>
                          </Grid2>
                      )}
                   </Grid2>
                </Grid2>
             </Grid2>
          </Box>
       </>
   );
};

export default ProductsPage;