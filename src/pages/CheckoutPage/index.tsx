import { Box, Button, Step, StepButton, Stepper, Typography } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import React, {useContext, useState} from 'react';
import OrderResumeComponent from '../../shared/OrderResumeComponent';
import AddressFormComponent from '../../shared/AddressFormComponent';
import ShippingOptionsComponent from '../../shared/ShippingOptionsComponent';
import PaymentMethodsOrderComponent from '../../shared/PaymentMethodsOrderComponent';
// import { ShoppingCartContext } from '../../contexts/ShoppingCartContext';
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

   const order = useContext(OrderContext);
   const navigate = useNavigate();

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
      const response = await order.createOrder();

      if(response && response.code === CREATED){
         order.resetOrder();
         navigate('/order-finished', {
            state: {
               orderId: response.data[0].id,
               orderStatus: response.data[0].status,
            }
         });
      }else{
         toast.error('Erro ao finalizar o pedido');
      }
   }

   // useEffect(() => {
   //    console.log(order)
   // }, [order]);

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
                                       {/*<Link to={'/order-finished'}>*/}
                                          <Button
                                             data-cy="btn-finish-order"
                                             color="inherit"
                                             onClick={handleCompleteOrder}
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
                                             Finalizar compra
                                          </Button>
                                       {/*</Link>*/}
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