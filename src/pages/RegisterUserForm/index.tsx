import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, Button, FormControlLabel, FormHelperText, FormLabel, IconButton, InputAdornment, MenuItem, Radio, RadioGroup,   TextField, Typography } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import React, { useState } from 'react';

import { Controller, useForm } from 'react-hook-form';
import { tiposDeLogradouro, tiposDeResidencia } from '../../utils/addressTypes';

interface FormRegisterUserProps {
   
}

const FormRegisterUser: React.FC<FormRegisterUserProps> = () => {
   const [showPassword, setShowPassword] = useState(false);
   const [radioValue, setRadioValue] = useState('masculino');
   
   const patternEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

   const handleClickShowPassword = () => setShowPassword((show) => !show);

   const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
   };

   const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setRadioValue((event.target as HTMLInputElement).value);
   };
  

   const {
      register,
      handleSubmit,
      formState: { errors },
      watch,
      control
   } = useForm();

   const onSubmit = (data: unknown) => {
      console.log(data)
      //TODO: Implementar o envio das informações para o backend
   }

   return (
      <>
         <Typography 
            color={"#000"} 
            fontSize={"3rem"}
            fontFamily={"Public Sans, sans-serif"}
            fontWeight={"700"}
         >
            Cadastre-se
         </Typography>
         <Box
            component="form"
            sx={{
               width:{
                  xs:'100%',sm:"56%",md:"48%"
               },
               mt:"31px"
            }}
         >
            <Grid2 
               container 
               spacing={2}
               sx={{
                  width:{
                     sm:"90%", md:"100%", lg:"100%"
                  },
                  display: "flex"
               }}
            >
               <Grid2 xs={6}>
                  <TextField
                     fullWidth
                     variant='outlined'
                     label='Nome completo'
                     required
                     {...register("fullName", {required: true})}
                     error={errors?.fullName?.type === 'required' ? true : false}
                     helperText={errors?.fullName?.type === 'required' ? "O nome completo é obrigatório." : ""}
                  />
               </Grid2>
               <Grid2 xs={6}>
                  <TextField
                     fullWidth
                     variant='outlined'
                     label='CPF'
                     inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                     required
                     {...register("cpf", {required: true, maxLength: 11, minLength: 11, valueAsNumber: true})}
                     error={
                        errors?.cpf?.type === 'required' ||
                        errors?.cpf?.type === 'maxLength' ||
                        errors?.cpf?.type === 'mixLength' ? true : false
                     }
                     helperText={
                        errors?.cpf?.type === 'required' ? "O CPF é obrigatório." : 
                        errors?.cpf?.type === 'maxLength' ? "O CPF deve ter 11 dígitos." :
                        errors?.cpf?.type === 'minLength' ? "O CPF deve ter 11 dígitos." : 
                        errors?.cpf?.type === 'valueAsNumber' ? "O CPF deve conter apenas números." : ""
                     }
                  />
               </Grid2>
               <Grid2 xs={6}>
                  <TextField
                     fullWidth
                     label='Data de nascimento'
                     InputLabelProps={{
                        shrink: true,
                     }}
                     type='date'
                     required
                     {...register("birthDate", {required: true})}
                     error={errors?.birthDate?.type === 'required' ? true : false}
                     helperText={errors?.birthDate?.type === 'required' ? "A data de nascimento é obrigatória" : ""}
                  />
               </Grid2>
               <Grid2 xs={6}>
                  <TextField
                     fullWidth
                     variant='outlined'
                     label='Telefone Celular'
                     required
                     {...register("cellphone", {required: true})}
                     error={errors?.cellphone?.type === 'required' ? true : false}
                     helperText={errors?.cellphone?.type === 'required' ? "O número de telefone celular é obrigatório" : ""}
                  />
               </Grid2>
               <Grid2
                  xs={12}
                  sx={{
                     display:"flex",
                     flexDirection:"row",
                     alignItems:"center"
                  }}
               >
                  <FormLabel 
                     id="demo-row-radio-buttons-group-label" 
                     sx={{
                        mr:"10px",
                        display:"flex",
                        alignItems:"center"
                     }}
                  >
                     Sexo:
                  </FormLabel>
                  <Controller
                     control={control}
                     name="gender"
                     defaultValue={"masculino"}
                     render={({field}) =>(
                        <RadioGroup
                           {...field}
                           row
                           value={radioValue}
                           onChange={handleRadioChange}
                        >
                           <FormControlLabel value="masculino" control={<Radio />} label="Masculino" />
                           <FormControlLabel value="feminino" control={<Radio />} label="Feminino" />
                           <FormControlLabel value="outros" control={<Radio />} label="Outros" />
                        </RadioGroup>
                     )}
                  />
               </Grid2>
               <Grid2 xs={12}>
                  <TextField
                     fullWidth
                     variant='outlined'
                     label='E-mail'
                     type='email'
                     required
                     {...register("email", {required: true, pattern: patternEmail})}
                     error={errors?.email?.type === 'required' || errors?.email?.type === 'pattern' ? true : false}
                     helperText={
                        errors?.email?.type === 'required' ? "O email é obrigatório" :
                        errors?.email?.type === 'pattern' ? "Insira um email válido" : ""
                     }
                  />
               </Grid2>
               <Grid2 xs={6}>
                  <TextField
                     fullWidth
                     label='Senha'
                     type={showPassword ? 'text' : 'password'}
                     InputLabelProps={{
                        shrink: true,
                     }}
                     required
                     {...register("password", {required: true})}
                     error={errors?.password?.type === 'required' ? true : false}
                     helperText={errors?.password?.type === 'required' ? "A senha é obrigatória" : ""}
                     InputProps={{
                        endAdornment:
                        <InputAdornment position="end">
                           <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                           >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                           </IconButton>
                        </InputAdornment>
                     }}
                  />
               </Grid2>
               <Grid2 xs={6}>
               <TextField
                     fullWidth
                     label='Repetir Senha'
                     type={showPassword ? 'text' : 'password'}
                     InputLabelProps={{
                        shrink: true,
                     }}
                     required
                     {...register("confirmPassword", 
                        {
                           required: true,
                           validate:(val: string) => {
                              if(val !== watch('password')) return "no-equal";
                           }
                        }
                     )}
                     error={
                        errors?.confirmPassword?.message === 'no-equal' ? true : false
                     }
                     helperText={errors?.confirmPassword?.message === 'no-equal' ? "As senhas devem ser iguais!" : ""}
                     InputProps={{
                        endAdornment:
                        <InputAdornment position="end">
                           <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                           >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                           </IconButton>
                        </InputAdornment>
                     }}
                  />
               </Grid2>
               <Grid2 xs={12}>
                  <TextField
                     fullWidth
                     variant='outlined'
                     label='Titulo do endereço'
                     placeholder="Casa principal, Loja A, etc..."
                     multiline
                     required
                     {...register("addressTitle", {required: true})}
                     error={errors?.addressTitle?.type === 'required' ? true : false}
                     helperText={errors?.addressTitle?.type === 'required' ? "O título do endereço é obrigatório" : ""}
                  />
               </Grid2>
               <Grid2 xs={4}>
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
               <Grid2 xs={5}>
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
               <Grid2 xs={9}>
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
               <Grid2 xs={3}>
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
               <Grid2 xs={4}>
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
               <Grid2 xs={3}>
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
                  <TextField
                     fullWidth
                     multiline
                     rows={4}
                     variant='outlined'
                     label='Observações'
                     required
                     {...register("description")}
                  />
               </Grid2>
               <Grid2 xs={12}>
                  <Typography fontFamily={'Public Sans, serif-sans'} fontWeight={100} color={'#78797B'}> Campos obrigatórios ( * )</Typography>
               </Grid2>
               <Grid2 
                  xs={12}
                  sx={{
                     display: "flex",
                     flexDirection:"column",
                     alignItems:"center",
                     mt:"20px"
                  }}
               >
                  <Button
                     variant='contained'
                     sx={{
                        width:"226px",
                        height: "54px",
                        bgcolor: "#000",
                        '&:hover':{
                           bgcolor:"#555"
                        }   
                     }}
                     onClick={() => handleSubmit(onSubmit)()}
                  >
                     Cadastrar
                  </Button>
               </Grid2>
            </Grid2>

         </Box>
      </>
   );
};

export default FormRegisterUser;