import React, { useContext, useState } from 'react';
import { AuthContext } from '../../../contexts/Auth/AuthContext';
import Grid2 from '@mui/material/Unstable_Grid2';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, IconButton, InputAdornment, TextField, Tooltip, Typography } from '@mui/material';
import { Add, Delete, Edit, Visibility, VisibilityOff } from '@mui/icons-material';
import { useApi } from '../../../hooks/useApi';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

interface MyInfosPageProps {

}

const MyInfosPage: React.FC<MyInfosPageProps> = () => {
   const auth = useContext(AuthContext);
   const api = useApi();
   const navigate = useNavigate();
   const [open, setOpen] = useState(false);
   const [titleDialog, setTitleDialog] = useState('');
   const [showPassword, setShowPassword] = useState(false);

   const handleClickShowPassword = () => setShowPassword((show) => !show);

   const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
   };

   const handleClickOpenDialog = (value: string, id?: string) => {
      //TODO: pegar id e as opções e enviar requisições conforme parametros
      setTitleDialog(value)
      setOpen(true);
   };

   const handleClose = () => {
      setOpen(false);
   };

   const handleInativateAccount = async () => {
      const response = await auth.deactivateAccount(localStorage.getItem('authToken')!);
      if(response.code === '200 OK'){
         handleClose();
         await auth.signout();
         // eslint-disable-next-line no-self-assign
         window.location.href = window.location.href;
         navigate('/login');
         toast.success(response.message);
      }else{
         toast.error(response.message);
      }
   }

   return (
      <Grid2 container xs={12}>
         <Grid2 xs={6} sx={{ display: 'flex', gap: 7, justifyContent: 'center', flexDirection: 'column' }}>
            <Grid2 sx={{ display: 'flex', gap: 7, justifyContent: 'center' }}>
               <Grid2 sx={{ display: 'flex', flexDirection: 'column', gap: 1 }} >
                  <Typography fontFamily={'Public Sans'} fontWeight={600}>
                     Nome completo: 
                  </Typography>
                  <Typography component={'span'}>{auth.user?.fullName}</Typography>
                  <Typography fontFamily={'Public Sans'} fontWeight={600}>
                     CPF: 
                  </Typography>
                  <Typography>{auth.user?.cpf}</Typography>
                  <Typography fontFamily={'Public Sans'} fontWeight={600}>
                     Data de nascimento: 
                  </Typography>
                  <Typography>{auth.user?.birthDate}</Typography>
               </Grid2>
               <Grid2 sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography fontFamily={'Public Sans'} fontWeight={600}>
                     Telefone: 
                  </Typography>
                  <Typography>{auth.user?.phone}</Typography>
                  <Typography fontFamily={'Public Sans'} fontWeight={600}>
                     Sexo: 
                  </Typography>
                  <Typography>{auth.user?.gender.name}</Typography>
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
                  onClick={() => handleClickOpenDialog("Editar dados pessoais")}
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
                  onClick={() => handleClickOpenDialog("Alterar senha")}
               >
                  Alterar senha
               </Button>
               <Button
                  variant='text'
                  sx={{
                     color: '#000',
                     fontSize: 15,
                     width: 300,
                     height: 50,
                     '&:hover': {
                        color: '#999'
                     }
                  }}
                  onClick={() => handleClickOpenDialog("Inativar conta")}
               >
                  Inativar conta
               </Button>
            </Grid2>
         </Grid2>
         <Divider orientation="vertical" variant='middle' flexItem />
         <Grid2 xs={5} sx={{ml:2}}>
            <Grid2 sx={{display:'flex', justifyContent:'space-between'}}>
               <Typography fontFamily={'Public Sans'} fontSize={35}>Meus Endereços</Typography>
               <Tooltip title='Adicionar endereços'>
                  <IconButton sx={{width:50}} onClick={() => handleClickOpenDialog('Adicionar endereço')}>
                     <Add fontSize='large'/>
                  </IconButton>
               </Tooltip>
            </Grid2>
            <Divider sx={{mb:3}}/>
            <Grid2 sx={{overflowY:'scroll', p:1, height:450}}>
               {auth.user?.addresses.map((address, index) => {
                  return(
                     <Grid2 sx={{border:'1px solid #111', borderRadius:1, p:2}} key={index}>
                        <Grid2 sx={{display:'flex', justifyContent:'space-between'}}>
                           <Typography fontFamily={'Public Sans'} fontSize={25}>{address.title}</Typography>
                           <Box>
                              <Tooltip title='Excluir endereço'>
                                 <IconButton onClick={() => handleClickOpenDialog('Excluir endereço', address.id)}>
                                    <Delete/>
                                 </IconButton>
                              </Tooltip>
                              <Tooltip title='Editar endereço'>
                                 <IconButton onClick={() => handleClickOpenDialog('Editar endereço', address.id)}>
                                    <Edit/>
                                 </IconButton>
                              </Tooltip>
                           </Box>
                        </Grid2>
                        <Divider sx={{mb:2}}/>
                        <Grid2 xs={12} sx={{display:'flex'}}>
                           <Grid2 xs>
                              <Typography fontFamily={'Public Sans'} fontWeight={600}>Tipo de logradouro:</Typography>
                              <Typography fontFamily={'Public Sans'} fontWeight={400}>{address.addressType}</Typography>
                              <Typography fontFamily={'Public Sans'} fontWeight={600}>CEP:</Typography>
                              <Typography fontFamily={'Public Sans'} fontWeight={400}>{address.cep}</Typography>
                              <Typography fontFamily={'Public Sans'} fontWeight={600}>Logradouro:</Typography>
                              <Typography fontFamily={'Public Sans'} fontWeight={400}>{address.streetName}</Typography>
                           </Grid2>
                           <Grid2 xs>
                              <Typography fontFamily={'Public Sans'} fontWeight={600}>Tipo de residência:</Typography>
                              <Typography fontFamily={'Public Sans'} fontWeight={400}>{address.residenceType}</Typography>
                              <Typography fontFamily={'Public Sans'} fontWeight={600}>Número:</Typography>
                              <Typography fontFamily={'Public Sans'} fontWeight={400}>{address.addressNumber}</Typography>
                              <Typography fontFamily={'Public Sans'} fontWeight={600}>Bairro:</Typography>
                              <Typography fontFamily={'Public Sans'} fontWeight={400}>{address.neighborhoods}</Typography>
                           </Grid2>
                        </Grid2>
                     </Grid2>
                  )
               })}
            </Grid2>
         </Grid2>
         <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{titleDialog}</DialogTitle>
            <DialogContent>
               {
                  titleDialog === 'Editar dados pessoais' ?
                     <Box component={'form'} sx={{display: 'flex', flexDirection:'column', gap:2}}>
                        <TextField
                           fullWidth
                           autoFocus
                           label="Nome completo"
                           type="email"
                           sx={{width:500}}
                        />
                        <TextField
                           fullWidth
                           autoFocus
                           label="CPF"
                           type="text"
                           sx={{width:500}}
                        />
                        <TextField
                           fullWidth
                           autoFocus
                           label="Data de nascimento"
                           InputLabelProps={{
                              shrink: true,
                           }}
                           type="date"
                           sx={{width:500}}
                        />
                     </Box>
                  : titleDialog === 'Alterar senha' ?
                     <Box component={'form'} sx={{display: 'flex', flexDirection:'column', gap:2}}>
                        <TextField
                           fullWidth
                           label='Senha'
                           type={showPassword ? 'text' : 'password'}
                           sx={{
                              width:400,
                              mt:1
                           }}
                           InputLabelProps={{
                              shrink: true,
                           }}
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
                        <TextField
                           fullWidth
                           label='Confirmar senha'
                           type={showPassword ? 'text' : 'password'}
                           InputLabelProps={{
                              shrink: true,
                           }}
                           sx={{
                              width:400
                           }}
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
                     </Box>
                  : titleDialog === 'Inativar conta' ?
                     <DialogContentText>
                        Ao inativar sua conta, só será possível ativa-lá novamente por meio de solicitação ao administrador do sistema.
                        Tem certeza que deseja inativar sua conta?
                     </DialogContentText>
                  : titleDialog === 'Excluir endereço' ?
                     <DialogContentText>
                        Deseja realmente excluir o endereço selecionado?
                     </DialogContentText>
                  :
                     <></>
               }
            </DialogContent>
            <DialogActions>
               {
                  titleDialog === 'Editar dados pessoais' ?
                     <>
                        <Button onClick={handleClose}>Cancelar</Button>
                        <Button onClick={handleClose}>Editar</Button>
                     </>
                  : titleDialog === 'Alterar senha'?
                     <>
                        <Button onClick={handleClose}>Cancelar</Button>
                        <Button onClick={handleClose}>Alterar</Button>
                     </>
                  : titleDialog === 'Inativar conta'?
                     <>
                        <Button onClick={handleClose}>Cancelar</Button>
                        <Button onClick={handleInativateAccount}>Inativar conta</Button>
                     </>
                  : titleDialog === 'Excluir endereço'?
                     <>
                        <Button onClick={handleClose}>Cancelar</Button>
                        <Button onClick={handleClose}>Excluir</Button>
                     </>
                  :
                     <></>
               }
            </DialogActions>
         </Dialog>
      </Grid2>
   );
};

export default MyInfosPage;