import { Button, Divider, Typography } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import React, { useState } from 'react';
import MyInfosPage from './MyInfosPage';

interface MyProfilePageProps {

}

const MyProfilePage: React.FC<MyProfilePageProps> = () => {
   const [titlePage, setTitlePage] = useState('Minhas informações');

   return (
      <Grid2
         container
         xs={12}
         spacing={2}
         sx={{ mt: 15, mb: 10 }}
      >
         <Grid2 xs={12} sx={{ pl: 35 }}>
            <Typography fontFamily={'Public Sans'} fontSize={40}>
               {titlePage}
            </Typography>
         </Grid2>
         <Grid2 sx={{ pl: 5 }} xs={2}>
            <Divider />
            <Button
               variant='text'
               sx={{ color: 'black', m: 1 }}
               onClick={() => setTitlePage('Minhas informações')}
            >
               Minhas Informações
            </Button>
            <Button
               variant='text'
               sx={{ color: 'black', m: 1 }}
               onClick={() => setTitlePage('Meus pedidos')}
            >
               Meus Pedidos
            </Button>
            <Button
               variant='text'
               sx={{ color: 'black', m: 1 }}
               onClick={() => setTitlePage('Meus cupons')}
            >
               Meus cupons
            </Button>
            <Button
               variant='text'
               sx={{ color: 'black', m: 1 }}
               onClick={() => setTitlePage('Meus cartões')}
            >
               Meus cartões
            </Button>
         </Grid2>
         <Grid2
            xs={10}
            sx={{ pl: 4, pt: 10 }}
         >
            {
               titlePage === 'Minhas informações' ?
                  <MyInfosPage />
                  :
                  <></>
            }
         </Grid2>
      </Grid2>
   );
};

export default MyProfilePage;