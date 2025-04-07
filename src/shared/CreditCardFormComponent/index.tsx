import {
   FormControlLabel,
   FormGroup,
   Switch,
   SwitchProps,
   TextField,
   Tooltip,
   Typography,
   styled,
   MenuItem, InputAdornment
} from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import React, {ChangeEvent, useContext, useEffect} from 'react';
import { useForm } from 'react-hook-form';
import { Info } from '@mui/icons-material';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { OrderContext } from "../../contexts/OrderContext/OrderContext.tsx";
import {CreditCardRequest} from "../../utils/types/request/CreditCard/CreditCardRequest.ts";
import {CheckoutService, InstallmentOption} from "../../services/CheckoutService.ts";
import {OrderPayment} from "../../utils/types/request/Order/OrderPayment.ts";
import {CREDIT_CARD} from "../../utils/constants/PaymentMethods.ts";
import {getCardFlag} from "../../utils/getCardFlag.ts";
import {toast} from "react-toastify";

interface CreditCardFormComponentProps {
   selectedCard?: CreditCardRequest;
}

const creditCardFormSchema = z.object({
   cardNumber: z.string()
      .min(1, 'O número do cartão deve conter 16 dígitos!')
      .transform(value => {
         return value.toString().replace(/\s/g, '');
      }),
   cardName: z.string()
       .min(1, 'Este campo é obrigatório'),
   cardCode: z.coerce.number({
      invalid_type_error: 'Este campo deve conter apenas números!'
   })
       .min(1, 'O código de segurança do cartão é obrigatório!'),
   installments: z.number()
       .min(1, 'Selecione a quantidade de parcelas')
       .max(1, 'Selecione a quantidade de parcelas')
});

type creditCardFormData = z.infer<typeof creditCardFormSchema>;

const CreditCardFormComponent: React.FC<CreditCardFormComponentProps> = ({selectedCard}) => {

   const [cardFlag, setCardFlag] = React.useState<string>('');
   const [multipleCards, setMultipleCards] = React.useState<boolean>(false);

   const orderContext = useContext(OrderContext);
   const checkoutService = new CheckoutService();
   const installmentOptions = checkoutService.getInstallmentsOptions(
       orderContext.orderTotalPrice + orderContext.shippingPrice
   );

   const {
      register,
      formState: { errors },
      setValue,
      getValues,
      watch
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

   const handleInstallmentChange = (selectedOption: InstallmentOption) => {
      const optionValue = selectedOption.label.match(/R\$\s*([\d.,]+)/);

      let creditCard: CreditCardRequest;

      if(selectedCard
         && getValues().cardNumber === selectedCard.cardNumber.toString()
         && getValues().cardName === selectedCard.cardName
      ){
         creditCard = {
            token: null,
            id: selectedCard.id,
            cardNumber: selectedCard.cardNumber,
            cardName: selectedCard.cardName,
            cardCode: selectedCard.cardCode,
            mainCard: selectedCard.mainCard,
            cardFlag: selectedCard.cardFlag,
         }
      }else{
         creditCard = {
            token: null,
            id: null,
            cardNumber: getValues().cardNumber.replace(/\D/gi, ''),
            cardName: getValues().cardName as string | undefined || '',
            cardCode: getValues().cardCode as number | undefined || 0,
            mainCard: false,
            cardFlag: getCardFlag(getValues().cardNumber.toString()),
         }
      }

      if(!optionValue || !optionValue[1]) {
         toast.error("Não foi possível obter o valor da parcela");
      }else{

         const payment: OrderPayment = {
            paymentMethod: CREDIT_CARD,
            installments: selectedOption.value,
            installmentValue: parseFloat(optionValue[1].replace(/\./g, '').replace(',', '.')),
            creditCard: creditCard,
         }

         orderContext.addOrderPayment(payment, multipleCards);
      }
   };

   const handleOrderMultipleCards = (event: ChangeEvent<HTMLInputElement>) => {
      setMultipleCards(event.target.checked);
   };

   const handleCardNumberChange = (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      const cardFlag = getCardFlag(value);
      setCardFlag(cardFlag);
   };

   useEffect(() => {
      if(selectedCard) {
         const { cardNumber, cardName, cardCode, cardFlag } = selectedCard;
         setValue('cardNumber', cardNumber.toString());
         setValue('cardName', cardName);
         setValue('cardCode', cardCode);
         setCardFlag(cardFlag);
         setValue('installments', 1);

         const defaultInstallment = checkoutService.getInstallmentsOptions(
             orderContext.orderTotalPrice + orderContext.shippingPrice
         );

         handleInstallmentChange(defaultInstallment[0]);
      }
   }, [selectedCard, setValue]);

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
                  InputLabelProps={{
                     shrink: true,
                  }}
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
                  InputLabelProps={{
                     shrink: true,
                  }}
                  InputProps={{
                     endAdornment: <InputAdornment data-cy="card-flag" position='end'>{cardFlag}</InputAdornment>
                  }}
                  {...register('cardNumber')}
                  error={!!errors.cardNumber}
                  helperText={errors?.cardNumber?.message}
                  onChange={handleCardNumberChange}
               />
            </Grid2>
            <Grid2 xs={12}>
               <TextField
                  fullWidth
                  variant='outlined'
                  label='CVC'
                  required
                  InputLabelProps={{
                     shrink: true,
                  }}
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
                   data-cy="txt-installments"
                   value={watch('installments') || 0} // Controlado pelo react-hook-form
                   required
                   InputLabelProps={{
                      shrink: true,
                   }}
                   error={!!errors.installments}
                   helperText={errors?.installments?.message}
                   onChange={(e) => {
                      const selectedValue = Number(e.target.value);
                      setValue('installments', selectedValue); // Atualiza o valor no formulário
                      const selectedOption = installmentOptions.find(
                          (opt) => opt.value === selectedValue
                      );
                      console.log(selectedOption);
                      if (selectedOption) {
                         handleInstallmentChange(selectedOption);
                      }
                   }}
               >
                  <MenuItem value={0} data-cy="installments-0" disabled>
                     Selecione a quantidade de parcelas
                  </MenuItem>
                  {
                     checkoutService.getInstallmentsOptions(
                         orderContext.orderTotalPrice + orderContext.shippingPrice
                     ).map((option, index) => (
                        <MenuItem
                          key={option.value + index}
                          value={option.value}
                          data-cy={`installments-${option.value}-${index}`}
                        >
                         {option.label}
                        </MenuItem>
                     ))
                  }
               </TextField>
            </Grid2>
            <Grid2 xs={12}>
               <FormGroup sx={{display:'flex', flexDirection:'row', alignItems:'center'}}>
                  <FormControlLabel
                     control={<IOSSwitch sx={{ m: 1 }} onChange={handleOrderMultipleCards} checked={multipleCards}/>}
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
            <Grid2 xs={12} sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                width: '100%'
            }}>
               {
                  multipleCards ?
                      <span>Adicionar cartão</span>
                      :
                      <></>
               }
            </Grid2>
         </Grid2>
      </>
   );
};

export default CreditCardFormComponent;