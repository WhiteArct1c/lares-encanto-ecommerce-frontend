import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import React, { useContext, useEffect, useState, useRef, useMemo } from 'react';
import { ShippingOption } from '../../utils/types/response/Shipping/ShippingOption';
import { Box, CircularProgress, FormControlLabel, Radio, RadioGroup, Typography, Alert } from '@mui/material';
import { OrderContext } from '../../contexts/OrderContext/OrderContext.tsx';
import { useApi } from '../../hooks/useApi';
import { ShippingCalculationRequest } from '../../utils/types/request/Shipping/ShippingCalculationRequest';

interface ShippingOptionsComponentProps {
   
}

const ShippingOptionsComponent: React.FC<ShippingOptionsComponentProps> = () => {

   const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const api = useApi();
   const order = useContext(OrderContext);
   const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
   const lastCalculationRef = useRef<string>('');
   const isCalculatingRef = useRef(false);

   // Criar chave única de produtos para usar como dependência
   const productsKey = useMemo(() => {
      if (!order?.products || order.products.length === 0) {
         return '';
      }
      return order.products.map(p => `${p.product.id}-${p.quantity}`).join(',');
   }, [order?.products]);

   // Criar chave única de endereço para usar como dependência
   const addressKey = useMemo(() => {
      if (!order?.shippingAddress) {
         return '';
      }
      return order.shippingAddress.id || `${order.shippingAddress.cep}-${order.shippingAddress.city}`;
   }, [order?.shippingAddress]);

   // Efeito para calcular frete quando endereço ou produtos mudarem (com debounce)
   useEffect(() => {
      // Verificar se há endereço e produtos
      if (!order?.shippingAddress) {
         setShippingOptions([]);
         setError(null);
         return;
      }

      if (!order?.products || order.products.length === 0) {
         setShippingOptions([]);
         setError(null);
         return;
      }

      // Criar chave única para esta combinação de endereço e produtos
      const calculationKey = `${addressKey}-${productsKey}`;

      // Se já calculamos para esta combinação, não recalcular
      if (lastCalculationRef.current === calculationKey) {
         return;
      }

      // Limpar timer anterior
      if (debounceTimerRef.current) {
         clearTimeout(debounceTimerRef.current);
      }

      // Aguardar 500ms antes de calcular (debounce)
      debounceTimerRef.current = setTimeout(async () => {
         // Se já está calculando, cancelar
         if (isCalculatingRef.current) {
            return;
         }

         isCalculatingRef.current = true;
         setLoading(true);
         setError(null);

         try {
            const request: ShippingCalculationRequest = {
               address: order.shippingAddress!,
               products: order.products
            };

            const response = await api.calculateShipping(request);
            
            if (response.data && Array.isArray(response.data) && response.data.length > 0) {
               setShippingOptions(response.data);
               lastCalculationRef.current = calculationKey;
               
               // Selecionar automaticamente a primeira opção se nenhuma estiver selecionada
               if (!order?.shippingType) {
                  const firstOption = response.data[0];
                  order?.setOrderShippingType({
                     id: firstOption.id,
                     name: firstOption.name,
                     deliveryTime: firstOption.deliveryTime,
                     price: firstOption.price
                  });
                  order?.setOrderShippingPrice(firstOption.price);
               }
            } else {
               setShippingOptions([]);
               setError('Nenhuma opção de frete disponível para este endereço e produtos.');
            }
         } catch (err: unknown) {
            console.error('Erro ao calcular frete:', err);
            setShippingOptions([]);
            setError('Erro ao calcular frete. Por favor, tente novamente ou verifique se o endereço está correto.');
         } finally {
            setLoading(false);
            isCalculatingRef.current = false;
         }
      }, 500);

      // Cleanup
      return () => {
         if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
         }
      };
   }, [addressKey, productsKey, order, api]);

   const handleShipment = (shipment: ShippingOption) => {
      order?.setOrderShippingType({
         id: shipment.id,
         name: shipment.name,
         deliveryTime: shipment.deliveryTime,
         price: shipment.price
      });
      order?.setOrderShippingPrice(shipment.price);
   };

   // Se não há endereço selecionado, mostrar mensagem
   if (!order?.shippingAddress) {
      return (
         <Box
            sx={{mb:5, mt:5, width:'100%', display:'flex', flexDirection:'column', justifyContent:'center'}}
         >
            <Alert severity="info">
               Selecione um endereço de entrega para calcular as opções de frete.
            </Alert>
         </Box>
      );
   }

   // Se não há produtos, mostrar mensagem
   if (!order?.products || order.products.length === 0) {
      return (
         <Box
            sx={{mb:5, mt:5, width:'100%', display:'flex', flexDirection:'column', justifyContent:'center'}}
         >
            <Alert severity="info">
               Adicione produtos ao carrinho para calcular as opções de frete.
            </Alert>
         </Box>
      );
   }

   return (
      <Box
         sx={{mb:5, mt:5, width:'100%', display:'flex', flexDirection:'column', justifyContent:'center'}}
      >
         {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
               {error}
            </Alert>
         )}
         <RadioGroup
            data-cy='shipping-options'
            sx={{display:'flex', width:'100%'}}
            value={order?.shippingType?.id?.toString() || ''}
         >
            {
               loading 
               ? 
                  <Grid2 container xs={12} sx={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                     <CircularProgress/>
                     <Typography sx={{ ml: 2 }}>Calculando opções de frete...</Typography>
                  </Grid2>
               :
                  shippingOptions.length === 0 && !error
                  ?
                     <Alert severity="warning">
                        Nenhuma opção de frete disponível. Verifique o endereço e produtos selecionados.
                     </Alert>
                  :
                     shippingOptions.map((shipment) => 
                        <Box key={shipment.id} sx={{display:'flex', mt:5, border:'1px solid black', borderRadius:1, p:1, width:450}}>
                           <Grid2 xs={12}>
                              <FormControlLabel
                                 value={shipment.id.toString()}
                                 control={
                                    <Radio 
                                       data-cy={`shipping-card-${shipment.id}`}
                                       onClick={() => handleShipment(shipment)}
                                    />
                                 }
                                 label={shipment.name}
                                 sx={{
                                    display:'flex',
                                 }}
                              />
                           </Grid2>
                           <Grid2 xs={12}>
                              <Typography fontFamily={'Public Sans'} fontSize={'1rem'} fontWeight={600} textAlign={'end'}>
                                 {shipment.deliveryTime}
                              </Typography>
                              <Typography fontFamily={'Public Sans'} fontSize={'1rem'} fontWeight={600} textAlign={'end'}>
                                 R$ {shipment.price.toFixed(2)}
                              </Typography>
                           </Grid2>
                        </Box>
                     )
            }
         </RadioGroup>
      </Box>
   );
};

export default ShippingOptionsComponent;
