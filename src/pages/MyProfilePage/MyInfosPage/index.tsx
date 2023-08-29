import React, { useContext } from 'react';
import { AuthContext } from '../../../contexts/Auth/AuthContext';
import Grid2 from '@mui/material/Unstable_Grid2';
import { Button, Divider, Typography } from '@mui/material';

interface MyInfosPageProps {

}

const MyInfosPage: React.FC<MyInfosPageProps> = () => {
   const auth = useContext(AuthContext);

   return (
      <Grid2 container xs={12}>
         <Grid2 xs={6} sx={{ display: 'flex', gap: 7, justifyContent: 'center', flexDirection: 'column' }}>
            <Grid2 sx={{ display: 'flex', gap: 7, justifyContent: 'center' }}>
               <Grid2 sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Typography fontFamily={'Public Sans'} fontWeight={600}>
                     Nome completo: <Typography>{auth.user?.fullName}</Typography>
                  </Typography>
                  <Typography fontFamily={'Public Sans'} fontWeight={600}>
                     CPF: <Typography>{auth.user?.cpf}</Typography>
                  </Typography>
                  <Typography fontFamily={'Public Sans'} fontWeight={600}>
                     Data de nascimento: <Typography>{auth.user?.birthDate}</Typography>
                  </Typography>
               </Grid2>
               <Grid2 sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Typography fontFamily={'Public Sans'} fontWeight={600}>
                     Telefone: <Typography>{auth.user?.phone}</Typography>
                  </Typography>
                  <Typography fontFamily={'Public Sans'} fontWeight={600}>
                     Sexo: <Typography>{auth.user?.gender.name}</Typography>
                  </Typography>
               </Grid2>
            </Grid2>
            <Grid2 sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }} xs={12}>
               <Button
                  variant='contained'
                  sx={{
                     bgcolor: '#000',
                     color: 'white',
                     fontSize: 15,
                     width: 300,
                     height: 50,
                     '&:hover': {
                        bgcolor: '#5a5a5a',
                        color: '#000',
                     }
                  }}
               >
                  Editar dados pessoais
               </Button>
               <Button
                  variant='contained'
                  sx={{
                     bgcolor: '#fff',
                     color: '#000',
                     fontSize: 15,
                     width: 300,
                     height: 50,
                     '&:hover': {
                        bgcolor: '#5a5a5a',
                        color: '#fff',
                     }
                  }}
               >
                  Alterar senha
               </Button>
            </Grid2>
         </Grid2>
         <Divider orientation="vertical" variant='middle' flexItem />
         <Grid2 xs={6}>

         </Grid2>
      </Grid2>
   );
};

export default MyInfosPage;