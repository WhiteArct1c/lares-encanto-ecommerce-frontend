import { Card, CardContent, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import { OrderContext } from "../../../contexts/OrderContext/OrderContext.tsx";
import { useContext } from "react";
import { IAddress } from "../../../utils/interfaces/IAddress";

interface CheckoutCustomerAddressesProps {
   index: number;
   address: IAddress;
}

const CheckoutAddressCard: React.FC<CheckoutCustomerAddressesProps> = ({ index, address }) => {

   const orderContext = useContext(OrderContext);

   const handleAddressSelection = (address: IAddress) => {
      orderContext?.setOrderShippingAddress(address);
   }

   return (
      <Grid2 xs={4} key={index}>
         <Card
            key={index + 1}
            sx={{
               cursor: 'pointer',
               '&:hover': {
                  boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)'
               }
            }}
            onClick={() => handleAddressSelection(address)}
         >
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