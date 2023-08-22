import { Box, Button, Step, StepButton, Stepper, Typography } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import React, { useContext, useState } from 'react';
import OrderResumeComponent from '../../shared/OrderResumeComponent';
import AddressFormComponent from '../../shared/AddressFormComponent';
import ShippingOptionsComponent from '../../shared/ShippingOptionsComponent';
import PaymentMethodsOrderComponent from '../../shared/PaymentMethodsOrderComponent';
import { Link } from 'react-router-dom';
import { ShoppingCartContext } from '../../contexts/ShoppingCartContext';

interface CheckoutPageProps {

}

const CheckoutPage: React.FC<CheckoutPageProps> = () => {

   const steps = ['Endereço', 'Frete', 'Pagamento'];

   const [activeStep, setActiveStep] = React.useState(0);
   const [completed, setCompleted] = useState<{
      [k: number]: boolean;
   }>({});

   const cart = useContext(ShoppingCartContext);

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

   const handleAddressShipment = () => {
      handleComplete()
   }

   const handleCompleteOrder = () => {
      //TODO: MANDAR ORDEM PARA O BACKEND COM POST E RESETAR CARRINHO
      cart?.resetCart();

   }

   return (
      <Grid2
         container
         xs={12}
         sx={{ mt: 15, mb: 30, width: '100%' }}
      >
         <Grid2 xs={12}>
            <Typography
               fontFamily={'Public Sans'}
               fontSize={'2.5rem'}
               fontWeight={600}
               color={'#000'}
               sx={{
                  ml: 20
               }}
            >
               Checkout
            </Typography>
         </Grid2>
         <Grid2 container xs={12} sx={{ p: 7,  }}>
            <Grid2 xs={6}>
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
                              <Box component='form'>
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
                              </Box>
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
                                       <Link to={'/order-finished'}>
                                          <Button
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
                                       </Link>
                                    </Box>
                                 </>
                                 :
                                 <></>
                     }
                  </>
               </Box>
            </Grid2>
            <Grid2 >
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