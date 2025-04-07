import React, { useEffect, useState } from 'react';
import {
    Accordion,
    AccordionActions,
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
import OrderStatusDialog from "./order-status-dialog.tsx";
import { ProductService } from '../../../services/ProductService.ts';

const PendingOrdersComponent: React.FC = () => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<OrderCreateResponse | null>(null);
    const [pendingOrders, setPendingOrders] = useState<OrderCreateResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const productService = new ProductService();

    const api = useApi();
    const theme = useTheme();

    const handleStatusChange = () => {
        setDialogOpen(false);
        // Aqui você pode adicionar lógica para atualizar a lista após mudança de status
    }

    const handleOpenDialog = (order: OrderCreateResponse) => {
        setSelectedOrder(order);
        setDialogOpen(true);
    }

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

    useEffect(() => {
        const fetchAllOrders = async () => {
            try {
                setLoading(true);
                const response = await api.getAllPendingOrders();
                setPendingOrders(response.data || []);
            } catch (err) {
                setError("Erro ao carregar pedidos pendentes");
                console.error("Error fetching pending orders:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchAllOrders();
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

    if (!pendingOrders.length) {
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
                    Nenhum pedido pendente encontrado
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%' }}>
            {pendingOrders.map((order) => (
                <Accordion key={order.id} sx={{ mb: 2, boxShadow: theme.shadows[2] }}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            width: '100%',
                            alignItems: 'center'
                        }}>
                            <Typography fontWeight={600}>
                                Pedido #{order.id}
                            </Typography>
                            <Chip
                                label={order.status.name}
                                color={
                                    order.status.name === 'EM PROCESSAMENTO' ? 'primary' :
                                        order.status.name === 'APROVADO' ? 'success' : 'default'
                                }
                                size="small"
                            />
                        </Box>
                    </AccordionSummary>

                    <AccordionDetails>
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
                            <Typography variant="subtitle2" color="text.secondary">
                                Método de Pagamento
                            </Typography>
                            <Typography>
                                {order.orderPayments[0]?.paymentMethod?.replace('_', ' ') || 'Não especificado'}
                            </Typography>
                        </Box>

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

                    <AccordionActions>
                        <Button
                            variant="contained"
                            fullWidth
                            sx={{
                                fontWeight: 600,
                                bgcolor: 'black',
                                '&:hover': {
                                    bgcolor: 'grey.800',
                                }
                            }}
                            onClick={() => handleOpenDialog(order)}
                        >
                            Alterar Status
                        </Button>
                    </AccordionActions>
                </Accordion>
            ))}

            {selectedOrder && (
                <OrderStatusDialog
                    open={dialogOpen}
                    onClose={() => setDialogOpen(false)}
                    onSave={handleStatusChange}
                    // order={selectedOrder}
                />
            )}
        </Box>
    );
};

export default PendingOrdersComponent;