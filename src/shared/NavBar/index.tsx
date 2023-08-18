import { SearchRounded, ShoppingBag } from '@mui/icons-material';
import { AppBar, Box, Button, Divider, IconButton, TextField, Toolbar, Typography } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import React from 'react';
import LogoLaresEncanto from '../../assets/Lares_Encanto-removebg-preview.png'

interface NavBarProps {
   isAdmin: boolean
}

const NavBar: React.FC<NavBarProps> = ({ isAdmin }: NavBarProps) => {
   return (
      <>
         {isAdmin ?
            <AppBar position='sticky'
               sx={{
                  bgcolor: '#FFF',
                  height: '72px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItens:'center'
               }}
            >
               <Grid2 container>
                  <Grid2
                     xs={2}
                     sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                     }}
                  >
                     <Toolbar>
                        <Box
                           component='img'
                           src={LogoLaresEncanto}
                           sx={{
                              width: '240px'
                           }}
                        />
                     </Toolbar>
                  </Grid2>
                  <Grid2 xs>
                     <Toolbar>
                        <Typography color={'#000'} fontWeight={'700'}>Administrador</Typography>
                     </Toolbar>
                  </Grid2>
                  <Grid2 xs={3} sx={{
                     display: 'flex',
                     alignItems: 'center',
                     justifyContent: 'center'
                  }}>
                     <Typography color={'#000'} fontWeight={'700'} padding={2}>Matheus R. Bispo</Typography>
                     <Divider orientation="vertical" variant='middle' flexItem />
                     <Button
                        variant='text'
                        sx={{
                           color: '#000',
                           fontWeight: '400',
                           padding: '1rem'
                        }}
                     >
                        Logout
                     </Button>
                  </Grid2>
               </Grid2>
            </AppBar>
         :
            <AppBar position='static'
               sx={{
                  bgcolor: '#FFF',
                  height: '72px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItens:'center'
               }}
            >
               <Grid2 container>
                  <Grid2
                     xs={2}
                     sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                     }}
                  >
                     <Toolbar>
                        <Box
                           component='img'
                           src={LogoLaresEncanto}
                           sx={{
                              width: '240px'
                           }}
                        />
                     </Toolbar>
                  </Grid2>
                  <Grid2 xs={5}>
                     <Toolbar
                        sx={{
                           justifyContent: 'space-around'
                        }}
                     >
                        <Button
                           variant='text'
                           sx={{
                              color: '#000',
                              fontWeight: '400'
                           }}
                        >
                           Sala de Estar
                        </Button>
                        <Button
                           variant='text'
                           sx={{
                              color: '#000',
                              fontWeight: '400'
                           }}
                        >
                           Cozinha
                        </Button>
                        <Button
                           variant='text'
                           sx={{
                              color: '#000',
                              fontWeight: '400'
                           }}
                        >
                           Quarto
                        </Button>
                        <Button
                           variant='text'
                           sx={{
                              color: '#000',
                              fontWeight: '400'
                           }}
                        >
                           Escritório
                        </Button>
                        <Button
                           variant='text'
                           sx={{
                              color: '#000',
                              fontWeight: '400'
                           }}
                        >
                           Ver todos
                        </Button>
                     </Toolbar>
                  </Grid2>
                  <Grid2
                     xs
                     sx={{
                        display: 'flex',
                        justifyContent:'center',
                        alignItems: 'center',
                        gap: '0.5rem'
                     }}    
                  >
                     <TextField 
                        fullWidth
                        label='Pesquisar produto...' 
                        variant='outlined'
                     />
                     <IconButton>
                        <SearchRounded/>
                     </IconButton>
                  </Grid2>
                  <Grid2
                     xs={3}
                     sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                     }}
                  >
                     <IconButton>
                        <ShoppingBag />
                     </IconButton>
                     <Typography color={'#000'} fontWeight={'700'} marginRight={2}>1</Typography>
                     <Divider orientation="vertical" variant='middle' flexItem />
                     <Button
                        variant='text'
                        sx={{
                           color: '#000',
                           fontWeight: '400',
                           padding: '1rem'
                        }}
                     >
                        Login
                     </Button>
                  </Grid2>
               </Grid2>
            </AppBar>
         }
      </>
   );
};

export default NavBar;
