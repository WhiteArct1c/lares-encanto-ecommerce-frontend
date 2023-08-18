import { Box, Button, TextField, Typography } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import React from 'react';

import { useForm } from 'react-hook-form';

interface FormRegisterUserProps {
   
}

const FormRegisterUser: React.FC<FormRegisterUserProps> = () => {
   const {
      register,
      handleSubmit,
      formState: { errors }
   } = useForm();

   const onSubmit = (data: unknown) => {
      console.log(data)
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
                     required
                     {...register("cpf", {required: true, maxLength: 11, minLength: 11})}
                     error={
                        errors?.cpf?.type === 'required' ||
                        errors?.cpf?.type === 'maxLength' ||
                        errors?.cpf?.type === 'mixLength' ? true : false
                     }
                     helperText={
                        errors?.cpf?.type === 'required' ||
                        errors?.cpf?.type === 'maxLength' ||
                        errors?.cpf?.type === 'mixLength' ? "O CPF é obrigatório." : ""
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