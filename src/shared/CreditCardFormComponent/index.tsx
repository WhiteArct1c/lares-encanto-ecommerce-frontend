import { FormControlLabel, FormGroup, FormHelperText, MenuItem, Switch, SwitchProps, TextField, Tooltip, Typography, styled } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import React from 'react';
import { useForm } from 'react-hook-form';
import { months } from '../../utils/months';
import { next20Years } from '../../utils/next20years';
import { Info } from '@mui/icons-material';

interface CreditCardFormComponentProps {
   
}

const CreditCardFormComponent: React.FC<CreditCardFormComponentProps> = () => {

   const {
      register,
      formState: { errors }
   } = useForm();

   const IOSSwitch = styled((props: SwitchProps) => (
      <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
   ))(({ theme }) => ({
      width: 42,
      height: 26,
      padding: 0,
      '& .MuiSwitch-switchBase': {
         padding: 0,
         margin: 2,
         transitionDuration: '300ms',
         '&.Mui-checked': {
            transform: 'translateX(16px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
               backgroundColor: theme.palette.mode === 'dark' ? '#000' : '#000',
               opacity: 1,
               border: 0,
            },
            '&.Mui-disabled + .MuiSwitch-track': {
               opacity: 0.5,
            },
         },
         '&.Mui-focusVisible .MuiSwitch-thumb': {
            color: '#000   ',
            border: '6px solid #fff',
         },
         '&.Mui-disabled .MuiSwitch-thumb': {
            color:
               theme.palette.mode === 'light'
                  ? theme.palette.grey[600]
                  : theme.palette.grey[600],
         },
         '&.Mui-disabled + .MuiSwitch-track': {
            opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
         },
      },
      '& .MuiSwitch-thumb': {
         boxSizing: 'border-box',
         width: 22,
         height: 22,
      },
      '& .MuiSwitch-track': {
         borderRadius: 26 / 2,
         backgroundColor: theme.palette.mode === 'light' ? '#C2C2C2' : '#C2C2C2',
         opacity: 1,
         transition: theme.transitions.create(['background-color'], {
            duration: 500,
         }),
      },
   }));

   return (
      <>
         <Typography fontFamily={'Public Sans'} fontSize={20} sx={{mb:2}}>Detalhes do pagamento</Typography>
         <Grid2 container spacing={2}>
            <Grid2 xs={12}>
               <TextField
                  fullWidth
                  variant='outlined'
                  label='Nome impresso no cartão'
                  required
                  {...register("creditCardName", {required: true})}
                  error={errors?.creditCardName?.type === 'required' ? true : false}
                  helperText={errors?.creditCardName?.type === 'required' ? "O nome impresso no cartão é obrigatório" : ""}
               />
            </Grid2>
            <Grid2 xs={12}>
               <TextField
                  fullWidth
                  variant='outlined'
                  label='Número do cartão de crédito'
                  required
                  {...register("creditCardNumber", {required: true})}
                  error={errors?.creditCardNumber?.type === 'required' ? true : false}
                  helperText={errors?.creditCardNumber?.type === 'required' ? "O número do cartão é obrigatório" : ""}
               />
            </Grid2>
            <Grid2 xs={4}>
               <TextField
                  fullWidth
                  select
                  label='Mês'
                  defaultValue={months[0]}
                  required
                  {...register("creditCardMonthExpiration", {required: true})}
               >
                  {months.map((tipo, index) => (
                     <MenuItem key={index} value={tipo}>{tipo}</MenuItem>
                  ))}
               </TextField>
               {errors?.creditCardMonthExpiration?.type === 'required' && <FormHelperText>O mês de vencimento do cartão é obrigatório.</FormHelperText>}
            </Grid2>
            <Grid2 xs={4}>
               <TextField
                  fullWidth
                  select
                  label='Ano'
                  defaultValue={next20Years[0]}
                  required
                  {...register("creditCardYearExpiration", {required: true})}
               >
                  {next20Years.map((tipo, index) => (
                     <MenuItem key={index} value={tipo}>{tipo}</MenuItem>
                  ))}
               </TextField>
               {errors?.creditCardYearExpiration?.type === 'required' && <FormHelperText>O ano de vencimento do cartão é obrigatório.</FormHelperText>}
            </Grid2>
            <Grid2 xs={4}>
               <TextField
                  fullWidth
                  variant='outlined'
                  label='CVC'
                  required
                  {...register("creditCardCode", {required: true})}
                  error={errors?.creditCardCode?.type === 'required' ? true : false}
                  helperText={errors?.creditCardCode?.type === 'required' ? "O código do cartão é obrigatório" : ""}
               />
            </Grid2>
            <Grid2 xs={12}>
               <FormGroup sx={{display:'flex', flexDirection:'row', alignItems:'center'}}>
                  <FormControlLabel
                     control={<IOSSwitch sx={{ m: 1 }}/>}
                     label="Múltiplos cartões"
                  />
                  <Tooltip 
                     title={'Essa funcionalidade permite que você insira mais de 1 cartão de crédito para realizar o pagamento'}
                  >
                     <Info/>
                  </Tooltip>
               </FormGroup>
               <FormGroup sx={{display:'flex', flexDirection:'row', alignItems:'center'}}>
                  <FormControlLabel
                     control={<IOSSwitch sx={{ m: 1 }}/>}
                     label="Salvar cartões para as próximas compras"
                  />
               </FormGroup>
            </Grid2>
         </Grid2>
      </>
   );
};

export default CreditCardFormComponent;