import { Checkbox, FormControlLabel, FormGroup, FormHelperText, MenuItem, TextField } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import React from 'react';
import { useForm } from 'react-hook-form';
import { tiposDeLogradouro, tiposDeResidencia } from '../../utils/addressTypes';

interface AddressFormComponentProps {
   
}

const AddressFormComponent: React.FC<AddressFormComponentProps> = () => {
   const {
      register,
      formState: { errors }
   } = useForm();

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
         <Grid2 xs={6}>
            <TextField
               fullWidth
               variant='outlined'
               label='CEP'
               required
               {...register("cep", {required: true, maxLength: 8})}
               error={
                  errors?.cep?.type === 'required' 
                  || errors?.cep?.type === 'maxLength' 
                  ? true : false
               }
               helperText={
                  errors?.cep?.type === 'required' ? "O CEP é obrigatório" : 
                  errors?.cep?.type === 'maxLength' ? "O CEP deve conter 8 dígitos" : ""
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
               select
               label='Tipo logradouro'
               defaultValue={"Rua"}
               required
               {...register("addressType", {required: true})}
            >
               {tiposDeLogradouro.map((tipo, index) => (
                  <MenuItem key={index} value={tipo}>{tipo}</MenuItem>
               ))}
            </TextField>
         </Grid2>
         <Grid2 xs={12}>
            <TextField
               fullWidth
               variant='outlined'
               label='Logradouro'
               required
               {...register("address", {required: true})}
               error={errors?.address?.type === 'required' ? true : false}
               helperText={errors?.address?.type === 'required' ? "O Logradouro é obrigatório" : ""}
            />
         </Grid2>
         <Grid2 xs={2}>
            <TextField
               fullWidth
               variant='outlined'
               label='Número'
               required
               {...register("addressNumber", {required: true})}
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
               {...register("state", {required: true})}
               error={errors?.state?.type === 'required' ? true : false}
               helperText={errors?.state?.type === 'required' ? "O Estado é obrigatório" : ""}
            />
         </Grid2>
         <Grid2 xs={2}>
            <TextField
               fullWidth
               variant='outlined'
               label='País'
               required
               {...register("country", {required: true})}
               error={errors?.country?.type === 'required' ? true : false}
               helperText={errors?.country?.type === 'required' ? "O País é obrigatório" : ""}
            />
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