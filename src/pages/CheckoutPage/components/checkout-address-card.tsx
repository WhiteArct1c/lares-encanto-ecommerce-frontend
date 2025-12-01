import { Card, CardContent, IconButton, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import { OrderContext } from "../../../contexts/OrderContext/OrderContext.tsx";
import { useContext } from "react";
import { IAddress } from "../../../utils/interfaces/IAddress";
import { Close } from "@mui/icons-material";

interface CheckoutCustomerAddressesProps {
   index: number;
   address: IAddress;
}

const CheckoutAddressCard: React.FC<CheckoutCustomerAddressesProps> = ({ address }) => {

   const orderContext = useContext(OrderContext);

   const handleAddressSelection = (address: IAddress) => {
      // Marca explicitamente que este endereço veio da agenda do cliente
      orderContext?.setOrderShippingAddress({
         ...address,
         // @ts-ignore campo auxiliar apenas para frontend
         fromAddressBook: true,
         // não deve tentar salvar novamente um endereço que já pertence ao cliente
         saveToAddressBook: false,
      });
      orderContext?.setSelectedShippingAddressId(address.id);
   }

   const isSelected = orderContext?.shippingAddress?.id === address.id;

   const handleClearSelection = (event: React.MouseEvent) => {
      event.stopPropagation();
      orderContext?.setOrderShippingAddress(undefined);
      orderContext?.setSelectedShippingAddressId(undefined);
   };

   return (
      <Grid2 xs={4}>
         <Card
            sx={{
               cursor: 'pointer',
               position: 'relative',
               border: isSelected ? '2px solid #000' : '1px solid #ddd',
               '&:hover': {
                  boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)'
               }
            }}
            onClick={() => handleAddressSelection(address)}
         >
            {isSelected && (
               <IconButton
                  size="small"
                  onClick={handleClearSelection}
                  sx={{
                     position: 'absolute',
                     top: 4,
                     right: 4,
                     bgcolor: 'rgba(255,255,255,0.9)',
                     '&:hover': { bgcolor: 'rgba(255,255,255,1)' }
                  }}
               >
                  <Close fontSize="small" />
               </IconButton>
            )}
            <CardContent>
               <Typography fontFamily={'Public Sans'} fontWeight={700} variant='h6'>
                  {address.title}
               </Typography>
               <Typography fontFamily={'Public Sans'}>
                  {address.addressType}&nbsp;{address.streetName}
               </Typography>
               <Typography fontFamily={'Public Sans'}>
                  {address.addressNumber}
               </Typography>
               <Typography fontFamily={'Public Sans'}>
                  {address.neighborhoods}
               </Typography>
               <Typography fontFamily={'Public Sans'}>
                  {address.city} - {address.state}
               </Typography>
               <Typography fontFamily={'Public Sans'}>
                  {address.cep}
               </Typography>
            </CardContent>
         </Card>
      </Grid2>
   );
};

export default CheckoutAddressCard;