import { Checkbox, FormControlLabel, FormGroup, FormHelperText, MenuItem, TextField } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import React, { FocusEvent, useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { countries, tiposDeResidencia } from '../../utils/addressTypes';
import { extractAddressType, extractLogradouroWithoutType, formatCEP } from '../../services/address/AddressService';
import axios from 'axios';
import { IAddressViaCEP } from '../../utils/interfaces/IAddressViaCEP';
import { toast } from 'react-toastify';
import { IAddress } from '../../utils/interfaces/IAddress';
import { OrderContext } from '../../contexts/OrderContext';

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

   const cepField = register('cep', {required: true, maxLength: 8, minLength: 8});

   useEffect(() => {
      return () => {
         handleSetOrderShipmentAddress()
      }
   // eslint-disable-next-line react-hooks/exhaustive-deps
   },[])
   
   const handleFillAddress = async (event: FocusEvent<HTMLInputElement>) => {
      if(event.target.value !== ''){
         const formattedCEP = formatCEP(event.target.value);
         await axios({
            method:"get",
            url:`${import.meta.env.VITE_API_VIA_CEP}${formattedCEP}/json/`
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
         .catch(e =>{ 
            toast.error('CEP inválido ou inexistente!');
            console.log(e);
         });
      }
   }

   const handleSetOrderShipmentAddress = () => {
      const address: IAddress = {
         addressTitle: getValues().addressTitle as string | undefined || '',
         postalcode: getValues().cep as string | undefined || '',
         addressType: getValues().addressType as string | undefined || '',
         addressNumber:getValues().addressNumber as string | undefined || '',
         city: getValues().city as string | undefined || '',
         country: getValues().country as string | undefined || '',
         state: getValues().state as string | undefined || '',
         neighborhoods: getValues().neighborhoods as string | undefined || '',
         street: getValues().address as string | undefined || '',
         residenceType: getValues().residenceType as string | undefined || ''
      }
      order?.setOrderShipmentAddress(address);
   }

   return (
      <Grid2
         container
         xs={12}
         spacing={2}
         sx={{p:5}}
      >
         <Grid2 xs={12}>
            <TextField
               fullWidth
               variant='outlined'
               label='Titulo do endereço'
               placeholder="Casa principal, Loja A, etc..."
               required
               {...register("addressTitle", {required: true})}
               error={errors?.addressTitle?.type === 'required' ? true : false}
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
               fullWidth
               label='CEP'
               required
               {...cepField}
               error={
                  errors?.cep?.type === 'required' 
                  || errors?.cep?.type === 'maxLength' 
                  || errors?.cep?.type === 'minLength' 
                  ? true : false
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
               fullWidth
               select
               label='Tipo de Residência'
               defaultValue={"Casa"}
               required
               {...register("residenceType", {required: true})}
            >
               {tiposDeResidencia.map((tipo, index) => (
                  <MenuItem key={index} value={tipo}>{tipo}</MenuItem>
               ))}
            </TextField>
            {errors?.residenceType?.type === 'required' && <FormHelperText>O tipo de residência é obrigatório</FormHelperText>}
         </Grid2>
         <Grid2 xs={3}>
            <TextField
               fullWidth
               label='Tipo logradouro'
               required
               InputLabelProps={{
                  shrink: true,
               }}
               {...register("addressType", {required: true})}
               error={errors?.addressType?.type === 'required' ? true : false}
               helperText={errors?.addressTyp?.type === 'required' ? "O tipo de endereço é obrigatório" : ""}
            />
         </Grid2>
         <Grid2 xs={12}>
            <TextField
               fullWidth
               variant='outlined'
               label='Logradouro'
               required
               InputLabelProps={{
                  shrink: true,
               }}
               {...register("address", {required: true})}
               error={errors?.address?.type === 'required' ? true : false}
               helperText={errors?.address?.type === 'required' ? "O Logradouro é obrigatório" : ""}
            />
         </Grid2>
         <Grid2 xs={2}
         >
            <TextField
               fullWidth
               variant='outlined'
               label='Número'
               required
               {...register('addressNumber', {required: true})}
               error={errors?.addressNumber?.type === 'required' ? true : false}
               helperText={errors?.addressNumber?.type === 'required' ? "O Número residencial é obrigatório" : ""}
            />
         </Grid2>
         <Grid2 xs={3}>
            <TextField
               fullWidth
               variant='outlined'
               label='Bairro'
               required
               InputLabelProps={{
                  shrink: true,
               }}
               {...register("neighborhoods", {required: true})}
               error={errors?.neighborhoods?.type === 'required' ? true : false}
               helperText={errors?.neighborhoods?.type === 'required' ? "O Bairro é obrigatório" : ""}
            />
         </Grid2>
         <Grid2 xs={3}>
            <TextField
               fullWidth
               variant='outlined'
               label='Cidade'
               required
               InputLabelProps={{
                  shrink: true,
               }}
               {...register("city", {required: true})}
               error={errors?.city?.type === 'required' ? true : false}
               helperText={errors?.city?.type === 'required' ? "A Cidade é obrigatória" : ""}
            />
         </Grid2>
         <Grid2 xs={2}>
            <TextField
               fullWidth
               variant='outlined'
               label='Estado'
               required
               InputLabelProps={{
                  shrink: true,
               }}
               {...register("state", {required: true})}
               error={errors?.state?.type === 'required' ? true : false}
               helperText={errors?.state?.type === 'required' ? "O Estado é obrigatório" : ""}
            />
         </Grid2>
         <Grid2 
            xs={2}
         >
            <TextField
               fullWidth
               select
               variant='outlined'
               label='País'
               required
               defaultValue={"Brasil"}
               {...register('country', {required: true})}
               InputLabelProps={{
                  shrink: true,
               }}
               error={errors?.country?.type === 'required' ? true : false}
               helperText={errors?.country?.type === 'required' ? "O País é obrigatório" : ""}
            >
               {countries.map((country, index) => (
                  <MenuItem key={index} value={country} onBlur={handleSetOrderShipmentAddress}>{country}</MenuItem>
               ))}
            </TextField>
         </Grid2>
         <Grid2 xs={12}>
            <FormGroup>
               <FormControlLabel control={<Checkbox />} label="Salvar informações de entrega" />
            </FormGroup>
         </Grid2>
      </Grid2>
   );
};

export default AddressFormComponent;