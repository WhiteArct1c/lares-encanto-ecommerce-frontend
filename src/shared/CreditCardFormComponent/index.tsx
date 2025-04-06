import {
   FormControlLabel,
   FormGroup,
   Switch,
   SwitchProps,
   TextField,
   Tooltip,
   Typography,
   styled,
   MenuItem
} from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import React, {useContext} from 'react';
import { useForm } from 'react-hook-form';
import { Info } from '@mui/icons-material';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { OrderContext } from "../../contexts/OrderContext/OrderContext.tsx";

interface CreditCardFormComponentProps {
   
}

const creditCardFormSchema = z.object({
   cardNumber: z.coerce.number({
      invalid_type_error: 'Este campo deve conter apenas números!'
   })
       .min(1, 'O número do cartão deve conter 16 dígitos!'),
   cardName: z.string()
       .min(1, 'Este campo é obrigatório'),
   cardCode: z.coerce.number({
      invalid_type_error: 'Este campo deve conter apenas números!'
   })
       .min(1, 'O código de segurança do cartão é obrigatório!'),
   installments: z.string()
       .min(1, 'Selecione a quantidade de parcelas')
       .max(1, 'Selecione a quantidade de parcelas')
       .refine(value => {
          return parseInt(value) > 0;
       }, {
          message: 'Selecione a quantidade de parcelas'
       })
});

type creditCardFormData = z.infer<typeof creditCardFormSchema>;

const CreditCardFormComponent: React.FC<CreditCardFormComponentProps> = () => {

   const orderContext = useContext(OrderContext);

   const {
      register,
      formState: { errors }
   } = useForm<creditCardFormData>({
      resolver: zodResolver(creditCardFormSchema)
   });

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
         <Grid2 container component={'form'} spacing={2}>
            <Grid2 xs={12}>
               <TextField
                  fullWidth
                  variant='outlined'
                  label='Nome impresso no cartão'
                  data-cy="txt-card-name"
                  required
                  {...register('cardName')}
                  error={!!errors.cardName}
                  helperText={errors?.cardName?.message}
               />
            </Grid2>
            <Grid2 xs={12}>
               <TextField
                  fullWidth
                  variant='outlined'
                  label='Número do cartão de crédito'
                  data-cy="txt-card-number"
                  required
                  {...register('cardNumber')}
                  error={!!errors.cardNumber}
                  helperText={errors?.cardNumber?.message}
               />
            </Grid2>
            <Grid2 xs={12}>
               <TextField
                  fullWidth
                  variant='outlined'
                  label='CVC'
                  required
                  {...register('cardCode')}
                  error={!!errors.cardCode}
                  helperText={errors?.cardCode?.message}
               />
            </Grid2>
            <Grid2 xs={12}>
               <TextField
                   fullWidth
                   select
                   variant='outlined'
                   label='Parcelas'
                   required
                   {...register('installments')}
                   error={!!errors.installments}
                   helperText={errors?.installments?.message}
               >
                  <MenuItem>{orderContext?.order?.totalPrice}</MenuItem>
               </TextField>
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