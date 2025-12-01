import React, { useEffect, useState } from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    Divider,
    Typography,
    Box,
    Chip,
    CircularProgress,
    useTheme,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar
} from "@mui/material";
import { ExpandMore, SentimentDissatisfied } from "@mui/icons-material";
import { useApi } from "../../../hooks/useApi.ts";
import { OrderCreateResponse } from "../../../utils/types/response/Order/OrderCreateResponse.ts";
import { ProductService } from '../../../services/ProductService.ts';

const CANCELED_STATUSES = [
    'REPROVADO',
    'CANCELADO',
    'TROCA RECUSADA',
    'DEVOLUÇÃO RECUSADA'
];

const CanceledOrdersComponent: React.FC = () => {
    const [canceledOrders, setCanceledOrders] = useState<OrderCreateResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const productService = new ProductService();

    const api = useApi();
    const theme = useTheme();

    const formatOrderType = (type: string) => {
        switch (type?.toUpperCase()) {
            case 'COMPRA':
                return 'Compra';
            case 'TROCA':
                return 'Troca';
            case 'DEVOLUCAO':
                return 'Devolução';
            default:
                return type || 'N/A';
        }
    };

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('pt-BR', options);
    };

    const fetchOrders = async () => {
        try {
            setLoading(true);
            
            let response;
            try {
                response = await api.getAllCanceledOrders();
                setCanceledOrders(response.data || []);
            } catch (err: any) {
                if (err?.response?.status === 404 || err?.response?.status === 400) {
                    const allOrdersResponse = await api.getAllOrders();
                    const allOrders = allOrdersResponse.data || [];
                    const filtered = allOrders.filter((order: OrderCreateResponse) =>
                        CANCELED_STATUSES.includes(order.status.name.toUpperCase())
                    );
                    setCanceledOrders(filtered);
                } else {
                    throw err;
                }
            }
        } catch (err) {
            setError("Erro ao carregar pedidos cancelados");
            console.error("Error fetching canceled orders:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                p: 4,
                textAlign: 'center'
            }}>
                <SentimentDissatisfied sx={{ fontSize: 48, color: 'error.main', mb: 2 }} />
                <Typography variant="h6" color="error" gutterBottom>
                    {error}
                </Typography>
                <Button
                    variant="outlined"
                    onClick={() => window.location.reload()}
                >
                    Tentar novamente
                </Button>
            </Box>
        );
    }

    if (!canceledOrders.length) {
        return (
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                p: 4,
                textAlign: 'center'
            }}>
                <SentimentDissatisfied sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                    Nenhum pedido cancelado encontrado
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%' }}>
            {canceledOrders.map((order) => (
                <Accordion key={order.id} sx={{ mb: 2, boxShadow: theme.shadows[2] }}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            width: '100%',
                            alignItems: 'center'
                        }}>
                            <Box>
                                <Typography fontWeight={600}>
                                    Pedido #{order.id}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Tipo: {formatOrderType(order.type)}
                                </Typography>
                            </Box>
                            <Chip
                                label={order.status.name}
                                color="error"
                                size="small"
                            />
                        </Box>
                    </AccordionSummary>

                    <AccordionDetails>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Tipo de Venda
                            </Typography>
                            <Typography>
                                {formatOrderType(order.type)}
                            </Typography>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Cliente
                            </Typography>
                            <Typography>
                                {order.customer.fullName}
                            </Typography>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Data do Pedido
                            </Typography>
                            <Typography>
                                {formatDate(order.createdAt)}
                            </Typography>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                Método de Pagamento
                            </Typography>
                            {order.orderPayments && order.orderPayments.length > 0 ? (
                                <Box>
                                    {order.orderPayments.length > 1 && (
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                            Pagamento dividido em {order.orderPayments.length} cartões
                                        </Typography>
                                    )}
                                    {order.orderPayments.map((payment, index) => {
                                        const totalPaymentValue = payment.installmentValue * payment.installments;
                                        const cardNumber = typeof payment.creditCard.cardNumber === 'string' 
                                            ? payment.creditCard.cardNumber 
                                            : payment.creditCard.cardNumber.toString();
                                        const lastFourDigits = cardNumber.slice(-4);
                                        
                                        return (
                                            <Box 
                                                key={payment.id || index}
                                                sx={{ 
                                                    mb: 1.5, 
                                                    p: 1.5, 
                                                    border: '1px solid #e0e0e0', 
                                                    borderRadius: 1,
                                                    bgcolor: '#f9f9f9'
                                                }}
                                            >
                                                {order.orderPayments.length > 1 && (
                                                    <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
                                                        Cartão {index + 1} de {order.orderPayments.length}
                                                    </Typography>
                                                )}
                                                <Typography variant="body2">
                                                    <strong>Bandeira:</strong> {payment.creditCard.cardFlag}
                                                </Typography>
                                                <Typography variant="body2">
                                                    <strong>Cartão:</strong> •••• {lastFourDigits}
                                                </Typography>
                                                <Typography variant="body2">
                                                    <strong>Nome:</strong> {payment.creditCard.cardName}
                                                </Typography>
                                                <Divider sx={{ my: 0.5 }} />
                                                <Typography variant="body2">
                                                    <strong>Pagamento:</strong> {payment.paymentMethod.replace('_', ' ')}
                                                </Typography>
                                                <Typography variant="body2">
                                                    <strong>Parcelas:</strong> {
                                                        payment.installments > 1
                                                            ? `${payment.installments}x de ${productService.formatProductPrice(payment.installmentValue)}`
                                                            : 'À vista'
                                                    }
                                                </Typography>
                                                <Typography variant="body2" sx={{ mt: 0.5 }}>
                                                    <strong>Total deste cartão:</strong> {productService.formatProductPrice(totalPaymentValue)}
                                                </Typography>
                                            </Box>
                                        );
                                    })}
                                    <Box sx={{ mt: 1.5, p: 1, bgcolor: '#f0f0f0', borderRadius: 1 }}>
                                        <Typography variant="body2" fontWeight={600}>
                                            <strong>Total do pagamento:</strong> {productService.formatProductPrice(order.totalPrice)}
                                        </Typography>
                                    </Box>
                                </Box>
                            ) : (
                                <Typography variant="body2" color="text.secondary">
                                    Informação de pagamento não disponível
                                </Typography>
                            )}
                        </Box>

                        {(order.shipment || order.shipping) && (
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Frete
                                </Typography>
                                {(() => {
                                    const shipment = order.shipment || order.shipping;
                                    if (!shipment) return null;
                                    return (
                                        <>
                                            <Typography variant="body2">
                                                <strong>Opção:</strong> {shipment.name}
                                            </Typography>
                                            {shipment.deliveryTime && (
                                                <Typography variant="body2">
                                                    <strong>Prazo de entrega:</strong> {shipment.deliveryTime}
                                                </Typography>
                                            )}
                                            <Typography variant="body2">
                                                <strong>Valor:</strong> {productService.formatProductPrice(typeof shipment.price === 'string' ? parseFloat(shipment.price) : shipment.price)}
                                            </Typography>
                                        </>
                                    );
                                })()}
                            </Box>
                        )}

                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Endereço de Entrega
                            </Typography>
                            <Typography>
                                {order.address.streetName}, {order.address.addressNumber} - {order.address.neighborhoods}
                            </Typography>
                            <Typography>
                                {order.address.city}/{order.address.state}
                            </Typography>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Produtos
                        </Typography>
                        <List dense>
                            {order.orderProducts.map((product, index) => (
                                <ListItem key={index} sx={{ px: 0 }}>
                                    <ListItemAvatar>
                                        <Avatar
                                            src={product.product.image}
                                            alt={product.product.name}
                                            variant="square"
                                        />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={product.product.name}
                                        secondary={`${product.quantity} x ${productService.formatProductPrice(product.product.salePrice)}`}
                                    />
                                    <Typography variant="body2">
                                        {productService.formatProductPrice(product.quantity * product.product.salePrice)}
                                    </Typography>
                                </ListItem>
                            ))}
                        </List>

                        {order.orderCoupons && order.orderCoupons.length > 0 && (
                            <>
                                <Divider sx={{ my: 2 }} />
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        Cupons Utilizados
                                    </Typography>
                                    {order.orderCoupons.map((coupon) => (
                                        <Box key={coupon.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="body2">
                                                {coupon.couponCode} ({coupon.couponType === 'PROMOTIONAL' ? 'Promocional' : 'Troca'})
                                            </Typography>
                                            <Typography variant="body2" color="success.main">
                                                - {productService.formatProductPrice(coupon.amountUsed)}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            </>
                        )}

                        <Divider sx={{ my: 2 }} />

                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Total do Pedido
                            </Typography>
                            <Typography variant="h6" fontWeight={600}>
                                {productService.formatProductPrice(order.totalPrice)}
                            </Typography>
                        </Box>
                    </AccordionDetails>
                </Accordion>
            ))}
        </Box>
    );
};

export default CanceledOrdersComponent;
