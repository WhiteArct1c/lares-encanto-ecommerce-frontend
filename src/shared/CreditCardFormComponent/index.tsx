import {
   FormControlLabel,
   FormGroup,
   Switch,
   SwitchProps,
   TextField,
   Tooltip,
   Typography,
   styled,
   MenuItem, InputAdornment, Box, Button, Alert, IconButton, Divider
} from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import React, {ChangeEvent, useContext, useEffect, useState, useMemo} from 'react';
import { Info, Delete, Add } from '@mui/icons-material';
import { NumericFormat } from "react-number-format";
import { OrderContext } from "../../contexts/OrderContext/OrderContext.tsx";
import {CreditCardRequest} from "../../utils/types/request/CreditCard/CreditCardRequest.ts";
import {CheckoutService, InstallmentOption} from "../../services/CheckoutService.ts";
import {OrderPayment} from "../../utils/types/request/Order/OrderPayment.ts";
import {CREDIT_CARD} from "../../utils/constants/PaymentMethods.ts";
import {getCardFlag} from "../../utils/getCardFlag.ts";
import {toast} from "react-toastify";

interface CreditCardFormComponentProps {
   selectedCard?: CreditCardRequest;
   availableCreditCards?: CreditCardRequest[];
}

interface PaymentFormData {
   id: string; // ID único para o formulário
   selectedCard?: CreditCardRequest;
   cardNumber: string;
   cardName: string;
   cardCode: string;
   installments: number;
   installmentValue: number;
   totalValue?: number; // Valor total para múltiplos cartões (opcional)
   cardFlag: string;
}

const CreditCardFormComponent: React.FC<CreditCardFormComponentProps> = ({selectedCard, availableCreditCards = []}) => {

   const [useMultipleCards, setUseMultipleCards] = useState<boolean>(false);
   const [paymentForms, setPaymentForms] = useState<PaymentFormData[]>([{
      id: `payment-${Date.now()}`,
      cardNumber: '',
      cardName: '',
      cardCode: '',
      installments: 0,
      installmentValue: 0,
      cardFlag: ''
   }]);

   const orderContext = useContext(OrderContext);
   const checkoutService = new CheckoutService();
   const couponsDiscount = orderContext.orderCoupons?.reduce((sum, coupon) => sum + coupon.amountToUse, 0) || 0;
   const totalOrderPrice = Math.max(0, orderContext.orderTotalPrice + orderContext.shippingPrice - couponsDiscount);

   // Calcular total dos pagamentos
   const totalPayments = useMemo(() => {
      return paymentForms.reduce((sum, form) => {
         if (useMultipleCards && form.totalValue !== undefined && form.totalValue > 0) {
            // Se usar múltiplos cartões e tiver valor total definido, usar esse valor
            return sum + form.totalValue;
         } else if (form.installments > 0 && form.installmentValue > 0) {
            // Caso contrário, calcular baseado em parcelas
            return sum + (form.installmentValue * form.installments);
         }
         return sum;
      }, 0);
   }, [paymentForms, useMultipleCards]);

   // Calcular diferença
   const paymentDifference = useMemo(() => {
      return totalOrderPrice - totalPayments;
   }, [totalOrderPrice, totalPayments]);

   // Validações
   const validationErrors = useMemo(() => {
      const errors: string[] = [];

      // Validar pelo menos um pagamento
      if (paymentForms.length === 0) {
         errors.push("Adicione pelo menos um cartão");
      }

      // Validar soma dos pagamentos
      if (Math.abs(paymentDifference) > 0.01) {
         errors.push(
            `A soma dos pagamentos (R$ ${totalPayments.toFixed(2)}) não confere com o total do pedido (R$ ${totalOrderPrice.toFixed(2)})`
         );
      }

      // Validar valor mínimo por cartão (RN0035: permite < R$ 10,00 quando há cupons)
      const hasCoupons = (orderContext.orderCoupons?.length || 0) > 0;
      paymentForms.forEach((form, index) => {
         if (form.installments > 0 && form.installmentValue > 0) {
            const paymentTotal = form.installmentValue * form.installments;
            if (!hasCoupons && paymentTotal < 10.00) {
               errors.push(
                  `Cartão ${index + 1}: O valor mínimo é R$ 10,00. Valor informado: R$ ${paymentTotal.toFixed(2)}`
               );
            }
         }
      });

      // Validar cartões duplicados
      const selectedCardNumbers = paymentForms
         .filter(form => form.cardNumber)
         .map(form => form.cardNumber.replace(/\D/g, ''));
      const uniqueCardNumbers = new Set(selectedCardNumbers);
      if (selectedCardNumbers.length !== uniqueCardNumbers.size) {
         errors.push("Não é possível usar o mesmo cartão mais de uma vez");
      }

      return errors;
   }, [paymentForms, totalPayments, totalOrderPrice, paymentDifference]);

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

   // Sincronizar com OrderContext quando mudar
   useEffect(() => {
      if (!useMultipleCards && paymentForms.length > 0) {
         const firstForm = paymentForms[0];
         if (firstForm.installments > 0 && firstForm.installmentValue > 0 && firstForm.cardNumber) {
            createPaymentFromForm(firstForm, false);
         }
      }
   }, [paymentForms, useMultipleCards]);

   const createPaymentFromForm = (form: PaymentFormData, isMultiple: boolean) => {
      let creditCard: CreditCardRequest;

      if (form.selectedCard && form.cardNumber === form.selectedCard.cardNumber.toString()) {
         creditCard = {
            token: null,
            id: form.selectedCard.id,
            cardNumber: form.selectedCard.cardNumber,
            cardName: form.selectedCard.cardName,
            cardCode: form.selectedCard.cardCode,
            mainCard: form.selectedCard.mainCard,
            cardFlag: form.selectedCard.cardFlag,
         };
      } else {
         creditCard = {
            token: null,
            id: null,
            cardNumber: form.cardNumber.replace(/\D/gi, ''),
            cardName: form.cardName,
            cardCode: parseInt(form.cardCode) || 0,
            mainCard: false,
            cardFlag: form.cardFlag || getCardFlag(form.cardNumber),
         };
      }

      const payment: OrderPayment = {
         paymentMethod: CREDIT_CARD,
         installments: form.installments,
         installmentValue: form.installmentValue,
         creditCard: creditCard,
      };

      orderContext.addOrderPayment(payment, isMultiple);
   };

   const handleToggleMultiple = (enabled: boolean) => {
      setUseMultipleCards(enabled);
      if (!enabled) {
         // Volta para um único formulário
         setPaymentForms([paymentForms[0] || {
            id: `payment-${Date.now()}`,
            cardNumber: '',
            cardName: '',
            cardCode: '',
            installments: 0,
            installmentValue: 0,
            cardFlag: ''
         }]);
         // Limpa os pagamentos e adiciona apenas o primeiro
         if (paymentForms.length > 0 && paymentForms[0].installments > 0) {
            orderContext.addOrderPayment({
               paymentMethod: CREDIT_CARD,
               installments: paymentForms[0].installments,
               installmentValue: paymentForms[0].installmentValue,
               creditCard: {
                  token: null,
                  id: null,
                  cardNumber: paymentForms[0].cardNumber.replace(/\D/gi, ''),
                  cardName: paymentForms[0].cardName,
                  cardCode: parseInt(paymentForms[0].cardCode) || 0,
                  mainCard: false,
                  cardFlag: paymentForms[0].cardFlag,
               },
            }, false);
         }
      }
   };

   const addPaymentForm = () => {
      if (paymentForms.length >= 2) {
         toast.error("É permitido usar no máximo 2 cartões de crédito");
         return;
      }
      setPaymentForms([...paymentForms, {
         id: `payment-${Date.now()}-${Math.random()}`,
         cardNumber: '',
         cardName: '',
         cardCode: '',
         installments: 0,
         installmentValue: 0,
         cardFlag: ''
      }]);
   };

   const removePaymentForm = (id: string) => {
      if (paymentForms.length <= 1) {
         toast.error("É necessário pelo menos um cartão");
         return;
      }
      const updated = paymentForms.filter(form => form.id !== id);
      setPaymentForms(updated);
      
      // Atualizar OrderContext removendo o pagamento correspondente
      if (updated.length === 1 && !useMultipleCards) {
         // Se voltou para um cartão, atualizar o contexto
         if (updated[0].installments > 0) {
            createPaymentFromForm(updated[0], false);
         }
      }
   };

   const updatePaymentForm = (id: string, updates: Partial<PaymentFormData>) => {
      setPaymentForms(prevForms => prevForms.map(form => 
         form.id === id ? { ...form, ...updates } : form
      ));
   };

   // Preencher formulário quando um cartão é selecionado
   useEffect(() => {
      if (selectedCard && paymentForms.length > 0 && !paymentForms[0].cardNumber) {
         const firstForm = paymentForms[0];
         updatePaymentForm(firstForm.id, {
            selectedCard: selectedCard,
            cardNumber: selectedCard.cardNumber.toString(),
            cardName: selectedCard.cardName,
            cardCode: selectedCard.cardCode.toString(),
            cardFlag: selectedCard.cardFlag,
            installments: 1,
         });

         // Calcular valor da parcela para o total
         const options = checkoutService.getInstallmentsOptions(totalOrderPrice);
         if (options.length > 0) {
            const option = options[0];
            const optionValue = option.label.match(/R\$\s*([\d.,]+)/);
            if (optionValue && optionValue[1]) {
               const installmentValue = parseFloat(optionValue[1].replace(/\./g, '').replace(',', '.'));
               updatePaymentForm(firstForm.id, {
                  installments: option.value,
                  installmentValue: installmentValue,
               });
            }
         }
      }
   }, [selectedCard]);

   return (
      <>
         <Typography fontFamily={'Public Sans'} fontSize={20} sx={{mb:2}}>Detalhes do pagamento</Typography>
         
         {/* Switcher para múltiplos cartões */}
         <Grid2 xs={12} sx={{mb: 3}}>
            <FormGroup sx={{display:'flex', flexDirection:'row', alignItems:'center'}}>
               <FormControlLabel
                  control={
                     <IOSSwitch 
                        sx={{ m: 1 }} 
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleToggleMultiple(e.target.checked)} 
                        checked={useMultipleCards}
                     />
                  }
                  label="Usar múltiplos cartões"
               />
               <Tooltip 
                  title={'Essa funcionalidade permite que você divida o pagamento entre 2 cartões de crédito'}
               >
                  <Info/>
               </Tooltip>
            </FormGroup>
         </Grid2>

         {/* Formulários de pagamento */}
         {paymentForms.map((form, index) => (
            <PaymentFormCard
               key={form.id}
               form={form}
               index={index}
               totalOrderPrice={totalOrderPrice}
               checkoutService={checkoutService}
               availableCreditCards={availableCreditCards}
               usedCardNumbers={paymentForms
                  .filter((f, i) => i !== index && f.cardNumber)
                  .map(f => f.cardNumber.replace(/\D/g, ''))
               }
               onUpdate={(updates) => updatePaymentForm(form.id, updates)}
               onRemove={useMultipleCards && paymentForms.length > 1 ? () => removePaymentForm(form.id) : undefined}
               orderContext={orderContext}
               useMultipleCards={useMultipleCards}
            />
         ))}

         {/* Botão para adicionar outro cartão */}
         {useMultipleCards && paymentForms.length < 2 && (
            <Grid2 xs={12} sx={{mt: 2, mb: 2}}>
               <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={addPaymentForm}
                  sx={{
                     borderColor: '#000',
                     color: '#000',
                     '&:hover': {
                        borderColor: '#000',
                        bgcolor: '#f5f5f5'
                     }
                  }}
               >
                  Adicionar outro cartão
               </Button>
            </Grid2>
         )}

         {/* Resumo de pagamentos - apenas quando múltiplos cartões estiverem ativos */}
         {useMultipleCards && (
            <>
               <Grid2 xs={12} sx={{mt: 3, mb: 2}}>
                  <Divider sx={{mb: 2}} />
                  <Box sx={{
                     p: 2,
                     border: '1px solid #e0e0e0',
                     borderRadius: 1,
                     bgcolor: '#f9f9f9'
                  }}>
                     <Typography fontFamily={'Public Sans'} fontWeight={600} fontSize={16} sx={{mb: 1}}>
                        Resumo de Pagamentos
                     </Typography>
                     <Box sx={{display: 'flex', flexDirection: 'column', gap: 1}}>
                        <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                           <Typography fontFamily={'Public Sans'}>
                              Total dos pagamentos:
                           </Typography>
                           <Typography fontFamily={'Public Sans'} fontWeight={600}>
                              R$ {totalPayments.toFixed(2)}
                           </Typography>
                        </Box>
                        <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                           <Typography fontFamily={'Public Sans'}>
                              Total do pedido:
                           </Typography>
                           <Typography fontFamily={'Public Sans'} fontWeight={600}>
                              R$ {totalOrderPrice.toFixed(2)}
                           </Typography>
                        </Box>
                        {Math.abs(paymentDifference) > 0.01 && (
                           <Alert 
                              severity={paymentDifference > 0 ? "warning" : "error"}
                              sx={{mt: 1}}
                           >
                              {paymentDifference > 0
                                 ? `Faltam R$ ${paymentDifference.toFixed(2)} para completar o pagamento`
                                 : `O valor excede em R$ ${Math.abs(paymentDifference).toFixed(2)}`
                              }
                           </Alert>
                        )}
                     </Box>
                  </Box>
               </Grid2>

               {/* Mensagens de erro de validação */}
               {validationErrors.length > 0 && (
                  <Grid2 xs={12} sx={{mt: 2}}>
                     {validationErrors.map((error, index) => (
                        <Alert key={index} severity="error" sx={{mb: 1}}>
                           {error}
                        </Alert>
                     ))}
                  </Grid2>
               )}
            </>
         )}
      </>
   );
};

// Componente de formulário de pagamento individual
interface PaymentFormCardProps {
   form: PaymentFormData;
   index: number;
   totalOrderPrice: number;
   checkoutService: CheckoutService;
   availableCreditCards: CreditCardRequest[];
   usedCardNumbers: string[];
   onUpdate: (updates: Partial<PaymentFormData>) => void;
   onRemove?: () => void;
   orderContext: any;
   useMultipleCards: boolean;
}

const PaymentFormCard: React.FC<PaymentFormCardProps> = ({
   form,
   index,
   totalOrderPrice,
   checkoutService,
   availableCreditCards,
   usedCardNumbers,
   onUpdate,
   onRemove,
   orderContext,
   useMultipleCards
}) => {
   const [localCardFlag, setLocalCardFlag] = useState<string>(form.cardFlag);

   // Calcular valor disponível para este cartão
   const remainingAmount = useMemo(() => {
      // Implementar lógica de cálculo do valor restante se necessário
      return totalOrderPrice;
   }, [totalOrderPrice]);

   // Obter opções de parcelas para o valor disponível
   const installmentOptions = useMemo(() => {
      return checkoutService.getInstallmentsOptions(remainingAmount);
   }, [checkoutService, remainingAmount]);

   const handleCardSelection = (card: CreditCardRequest) => {
      onUpdate({
         selectedCard: card,
         cardNumber: card.cardNumber.toString(),
         cardName: card.cardName,
         cardCode: card.cardCode.toString(),
         cardFlag: card.cardFlag,
      });
   };

   const handleCardNumberChange = (value: string) => {
      const cardFlag = getCardFlag(value);
      setLocalCardFlag(cardFlag);
      onUpdate({
         cardNumber: value,
         cardFlag: cardFlag,
      });
   };

   // Função auxiliar para atualizar OrderContext
   const updateOrderContextPayment = (currentForm: PaymentFormData, installments: number, installmentValue: number) => {
      if (currentForm.cardNumber && currentForm.cardName) {
         let creditCard: CreditCardRequest;
         if (currentForm.selectedCard && currentForm.cardNumber === currentForm.selectedCard.cardNumber.toString()) {
            creditCard = {
               token: null,
               id: currentForm.selectedCard.id,
               cardNumber: currentForm.selectedCard.cardNumber,
               cardName: currentForm.selectedCard.cardName,
               cardCode: currentForm.selectedCard.cardCode,
               mainCard: currentForm.selectedCard.mainCard,
               cardFlag: currentForm.selectedCard.cardFlag,
            };
         } else {
            creditCard = {
               token: null,
               id: null,
               cardNumber: currentForm.cardNumber.replace(/\D/gi, ''),
               cardName: currentForm.cardName,
               cardCode: parseInt(currentForm.cardCode) || 0,
               mainCard: false,
               cardFlag: currentForm.cardFlag || getCardFlag(currentForm.cardNumber),
            };
         }

         const payment: OrderPayment = {
            paymentMethod: CREDIT_CARD,
            installments: installments,
            installmentValue: installmentValue,
            creditCard: creditCard,
         };

         orderContext.addOrderPayment(payment, useMultipleCards);
      }
   };

   const handleInstallmentChange = (selectedOption: InstallmentOption) => {
      const optionValue = selectedOption.label.match(/R\$\s*([\d.,]+)/);
      if (optionValue && optionValue[1]) {
         const installmentValue = parseFloat(optionValue[1].replace(/\./g, '').replace(',', '.'));
         onUpdate({
            installments: selectedOption.value,
            installmentValue: installmentValue,
         });

         // Atualizar OrderContext
         updateOrderContextPayment(form, selectedOption.value, installmentValue);
      }
   };

   const paymentTotal = useMultipleCards && form.totalValue !== undefined && form.totalValue > 0
      ? form.totalValue
      : form.installments > 0 && form.installmentValue > 0
         ? form.installmentValue * form.installments
         : 0;

   // Filtrar cartões disponíveis (não usar os já selecionados)
   const availableCards = availableCreditCards.filter(card => {
      const cardNumber = card.cardNumber.toString().replace(/\D/g, '');
      return !usedCardNumbers.includes(cardNumber);
   });

   return (
      <Grid2 
         xs={12} 
         sx={{
            mb: 3,
            p: 2,
            border: '1px solid #e0e0e0',
            borderRadius: 1,
            position: 'relative'
         }}
      >
         {/* Cabeçalho do formulário */}
         <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2}}>
            <Typography fontFamily={'Public Sans'} fontWeight={600} fontSize={18}>
               Cartão {index + 1}
            </Typography>
            {onRemove && (
               <IconButton
                  onClick={onRemove}
                  sx={{
                     color: 'error.main',
                     '&:hover': {
                        bgcolor: 'error.light',
                        color: 'error.dark'
                     }
                  }}
               >
                  <Delete />
               </IconButton>
            )}
         </Box>

         <Grid2 container spacing={2}>
            {/* Seleção de cartão salvo (se houver) */}
            {availableCards.length > 0 && (
               <Grid2 xs={12}>
                  <TextField
                     fullWidth
                     select
                     variant="outlined"
                     label="Selecione um cartão salvo"
                     value={form.selectedCard?.id?.toString() || ''}
                     onChange={(e) => {
                        const card = availableCreditCards.find(c => c.id?.toString() === e.target.value);
                        if (card) {
                           handleCardSelection(card);
                        }
                     }}
                     InputLabelProps={{ shrink: true }}
                  >
                     <MenuItem value="">Digite manualmente</MenuItem>
                     {availableCards.map((card) => (
                        <MenuItem key={card.id} value={card.id?.toString() || ''}>
                           {card.cardFlag} •••• {card.cardNumber.toString().slice(-4)}
                        </MenuItem>
                     ))}
                  </TextField>
               </Grid2>
            )}

            {/* Nome no cartão */}
            <Grid2 xs={12}>
               <TextField
                  fullWidth
                  variant='outlined'
                  label='Nome impresso no cartão'
                  required
                  value={form.cardName}
                  onChange={(e) => onUpdate({ cardName: e.target.value })}
                  InputLabelProps={{ shrink: true }}
               />
            </Grid2>

            {/* Número do cartão */}
            <Grid2 xs={12}>
               <TextField
                  fullWidth
                  variant='outlined'
                  label='Número do cartão de crédito'
                  required
                  value={form.cardNumber}
                  onChange={(e) => handleCardNumberChange(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                     endAdornment: <InputAdornment position='end'>{localCardFlag || form.cardFlag}</InputAdornment>
                  }}
               />
            </Grid2>

            {/* CVC */}
            <Grid2 xs={12} md={6}>
               <TextField
                  fullWidth
                  variant='outlined'
                  label='CVC'
                  required
                  value={form.cardCode}
                  onChange={(e) => onUpdate({ cardCode: e.target.value })}
                  InputLabelProps={{ shrink: true }}
               />
            </Grid2>

            {/* Campo de valor total quando múltiplos cartões */}
            {useMultipleCards ? (
               <>
                  <Grid2 xs={12} md={6}>
                     <NumericFormat
                        thousandSeparator={"."}
                        decimalSeparator={","}
                        decimalScale={2}
                        valueIsNumericString
                        prefix="R$ "
                        label="Valor a pagar com este cartão"
                        required
                        customInput={TextField}
                        value={form.totalValue || ''}
                        onValueChange={(values) => {
                           const totalValue = values.floatValue || 0;
                           
                           // Se já tem parcelas selecionadas, recalcular o valor da parcela
                           if (form.installments > 0 && totalValue > 0) {
                              const installmentValue = totalValue / form.installments;
                              
                              // Atualizar form
                              onUpdate({ 
                                 totalValue: totalValue,
                                 installmentValue: installmentValue
                              });
                              
                              // Atualizar OrderContext com os valores atualizados
                              const updatedForm = { ...form, totalValue, installmentValue };
                              if (updatedForm.cardNumber && updatedForm.cardName) {
                                 updateOrderContextPayment(updatedForm, form.installments, installmentValue);
                              }
                           } else {
                              onUpdate({ totalValue: totalValue });
                           }
                        }}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        variant="outlined"
                     />
                  </Grid2>
                  <Grid2 xs={12} md={6}>
                     <TextField
                        fullWidth
                        select
                        variant='outlined'
                        label='Parcelas'
                        value={form.installments || 0}
                        required
                        InputLabelProps={{ shrink: true }}
                        onChange={(e) => {
                           const selectedValue = Number(e.target.value);
                           
                           // Recalcular valor da parcela baseado no valor total
                           if (form.totalValue && form.totalValue > 0 && selectedValue > 0) {
                              const installmentValue = form.totalValue / selectedValue;
                              
                              // Atualizar form
                              onUpdate({ 
                                 installments: selectedValue,
                                 installmentValue: installmentValue
                              });
                              
                              // Atualizar OrderContext com os valores atualizados
                              const updatedForm = { ...form, installments: selectedValue, installmentValue };
                              if (updatedForm.cardNumber && updatedForm.cardName) {
                                 updateOrderContextPayment(updatedForm, selectedValue, installmentValue);
                              }
                           } else {
                              onUpdate({ installments: selectedValue });
                           }
                        }}
                     >
                        <MenuItem value={0} disabled>
                           Selecione a quantidade de parcelas
                        </MenuItem>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                           <MenuItem key={num} value={num}>
                              {num}x {form.totalValue && form.totalValue > 0 
                                 ? `de ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(form.totalValue / num)}`
                                 : ''
                              }
                           </MenuItem>
                        ))}
                     </TextField>
                  </Grid2>
               </>
            ) : (
               /* Parcelas para um único cartão */
               <Grid2 xs={12} md={6}>
                  <TextField
                     fullWidth
                     select
                     variant='outlined'
                     label='Parcelas'
                     value={form.installments || 0}
                     required
                     InputLabelProps={{ shrink: true }}
                     onChange={(e) => {
                        const selectedValue = Number(e.target.value);
                        const selectedOption = installmentOptions.find(opt => opt.value === selectedValue);
                        if (selectedOption) {
                           handleInstallmentChange(selectedOption);
                        }
                     }}
                  >
                     <MenuItem value={0} disabled>
                        Selecione a quantidade de parcelas
                     </MenuItem>
                     {installmentOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                           {option.label}
                        </MenuItem>
                     ))}
                  </TextField>
               </Grid2>
            )}

            {/* Total do pagamento deste cartão */}
            {((useMultipleCards && form.totalValue && form.totalValue > 0) || 
              (!useMultipleCards && form.installments > 0 && form.installmentValue > 0)) && (
               <Grid2 xs={12}>
                  <Box sx={{
                     p: 1,
                     bgcolor: '#f0f0f0',
                     borderRadius: 1,
                     textAlign: 'right'
                  }}>
                     <Typography fontFamily={'Public Sans'} fontWeight={600}>
                        Total deste cartão: R$ {paymentTotal.toFixed(2)}
                        {useMultipleCards && form.installments > 0 && (
                           <Typography component="span" fontFamily={'Public Sans'} fontSize={14} sx={{ml: 1, color: '#666'}}>
                              ({form.installments}x de {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(form.installmentValue)})
                           </Typography>
                        )}
                     </Typography>
                  </Box>
               </Grid2>
            )}
         </Grid2>
      </Grid2>
   );
};

export default CreditCardFormComponent;
