import { Box, Button, CircularProgress, Step, StepButton, Stepper, Typography } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import React, {useContext, useState, useEffect} from 'react';
import OrderResumeComponent from '../../shared/OrderResumeComponent';
import AddressFormComponent from '../../shared/AddressFormComponent';
import ShippingOptionsComponent from '../../shared/ShippingOptionsComponent';
import PaymentMethodsOrderComponent from '../../shared/PaymentMethodsOrderComponent';
import { ShoppingCartContext } from '../../contexts/ShoppingCartContext';
import CheckoutCustomerAddresses from "./components/checkout-customer-addresses.tsx";
import { OrderContext } from "../../contexts/OrderContext/OrderContext.tsx";
import { CREATED } from "../../utils/constants/apiCodes.ts";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";

interface CheckoutPageProps {

}

const CheckoutPage: React.FC<CheckoutPageProps> = () => {

   const steps = ['Endereço', 'Frete', 'Pagamento'];

   const [activeStep, setActiveStep] = React.useState(0);
   const [completed, setCompleted] = useState<{
      [k: number]: boolean;
   }>({});
   const [isCreatingOrder, setIsCreatingOrder] = useState(false);

   const order = useContext(OrderContext);
   const cart = useContext(ShoppingCartContext);
   const navigate = useNavigate();

   useEffect(() => {
      if(cart?.cartProducts && cart.cartProducts.length > 0) {
         order?.setOrderProducts(cart.cartProducts);
         
         const totalPrice = cart.cartProducts.reduce((sum, item) => {
            return sum + (item.product.salePrice * item.quantity);
         }, 0);
         order?.updateOrderTotalPrice(totalPrice);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [cart?.cartProducts]);

   const totalSteps = () => {
      return steps.length;
   };

   const completedSteps = () => {
      return Object.keys(completed).length;
   };

   const isLastStep = () => {
      return activeStep === totalSteps() - 1;
   };

   const allStepsCompleted = () => {
      return completedSteps() === totalSteps();
   };

   const handleNext = () => {
      const newActiveStep =
         isLastStep() && !allStepsCompleted()
            ?
            steps.findIndex((_step, i) => !(i in completed))
            :
            activeStep + 1;
      setActiveStep(newActiveStep);
   };

   const handleBack = () => {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
   };

   const handleStep = (step: number) => () => {
      setActiveStep(step);
   };

   const handleComplete = () => {
      const newCompleted = completed;
      newCompleted[activeStep] = true;
      setCompleted(newCompleted);
      handleNext();
   };

   const handlePaymentOptions = () => {
      handleComplete();
   };

   const handleAddressShipment = () => {
      handleComplete();
   }

   const handleCompleteOrder = async () => {
      setIsCreatingOrder(true);
      try {
         if(!cart?.cartProducts || cart.cartProducts.length === 0) {
            toast.error('Carrinho vazio. Adicione produtos antes de finalizar o pedido.');
            setIsCreatingOrder(false);
            return;
         }

         const productsFromCart = [...cart.cartProducts];
         const response = await order.createOrder(productsFromCart);

         if(response && response.code === CREATED){
            toast.success('Pedido criado com sucesso!');
            order.resetOrder();
            cart?.resetCart();
            navigate('/order-finished', {
               state: {
                  orderId: response.data[0].id,
                  orderStatus: response.data[0].status,
               }
            });
         }else{
            toast.error(response?.message || 'Erro ao finalizar o pedido');
         }
      } catch (error: unknown) {
         const axiosError = error as { response?: { status?: number; data?: { message?: string } } };
         if(axiosError?.response?.status === 400){
            const errorMessage = axiosError?.response?.data?.message || 'Erro ao finalizar o pedido';
            toast.error(errorMessage);

            if(errorMessage.includes('Quantidade solicitada') || errorMessage.includes('estoque')){
               toast.warning('O estoque foi atualizado. Por favor, verifique os produtos no carrinho.');
            }
         } else {
            toast.error('Erro ao finalizar o pedido. Tente novamente.');
         }
      } finally {
         setIsCreatingOrder(false);
      }
   }


   return (
      <Grid2
         container
         xs={12}
         sx={{ mt: 17, mb: 17, width: '100%'}}
      >
         <Grid2 xs={12}>
            <Typography
               fontFamily={'Public Sans'}
               fontSize={'2.5rem'}
               fontWeight={600}
               color={'#000'}
               sx={{
                  ml: 10
               }}
            >
               Checkout
            </Typography>
         </Grid2>
         <Grid2 container xs={12} sx={{ p: 7,  }}>
            <Grid2 xs={7}>
               <Box sx={{ width: '100%' }}>
                  <Stepper nonLinear activeStep={activeStep}>
                     {steps.map((label, index) => (
                        <Step key={label} completed={completed[index]}>
                           <StepButton onClick={handleStep(index)}>
                              <Typography
                                 fontFamily={'Public Sans'}
                                 fontSize={'1rem'}
                                 fontWeight={500}
                                 color={'#000'}
                              >
                                 {label}
                              </Typography>
                           </StepButton>
                        </Step>
                     ))}
                  </Stepper>
                  <>
                     {
                        activeStep === 0 ?
                           <>
                              <CheckoutCustomerAddresses />
                              <AddressFormComponent />
                              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                                 <Button
                                    color="inherit"
                                    disabled={activeStep === 0}
                                    onClick={handleBack}
                                    sx={{
                                       width: 220,
                                       color: '#fff',
                                       fontWeight: 600,
                                       bgcolor: '#000',
                                       '&:hover': {
                                          bgcolor: '#fff',
                                          color: '#000'
                                       },
                                       '&:disabled': {
                                          color: '#000',
                                          bgcolor: '#999',
                                       }
                                    }}
                                 >
                                    Voltar
                                 </Button>
                                 <Box sx={{ flex: '1 1 auto' }} />
                                 <Button
                                     data-cy="btn-next-step-shipping"
                                    color="inherit"
                                    onClick={handleAddressShipment}
                                    sx={{
                                       width: 220,
                                       color: '#fff',
                                       fontWeight: 600,
                                       bgcolor: '#000',
                                       '&:hover': {
                                          bgcolor: '#fff',
                                          color: '#000'
                                       },
                                       '&:disabled': {
                                          color: '#000',
                                          bgcolor: '#999',
                                       }
                                    }}
                                 >
                                    Próximo
                                 </Button>
                              </Box>
                           </>
                           : activeStep === 1 ?
                              <>
                                 <ShippingOptionsComponent />
                                 <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                                    <Button
                                       color="inherit"
                                       onClick={handleBack}
                                       sx={{
                                          width: 220,
                                          color: '#fff',
                                          fontWeight: 600,
                                          bgcolor: '#000',
                                          '&:hover': {
                                             bgcolor: '#fff',
                                             color: '#000'
                                          },
                                          '&:disabled': {
                                             color: '#000',
                                             bgcolor: '#999',
                                          }
                                       }}
                                    >
                                       Voltar
                                    </Button>
                                    <Box sx={{ flex: '1 1 auto' }} />
                                    <Button
                                       data-cy="btn-next-step-payment"
                                       color="inherit"
                                       onClick={handlePaymentOptions}
                                       sx={{
                                          width: 220,
                                          color: '#fff',
                                          fontWeight: 600,
                                          bgcolor: '#000',
                                          '&:hover': {
                                             bgcolor: '#fff',
                                             color: '#000'
                                          },
                                          '&:disabled': {
                                             color: '#000',
                                             bgcolor: '#999',
                                          }
                                       }}
                                    >
                                       Próximo
                                    </Button>
                                 </Box>
                              </>
                              : activeStep === 2 ?
                                 <>
                                    <PaymentMethodsOrderComponent />
                                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                                       <Button
                                          color="inherit"
                                          onClick={handleBack}
                                          sx={{
                                             width: 220,
                                             color: '#fff',
                                             fontWeight: 600,
                                             bgcolor: '#000',
                                             '&:hover': {
                                                bgcolor: '#fff',
                                                color: '#000'
                                             },
                                             '&:disabled': {
                                                color: '#000',
                                                bgcolor: '#999',
                                             }
                                          }}
                                       >
                                          Voltar
                                       </Button>
                                       <Box sx={{ flex: '1 1 auto' }} />
                                       <Button
                                          data-cy="btn-finish-order"
                                          color="inherit"
                                          onClick={handleCompleteOrder}
                                          disabled={isCreatingOrder}
                                          sx={{
                                             width: 220,
                                             color: '#fff',
                                             fontWeight: 600,
                                             bgcolor: '#000',
                                             '&:hover': {
                                                bgcolor: '#fff',
                                                color: '#000'
                                             },
                                             '&:disabled': {
                                                color: '#000',
                                                bgcolor: '#999',
                                             }
                                          }}
                                       >
                                          {isCreatingOrder ? (
                                             <>
                                                <CircularProgress size={20} sx={{ mr: 1, color: '#fff' }} />
                                                Finalizando...
                                             </>
                                          ) : (
                                             'Finalizar compra'
                                          )}
                                       </Button>
                                    </Box>
                                 </>
                                 :
                                 <></>
                     }
                  </>
               </Box>
            </Grid2>
            <Grid2 xs={5}>
               <OrderResumeComponent
                  redirectUrl={'/shipping'}
                  buttonLabel='Continuar para o frete'
               />
            </Grid2>
         </Grid2>
      </Grid2>
   );
};

export default CheckoutPage;