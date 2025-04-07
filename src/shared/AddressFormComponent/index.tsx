import { Checkbox, FormControlLabel, FormGroup, FormHelperText, MenuItem,TextField } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import React, { FocusEvent, useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { countries, tiposDeResidencia } from '../../utils/addressTypes';
import { extractAddressType, extractLogradouroWithoutType, formatCEP } from '../../services/AddressService.ts';
import axios from 'axios';
import { IAddressViaCEP } from '../../utils/interfaces/IAddressViaCEP';
import { toast } from 'react-toastify';
import { IAddress } from '../../utils/interfaces/IAddress';
import { OrderContext } from '../../contexts/OrderContext/OrderContext.tsx';

interface AddressFormComponentProps {

}

const AddressFormComponent: React.FC<AddressFormComponentProps> = () => {

   const order = useContext(OrderContext);

   const {
      register,
      formState: { errors },
      setValue,
      setFocus,
      getValues
   } = useForm();

   const cepField = register('cep', { required: true, maxLength: 8, minLength: 8 });

   const handleSaveShipmentAddress = (event:  React.ChangeEvent<HTMLInputElement>) => {
      order.saveShippingAddress(event.target.checked);
   }

   const handleFillAddress = async (event: FocusEvent<HTMLInputElement>) => {
      if (event.target.value !== '') {
         const formattedCEP = formatCEP(event.target.value);
         await axios({
            method: "get",
            url: `${import.meta.env.VITE_API_VIA_CEP}${formattedCEP}/json/`
         })
            .then((res: IAddressViaCEP) => {
               setValue('addressType', extractAddressType(res.data.logradouro));
               setValue('address', extractLogradouroWithoutType(res.data.logradouro));
               setValue('city', res.data.localidade);
               setValue('state', res.data.uf);
               setValue('neighborhoods', res.data.bairro);
               setFocus('addressNumber');
               handleSetOrderShipmentAddress
            })
            .catch(e => {
               toast.error('CEP inválido ou inexistente!');
               console.error(e);
            });
      }
   }

   const handleSetOrderShipmentAddress = () => {
      const address: IAddress = {
         title: getValues().addressTitle as string | undefined || '',
         cep: getValues().cep as string | undefined || '',
         addressType: getValues().addressType as string | undefined || '',
         addressNumber: getValues().addressNumber as string | undefined || '',
         city: getValues().city as string | undefined || '',
         country: getValues().country as string | undefined || '',
         state: getValues().state as string | undefined || '',
         neighborhoods: getValues().neighborhoods as string | undefined || '',
         streetName: getValues().address as string | undefined || '',
         residenceType: getValues().residenceType as string | undefined || '',
         id: '',
         addressCategories: [],
         observations: ''
      }
      order?.setOrderShippingAddress(address);
   }

   useEffect(() => {
      if (order?.shippingAddress) {
         setValue('addressTitle', order.shippingAddress.title);
         setValue('cep', order.shippingAddress.cep);
         setValue('addressType', order.shippingAddress.addressType);
         setValue('addressNumber', order.shippingAddress.addressNumber);
         setValue('city', order.shippingAddress.city);
         setValue('country', order.shippingAddress.country);
         setValue('state', order.shippingAddress.state);
         setValue('neighborhoods', order.shippingAddress.neighborhoods);
         setValue('address', order.shippingAddress.streetName);
         setValue('residenceType', order.shippingAddress.residenceType);
      }
   }, [order?.shippingAddress, setValue]);

   // useEffect(() => {
   //    return () => {
   //       handleSetOrderShipmentAddress()
   //    }
   // }, [])

   return (
      <Grid2
         container
         xs={12}
         spacing={2}
         sx={{ pl: 5 }}
      >
         <Grid2 xs={12}>
            <TextField
               data-cy='input-address-title'
               fullWidth
               defaultValue={order?.shippingAddress?.title}
               variant='outlined'
               label='Titulo do endereço'
               placeholder="Casa principal, Loja A, etc..."
               required
               InputLabelProps={{
                  shrink: true,
               }}
               {...register("addressTitle", { required: true })}
               error={errors?.addressTitle?.type === 'required'}
               helperText={errors?.addressTitle?.type === 'required' ? "O título do endereço é obrigatório" : ""}
            />
         </Grid2>
         <Grid2
            xs={6}
            onBlur={(e) => {
               cepField.onBlur(e);
               if (e.target instanceof HTMLInputElement) {
                  handleFillAddress(e as FocusEvent<HTMLInputElement>);
               }
            }}
         >
            <TextField
               data-cy='input-address-cep'
               fullWidth
               label='CEP'
               required
               {...cepField}
               InputLabelProps={{
                  shrink: true,
               }}
               error={
                  errors?.cep?.type === 'required'
                   || errors?.cep?.type === 'maxLength'
                   || errors?.cep?.type === 'minLength'
               }
               helperText={
                  errors?.cep?.type === 'required' ? "O CEP é obrigatório" :
                     errors?.cep?.type === 'maxLength' ? "O CEP deve conter 8 dígitos" :
                        errors?.cep?.type === 'minLength' ? "O CEP deve conter 8 dígitos" : ""
               }
            />
         </Grid2>
         <Grid2 xs={3}>
            <TextField
               data-cy='input-residence-type'
               fullWidth
               select
               label='Tipo de Residência'
               defaultValue={"Casa"}
               required
               InputLabelProps={{
                  shrink: true,
               }}
               {...register("residenceType", { required: true })}
            >
               {tiposDeResidencia.map((tipo, index) => (
                  <MenuItem key={index} value={tipo}>{tipo}</MenuItem>
               ))}
            </TextField>
            {errors?.residenceType?.type === 'required' && <FormHelperText>O tipo de residência é obrigatório</FormHelperText>}
         </Grid2>
         <Grid2 xs={3}>
            <TextField
               data-cy='input-address-type'
               fullWidth
               label='Tipo logradouro'
               required
               InputLabelProps={{
                  shrink: true,
               }}
               {...register("addressType", { required: true })}
               error={errors?.addressType?.type === 'required'}
               helperText={errors?.addressTyp?.type === 'required' ? "O tipo de endereço é obrigatório" : ""}
            />
         </Grid2>
         <Grid2 xs={12}>
            <TextField
               data-cy='input-street-name'
               fullWidth
               variant='outlined'
               label='Logradouro'
               required
               InputLabelProps={{
                  shrink: true,
               }}
               {...register("address", { required: true })}
               error={errors?.address?.type === 'required'}
               helperText={errors?.address?.type === 'required' ? "O Logradouro é obrigatório" : ""}
            />
         </Grid2>
         <Grid2 xs={2}
         >
            <TextField
               data-cy='input-address-number'
               fullWidth
               variant='outlined'
               label='Número'
               required
               InputLabelProps={{
                  shrink: true,
               }}
               {...register('addressNumber', { required: true })}
               error={errors?.addressNumber?.type === 'required'}
               helperText={errors?.addressNumber?.type === 'required' ? "O Número residencial é obrigatório" : ""}
            />
         </Grid2>
         <Grid2 xs={3}>
            <TextField
               data-cy='input-neighborhoods'
               fullWidth
               variant='outlined'
               label='Bairro'
               required
               InputLabelProps={{
                  shrink: true,
               }}
               {...register("neighborhoods", { required: true })}
               error={errors?.neighborhoods?.type === 'required'}
               helperText={errors?.neighborhoods?.type === 'required' ? "O Bairro é obrigatório" : ""}
            />
         </Grid2>
         <Grid2 xs={3}>
            <TextField
               data-cy='input-city'
               fullWidth
               variant='outlined'
               label='Cidade'
               required
               InputLabelProps={{
                  shrink: true,
               }}
               {...register("city", { required: true })}
               error={errors?.city?.type === 'required'}
               helperText={errors?.city?.type === 'required' ? "A Cidade é obrigatória" : ""}
            />
         </Grid2>
         <Grid2 xs={2}>
            <TextField
               data-cy='input-state'
               fullWidth
               variant='outlined'
               label='Estado'
               required
               InputLabelProps={{
                  shrink: true,
               }}
               {...register("state", { required: true })}
               error={errors?.state?.type === 'required'}
               helperText={errors?.state?.type === 'required' ? "O Estado é obrigatório" : ""}
            />
         </Grid2>
         <Grid2
            xs={2}
         >
            <TextField
               data-cy='input-country'
               fullWidth
               select
               variant='outlined'
               label='País'
               required
               defaultValue={"Brasil"}
               {...register('country', { required: true })}
               InputLabelProps={{
                  shrink: true,
               }}
               error={errors?.country?.type === 'required'}
               helperText={errors?.country?.type === 'required' ? "O País é obrigatório" : ""}
            >
               {countries.map((country, index) => (
                  <MenuItem key={index} value={country} onBlur={handleSetOrderShipmentAddress}>{country}</MenuItem>
               ))}
            </TextField>
         </Grid2>
         <Grid2 xs={12}>
            <FormGroup>
               <FormControlLabel control={<Checkbox onChange={handleSaveShipmentAddress}/>} label="Salvar como endereço de entrega" />
            </FormGroup>
         </Grid2>
      </Grid2>
   );
};

export default AddressFormComponent;