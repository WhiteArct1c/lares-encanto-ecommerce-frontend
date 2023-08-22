import { Button, Typography } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import React from 'react';
import { OrderStatusEnum } from '../../utils/enum/OrderStatusEnum';
import { Link } from 'react-router-dom';

interface OrderFinishiedPageProps {
   
}

const OrderFinishiedPage: React.FC<OrderFinishiedPageProps> = () => {
   return (
      <Grid2 
         container
         spacing={3}
         sx={{mt:18, mb:17, display:'flex', justifyContent:'center'}}
      >
         <Grid2 xs={12} sx={{display:'flex', justifyContent:'center'}}>
            <Typography
               fontFamily={'Public Sans'}
               fontSize={70}
            >
               Pedido finalizado!
            </Typography>
         </Grid2>
         <Grid2 
            xs={12} 
            sx={{
               bgcolor:'#fff', 
               filter:'drop-shadow(0px 0px 5px rgba(0, 0, 0, 0.20))', 
               borderRadius:1, 
               display:'flex', 
               alignItems:'center',
               justifyContent:'center',
               flexDirection:'column',
               gap:3,
               width:'60%',
               p:4
            }}
         >
            <Typography
               fontFamily={'Public Sans'}
               fontSize={35}
               fontWeight={600}
            >
               Número do pedido: 300
            </Typography>
            <Typography
               fontFamily={'Public Sans'}
               fontSize={25}
               fontWeight={400}
            >
               Obrigado por comprar com a Lares Encanto!
            </Typography>
            <Typography
               fontFamily={'Public Sans'}
               fontSize={25}
               fontWeight={200}
            >
               Status da compra: {OrderStatusEnum.EM_PROCESSAMENTO}
            </Typography>
         </Grid2>
         <Grid2 xs={12} sx={{display:'flex', alignItems:'center', gap:2, flexDirection:'column', mt:5}}>
            <Link to={'/my-orders'}>
               <Button
                  variant='contained'
                  sx={{
                     bgcolor: '#000',
                     color: 'white',
                     fontSize:15,
                     width:300,
                     height:50,
                     '&:hover': {
                        bgcolor: '#888',
                        color: '#fff',
                     }
                  }}
               >
                  Ir aos meus pedidos
               </Button>
            </Link>
            <Link to={'/products'}>
               <Button
                  variant='contained'
                  sx={{
                     bgcolor: 'white',
                     color: 'black',
                     fontSize:15,
                     width:300,
                     height:50,
                     '&:hover': {
                        bgcolor: '#666',
                        color: 'white',
                     }
                  }}
               >
                  Voltar para o início
               </Button>
            </Link>
         </Grid2>
      </Grid2>
   );
};

export default OrderFinishiedPage;