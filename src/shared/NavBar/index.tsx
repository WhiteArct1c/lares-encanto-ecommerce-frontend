import {AutoAwesome, SearchRounded, ShoppingBag} from '@mui/icons-material';
import {AppBar, Badge, Box, Button, Divider, IconButton, InputAdornment, TextField, Toolbar, Typography} from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import React, {useContext, useEffect, useState} from 'react';
import LogoLaresEncanto from '../../assets/Lares_Encanto-removebg-preview.png'
import {Link, useNavigate} from 'react-router-dom';
import {ShoppingCartContext} from '../../contexts/ShoppingCartContext';
import {AuthContext} from '../../contexts/Auth/AuthContext';
import AISuggestionsDialogComponent from "../AISuggestionsDialogComponent";

interface NavBarProps {
}

const NavBar: React.FC<NavBarProps> = () => {
   const cart = useContext(ShoppingCartContext);
   const auth = useContext(AuthContext);
   const navigate = useNavigate();
   const [isAdmin, setIsAdmin] = useState(false);
   const [open, setOpen] = useState(false);

   const handleClickOpen = () => {
      setOpen(true);
   }

   const handleClose = () => {
      setOpen(false);
   }

   const handleLogout = async () => {
      auth.signout();
      navigate('/login');
      setIsAdmin(false);
   }

   useEffect(() => {
      auth.verifyRole()
          .then(response => {
             if(response){
                setIsAdmin(response.data[0] === "ADMIN");
             }
          })
          .catch(e => {
             console.log(e);
          })
   }, [auth, auth.user]);

   return (
      <>
         {isAdmin ?
            <AppBar position='sticky'
               sx={{
                  bgcolor: '#FFF',
                  height: '50px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItens: 'center'
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
                              width: '200px'
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
                     <Typography color={'#000'} fontWeight={'700'} padding={2}>{auth.user?.fullName}</Typography>
                     <Divider orientation="vertical" variant='middle' flexItem />
                     <Button
                        variant='text'
                        sx={{
                           color: '#000',
                           fontWeight: '400',
                           padding: '1rem'
                        }}
                        onClick={handleLogout}
                     >
                        Logout
                     </Button>
                  </Grid2>
               </Grid2>
            </AppBar>
            :
            <AppBar position='fixed'
               sx={{
                  bgcolor: '#FFF',
                  height: '110px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItens: 'center',
                  width: '100%'
               }}
            >
               <Grid2 sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItens: 'center',
                  width: '100%'
               }}>
                  <Grid2
                     xs={8}
                     sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                     }}
                  >
                     <Box
                        component='img'
                        src={LogoLaresEncanto}
                        sx={{
                           width: '190px',
                           mr: 2
                        }}
                     />
                     <Grid2
                        xs
                        sx={{
                           display: 'flex',
                           justifyContent: 'center',
                           alignItems: 'center',
                           gap: '1rem'
                        }}
                     >
                        <TextField
                           InputProps={{
                              endAdornment: (
                                 <InputAdornment position="end">
                                    <IconButton>
                                       <SearchRounded />
                                    </IconButton>
                                 </InputAdornment>
                              ),
                              }}
                           fullWidth
                           size='small'
                           label='Pesquisar produto...'
                           variant='outlined'
                           data-cy="navbar-input-search"
                        />
                        <Button
                           variant='text'
                           sx={{
                              color: '#000',
                              fontWeight: '400',
                              width: '200px',
                           }}
                           endIcon={<AutoAwesome color='primary'/>}
                           onClick={handleClickOpen}
                           data-cy="navbar-btn-recommend"
                        >
                           me recomende!
                        </Button>
                        <AISuggestionsDialogComponent
                           open={open}
                           onClose={handleClose}
                        />
                     </Grid2>
                  </Grid2>
               </Grid2>
               <Grid2 container sx={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  alignItems: 'center'
               }}>
                  <Grid2 xs={8} sx={{
                     height: '50px',
                     display: 'flex',
                     justifyContent: 'space-around',
                     alignItems: 'end',
                  }}>
                     
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
                     <Link to='/products'>
                        <Button
                           variant='text'
                           sx={{
                              color: '#000',
                              fontWeight: '400'
                           }}
                        >
                           Ver todos
                        </Button>
                     </Link>
                  </Grid2>
                  <Grid2
                     xs={3}
                     sx={{
                        display: 'flex',
                        alignItems: 'end',
                        justifyContent: 'center'
                     }}
                  >
                     <Link to='/cart'>
                        <IconButton data-cy="navbar-btn-cart" sx={{ mr: 2 }} >
                           <Badge badgeContent={cart?.cartProducts.length} color='primary'>
                              <ShoppingBag />
                           </Badge>
                        </IconButton>
                     </Link>
                     {
                        auth.user ?
                           <>
                              <Link to='/my-profile'>
                                 <Button
                                    variant='text'
                                    sx={{
                                       color: '#000',
                                       fontWeight: '400',
                                       padding: '0.5rem'
                                    }}
                                 >
                                    {auth.user.fullName}
                                 </Button>
                              </Link>
                              <Divider orientation="vertical" variant='middle' flexItem />
                              <Button
                                 variant='text'
                                 sx={{
                                    color: '#000',
                                    fontWeight: '400',
                                    padding: '0.5rem'
                                 }}
                                 onClick={handleLogout}
                              >
                                 Logout
                              </Button>
                           </>
                           :
                           <>
                              <Link to='/login'>
                                 <Button
                                    variant='text'
                                    sx={{
                                       color: '#000',
                                       fontWeight: '400',
                                       padding: '0.5rem'
                                    }}
                                    >
                                    ENTRAR
                                 </Button>
                              </Link>
                              <Divider orientation="vertical" variant='middle' flexItem />
                              <Link to='/register-user'>
                                 <Button
                                    variant='text'
                                    sx={{
                                       color: '#000',
                                       fontWeight: '400',
                                       padding: '0.5rem'
                                    }}
                                    >
                                    Criar sua conta
                                 </Button>
                              </Link>
                           </>
                     }
                  </Grid2>
               </Grid2>
            </AppBar>
         }
      </>
   );
};

export default NavBar;
