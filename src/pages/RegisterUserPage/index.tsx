import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, Button, FormControlLabel, FormHelperText, FormLabel, IconButton, InputAdornment, MenuItem, Radio, RadioGroup, TextField, Typography } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import React, { useState, FocusEvent, useContext } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { countries, tiposDeResidencia } from '../../utils/addressTypes';
import { extractAddressType, extractLogradouroWithoutType, formatCEP } from '../../services/address/AddressService';
import { IAddressViaCEP } from '../../utils/interfaces/IAddressViaCEP';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Customer } from '../../utils/types/Customer';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/Auth/AuthContext';

interface FormRegisterUserProps {

}

const FormRegisterUser: React.FC<FormRegisterUserProps> = () => {
   const [showPassword, setShowPassword] = useState(false);
   const [radioValue, setRadioValue] = useState('MASCULINO');
   const navigate = useNavigate();
   const auth = useContext(AuthContext);

   const {
      register,
      handleSubmit,
      setValue,
      getValues,
      setFocus,
      formState: { errors },
      watch,
      control
   } = useForm();

   const patternEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
   const patternCPF = /^([0-9]{2}[.]?[0-9]{3}[.]?[0-9]{3}[/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[.]?[0-9]{3}[.]?[0-9]{3}[-]?[0-9]{2})/;
   const cepField = register('cep', { required: true, maxLength: 8, minLength: 8 });

   const handleClickShowPassword = () => setShowPassword((show) => !show);

   const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
   };

   const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setRadioValue((event.target as HTMLInputElement).value);
   };

   const handleFillAddress = async (event: FocusEvent<HTMLInputElement>) => {
      if (event.target.value !== '') {
         const formattedCEP = formatCEP(event.target.value);
         await axios({
            method: "get",
            url: `${import.meta.env.VITE_API_VIA_CEP}${formattedCEP}/json/`
         })
            .then((res: IAddressViaCEP) => {
               setValue('addressType', extractAddressType(res.data.logradouro));
               setValue('streetName', extractLogradouroWithoutType(res.data.logradouro));
               setValue('city', res.data.localidade);
               setValue('state', res.data.uf);
               setValue('neighborhoods', res.data.bairro);
               setFocus('addressNumber');
            })
            .catch(e => {
               toast.error('CEP inválido ou inexistente!');
               console.log(e);
            });
      }
   }

   const onSubmit = async () => {
      const newCustomer: Customer = {
         user: {
            email: getValues().email as string | undefined || '',
            password: getValues().password as string | undefined || '',
            confirmedPassword: getValues().confirmedPassword as string | undefined || ''
         },
         fullName: getValues().fullName as string | undefined || '',
         cpf: getValues().cpf as string | undefined || '',
         birthDate: getValues().birthDate as string | undefined || '',
         phone: getValues().phone as string | undefined || '',
         gender: radioValue,
         address: {
            title: getValues().addressTitle as string | undefined || '',
            cep: getValues().cep as string | undefined || '',
            residenceType: getValues().residenceType as string | undefined || '',
            addressType: getValues().addressType as string | undefined || '',
            streetName: getValues().streetName as string | undefined || '',
            addressNumber: getValues().addressNumber as string | undefined || '',
            neighborhoods: getValues().neighborhoods as string | undefined || '',
            city: getValues().city as string | undefined || '',
            state: getValues().state as string | undefined || '',
            country: getValues().country as string | undefined || '',
            observations: getValues().observations as string | undefined || ''
         }
      }

      const response = await auth.registerCustomer(newCustomer);

      if (response.code === "201 CREATED") {
         toast.success("Cadastro concluído com sucesso");
         navigate('/login');
      } else {
         toast.error(response.message);
      }

   }

   return (
      <Grid2 container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 15, mb: 10 }}>
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
               width: {
                  xs: '100%', sm: "56%", md: "48%"
               },
               mt: "31px"
            }}
         >
            <Grid2
               container
               spacing={2}
               sx={{
                  width: {
                     sm: "90%", md: "100%", lg: "100%"
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
                     {...register("fullName", { required: true })}
                     error={errors?.fullName?.type === 'required' ? true : false}
                     helperText={errors?.fullName?.type === 'required' ? "O nome completo é obrigatório." : ""}
                  />
               </Grid2>
               <Grid2 xs={6}>
                  <TextField
                     fullWidth
                     variant='outlined'
                     label='CPF'
                     required
                     {...register("cpf", { required: true, maxLength: 11, minLength: 11, pattern: patternCPF })}
                     error={
                        errors?.cpf?.type === 'required' ||
                           errors?.cpf?.type === 'maxLength' ||
                           errors?.cpf?.type === 'minLength' ? true : false
                     }
                     helperText={
                        errors?.cpf?.type === 'required' ? "O CPF é obrigatório." :
                           errors?.cpf?.type === 'maxLength' ? "O CPF deve ter apenas 11 dígitos." :
                              errors?.cpf?.type === 'minLength' ? "O CPF deve ter apenas 11 dígitos." : ""
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
                     {...register("birthDate", { required: true })}
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
                     {...register("phone", { required: true })}
                     error={errors?.phone?.type === 'required' ? true : false}
                     helperText={errors?.phone?.type === 'required' ? "O número de telefone celular é obrigatório" : ""}
                  />
               </Grid2>
               <Grid2
                  xs={12}
                  sx={{
                     display: "flex",
                     flexDirection: "row",
                     alignItems: "center"
                  }}
               >
                  <FormLabel
                     id="demo-row-radio-buttons-group-label"
                     sx={{
                        mr: "10px",
                        display: "flex",
                        alignItems: "center"
                     }}
                  >
                     Sexo:
                  </FormLabel>
                  <Controller
                     control={control}
                     name="gender"
                     defaultValue={"MASCULINO"}
                     render={({ field }) => (
                        <RadioGroup
                           {...field}
                           row
                           value={radioValue}
                           onChange={handleRadioChange}
                        >
                           <FormControlLabel value="MASCULINO" control={<Radio />} label="Masculino" />
                           <FormControlLabel value="FEMININO" control={<Radio />} label="Feminino" />
                           <FormControlLabel value="OUTROS" control={<Radio />} label="Outros" />
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
                     {...register("email", { required: true, pattern: patternEmail })}
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
                     {...register("password", { required: true, minLength: 8 })}
                     error={
                        errors?.password?.type === 'required' ||
                           errors?.password?.type === 'minLength' ? true : false
                     }
                     helperText={
                        errors?.cpf?.type === 'required' ? "A senha é obrigatória." :
                           errors?.cpf?.type === 'minLength' ? "A senha deve ter no mínimo 8 dígitos." : ""
                     }
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
                     {...register("confirmedPassword",
                        {
                           required: true,
                           validate: (val: string) => {
                              if (val !== watch('password')) return "no-equal";
                           }
                        }
                     )}
                     error={
                        errors?.confirmedPassword?.message === 'no-equal' ? true : false
                     }
                     helperText={errors?.confirmedPassword?.message === 'no-equal' ? "As senhas devem ser iguais!" : ""}
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
                     {...register("addressTitle", { required: true })}
                     error={errors?.addressTitle?.type === 'required' ? true : false}
                     helperText={errors?.addressTitle?.type === 'required' ? "O título do endereço é obrigatório" : ""}
                  />
               </Grid2>
               <Grid2 xs={4}
                  onBlur={(e) => {
                     cepField.onBlur(e);
                     if (e.target instanceof HTMLInputElement) {
                        handleFillAddress(e as FocusEvent<HTMLInputElement>);
                     }
                  }}
               >
                  <TextField
                     fullWidth
                     variant='outlined'
                     label='CEP'
                     required
                     {...cepField}
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
                     fullWidth
                     label='Tipo logradouro'
                     required
                     InputLabelProps={{
                        shrink: true,
                     }}
                     {...register("addressType", { required: true })}
                     error={errors?.addressType?.type === 'required' ? true : false}
                     helperText={errors?.addressTyp?.type === 'required' ? "O tipo de endereço é obrigatório" : ""}
                  />
               </Grid2>
               <Grid2 xs={9}>
                  <TextField
                     fullWidth
                     variant='outlined'
                     label='Logradouro'
                     InputLabelProps={{
                        shrink: true,
                     }}
                     required
                     {...register("streetName", { required: true })}
                     error={errors?.streetName?.type === 'required' ? true : false}
                     helperText={errors?.streetName?.type === 'required' ? "O Logradouro é obrigatório" : ""}
                  />
               </Grid2>
               <Grid2 xs={3}>
                  <TextField
                     fullWidth
                     variant='outlined'
                     label='Número'
                     required
                     {...register("addressNumber", { required: true })}
                     error={errors?.addressNumber?.type === 'required' ? true : false}
                     helperText={errors?.addressNumber?.type === 'required' ? "O Número  é obrigatório" : ""}
                  />
               </Grid2>
               <Grid2 xs={4}>
                  <TextField
                     fullWidth
                     variant='outlined'
                     label='Bairro'
                     InputLabelProps={{
                        shrink: true,
                     }}
                     required
                     {...register("neighborhoods", { required: true })}
                     error={errors?.neighborhoods?.type === 'required' ? true : false}
                     helperText={errors?.neighborhoods?.type === 'required' ? "O Bairro é obrigatório" : ""}
                  />
               </Grid2>
               <Grid2 xs={3}>
                  <TextField
                     fullWidth
                     variant='outlined'
                     label='Cidade'
                     InputLabelProps={{
                        shrink: true,
                     }}
                     required
                     {...register("city", { required: true })}
                     error={errors?.city?.type === 'required' ? true : false}
                     helperText={errors?.city?.type === 'required' ? "A Cidade é obrigatória" : ""}
                  />
               </Grid2>
               <Grid2 xs={3}>
                  <TextField
                     fullWidth
                     variant='outlined'
                     label='Estado'
                     InputLabelProps={{
                        shrink: true,
                     }}
                     required
                     {...register("state", { required: true })}
                     error={errors?.state?.type === 'required' ? true : false}
                     helperText={errors?.state?.type === 'required' ? "O Estado é obrigatório" : ""}
                  />
               </Grid2>
               <Grid2 xs={2}>
                  <TextField
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
                     error={errors?.country?.type === 'required' ? true : false}
                     helperText={errors?.country?.type === 'required' ? "O País é obrigatório" : ""}
                  >
                     {countries.map((country, index) => (
                        <MenuItem key={index} value={country}>{country}</MenuItem>
                     ))}
                  </TextField>
               </Grid2>
               <Grid2 xs={12}>
                  <TextField
                     fullWidth
                     multiline
                     rows={4}
                     variant='outlined'
                     label='Observações'
                     required
                     {...register("observations")}
                  />
               </Grid2>
               <Grid2 xs={12}>
                  <Typography fontFamily={'Public Sans, serif-sans'} fontWeight={100} color={'#78797B'}> Campos obrigatórios ( * )</Typography>
               </Grid2>
               <Grid2
                  xs={12}
                  sx={{
                     display: "flex",
                     flexDirection: "column",
                     alignItems: "center",
                     mt: "20px"
                  }}
               >
                  <Button
                     variant='contained'
                     sx={{
                        width: "226px",
                        height: "54px",
                        bgcolor: "#000",
                        '&:hover': {
                           bgcolor: "#555"
                        }
                     }}
                     onClick={() => handleSubmit(onSubmit)()}
                  >
                     Cadastrar
                  </Button>
               </Grid2>
            </Grid2>

         </Box>
      </Grid2>
   );
};

export default FormRegisterUser;