import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import React, { useContext, useEffect, useState } from 'react';
import { IShippingTypes } from '../../utils/interfaces/IShippingTypes';
import { Box, CircularProgress, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material';
import { OrderContext } from '../../contexts/OrderContext/OrderContext.tsx';
import { useApi } from '../../hooks/useApi';

interface ShippingOptionsComponentProps {
   
}

const ShippingOptionsComponent: React.FC<ShippingOptionsComponentProps> = () => {

   const [shippingTypes, setShippingTypes]= useState<IShippingTypes[]>([]);
   const [loading, setLoading] = useState(true);
   const api = useApi();

   const order = useContext(OrderContext);

   useEffect(()=>{

      async function loadShippingTypes(){
         const data = await api.getShippingTypes();

         setShippingTypes(data);
         setLoading(false);
      }

      loadShippingTypes();
   },[])

   const handleShipment = (shipment: IShippingTypes) => {
      order!.setOrderShippingType(shipment);
      order!.setOrderShippingPrice(parseFloat(shipment.price));
   }

   return (
      <Box
         sx={{mb:5, mt:5, width:'100%', display:'flex', flexDirection:'column', justifyContent:'center'}}
      >
         <RadioGroup
            data-cy='shipping-options'
            sx={{display:'flex', width:'100%'}}
            defaultValue={order?.shippingType?.name || ''}
         >
            {
               loading 
               ? 
                  <Grid2 container xs={12} sx={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                     <CircularProgress/>
                  </Grid2>
               :
                  shippingTypes.map((shipment, index) => 
                     <Box key={index} sx={{display:'flex', mt:5, border:'1px solid black', borderRadius:1, p:1, width:450}}>
                        <Grid2 xs={12}>
                           <FormControlLabel
                              value={shipment.name}
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
                              {shipment?.delivery_time}
                           </Typography>
                           <Typography fontFamily={'Public Sans'} fontSize={'1rem'} fontWeight={600} textAlign={'end'}>
                              R$ {shipment?.price}
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