import { Box, Button, Divider, Typography } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import React from 'react';
import PaymentMethods from '../../assets/image-removebg-preview.png';

interface FooterProps {
   
}

const Footer: React.FC<FooterProps> = () => {
   return (
      <>
         <Divider 
            sx={{
               mb: '50px',
               mt: '30px'
            }}
            variant='middle'
         />
         <Grid2 container
            sx={{
               display:'flex',
               alignItems: 'baseline',
               justifyContent: 'center'
            }}   
         >
            <Grid2
               xs={4}
               sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center'
               }}
            >
               <Typography fontWeight={'700'} color={'#000'} marginBottom={'20px'}>Categorias</Typography>
               <Button 
                  variant='text'
                  sx={{
                     color: '#111'
                  }}
               >
                  Sala de estar
               </Button>
               <Button 
                  variant='text'
                  sx={{
                     color: '#111'
                  }}
               >
                  Cozinha
               </Button>
               <Button 
                  variant='text'
                  sx={{
                     color: '#111'
                  }}
               >
                  Quarto
               </Button>
               <Button 
                  variant='text'
                  sx={{
                     color: '#111'
                  }}
               >
                  Escritório
               </Button>
            </Grid2>
            <Grid2
               sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center'
               }}
            >
               <Typography fontWeight={'700'} color={'#000'} marginBottom={'20px'}>Sobre a Lares Encanto</Typography>
               <Button 
                  variant='text'
                  sx={{
                     color: '#111'
                  }}
               >
                  Sobre nós
               </Button>
               <Button 
                  variant='text'
                  sx={{
                     color: '#111'
                  }}
               >
                  Política de Privacidade
               </Button>
            </Grid2>
            <Grid2 
               xs={4}
               sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center'
               }}
            >
               <Typography fontWeight={'700'} color={'#000'} marginBottom={'20px'}>Pagamentos</Typography>
               <Box
                  component='img'
                  src={PaymentMethods}
                  sx={{
                     width: '240px'
                  }}
               />
            </Grid2>
         </Grid2>
         <Grid2 xs={12} sx={{mt:2, bgcolor:'#000', height:40, display:'flex', alignItems:'center', justifyContent:'center'}}>
            <Typography textAlign={'center'} color={'#fff'} fontWeight={700}>
               ©LARESENCANTO.COM.BR - TODOS OS DIREITOS RESERVADOS. 
            </Typography>
         </Grid2>
      </>
   );
};

export default Footer;