import React, { useContext, useEffect, useState } from 'react';
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { AuthContext } from '../../../contexts/Auth/AuthContext';
import { Typography } from '@mui/material';
import CheckoutAddressCard from './checkout-address-card';
import { IAddress } from '../../../utils/interfaces/IAddress';

const CheckoutCustomerAddresses: React.FC = () => {
    
    const [customerDeliveryAddresses, setCustomerDeliveryAddresses] = useState<IAddress[]>([]);
    
    const userContext = useContext(AuthContext);

    const loadDeliveryCustomerAddresses = async () => {
        const deliveryAddresses = userContext.user?.addresses?.filter((address) => 
            address.addressCategories.includes('Entrega')
        );
        setCustomerDeliveryAddresses(deliveryAddresses || []);
    };

    useEffect(() => {
        loadDeliveryCustomerAddresses();
    }, []);

    return (
        <Grid2
            container
            xs={12}
            spacing={2}
            sx={{ p: 5 }}
        >
            <Grid2 xs={12}>
                <h2>Endereços</h2>
            </Grid2>
            <Grid2 container sx={{display:'flex'}} xs={12}>
                {customerDeliveryAddresses?.length === 0 ?
                    <Grid2 xs>
                        <Typography variant='body1'>
                            Nenhum endereço de entrega cadastrado
                        </Typography>
                    </Grid2>
                    :
                    customerDeliveryAddresses?.map((address, index) => (
                        <CheckoutAddressCard
                            index={index}
                            address={address}
                        />
                    ))
                }   
            </Grid2>
        </Grid2>
    );
}

export default CheckoutCustomerAddresses;