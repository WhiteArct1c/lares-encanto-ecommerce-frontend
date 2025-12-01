import React, { useEffect, useState } from "react";
import {
    Accordion,
    AccordionActions,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Chip,
    Dialog, DialogActions, DialogContent, DialogTitle, Divider,
    Typography,
    CircularProgress
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import MyProfileSidenavComponent from "../../shared/MyProfileSidenavComponent";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { ExpandMore, SentimentDissatisfied } from "@mui/icons-material";
import ChangeItemsFormComponent from "./components/change-items-form-component.tsx";
import DevolutionFormComponent from "./components/devolution-form-component.tsx";
import { useApi } from "../../hooks/useApi.ts";
import { OrderCreateResponse } from "../../utils/types/response/Order/OrderCreateResponse.ts";
import NoOrdersFound from "./components/no-orders-found.tsx";
import {ProductService} from "../../services/ProductService.ts";
import { ExchangeItemRequest } from "../../utils/types/request/Exchange/ExchangeItemRequest.ts";
import { toast } from "react-toastify";
import { CREATED } from "../../utils/constants/apiCodes.ts";

interface MyOrdersPageProps {}

const productService = new ProductService();

const productColumns: GridColDef[] = [
    {
        field: 'id',
        headerName: 'ID',
        width: 90
    },
    {
        field: 'product.name',
        headerName: 'Produto',
        width: 250,
        valueGetter: (params) => params.row.product.name
    },
    {
        field: 'quantity',
        headerName: 'Quantidade',
        width: 120,
        type: 'number'
    },
    {
        field: 'product.salePrice',
        headerName: 'Preço Unitário',
        width: 150,
        type: 'number',
        valueGetter: (params) => `R$ ${productService.formatProductPrice(params.row.product.salePrice)}`
    },
    {
        field: 'total',
        headerName: 'Total',
        width: 150,
        type: 'number',
        valueGetter: (params) => `R$ ${productService.formatProductPrice(params.row.quantity * params.row.product.salePrice)}`
    }
];

const MyOrdersPage: React.FC<MyOrdersPageProps> = () => {
    const [open, setOpen] = useState(false);
    const [titleDialog, setTitleDialog] = useState('');
    const [selectedRows, setSelectedRows] = useState<Map<number, any[]>>(new Map());
    const [currentOrderId, setCurrentOrderId] = useState<number | null>(null);
    const [exchangeItems, setExchangeItems] = useState<ExchangeItemRequest[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [customerOrders, setCustomerOrders] = useState<OrderCreateResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const api = useApi();

    const handleClickOpenDialog = (value: string, orderId: number) => {
        const orderSelectedRows = selectedRows.get(orderId) || [];
        if (orderSelectedRows.length === 0) {
            return;
        }
        setTitleDialog(value);
        setCurrentOrderId(orderId);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setExchangeItems([]);
        setCurrentOrderId(null);
    };

    const handleItemsChange = (items: ExchangeItemRequest[]) => {
        setExchangeItems(items);
    };

    const handleConfirm = async () => {
        if (!currentOrderId) return;
        
        if (exchangeItems.length === 0) {
            toast.error('Selecione pelo menos um produto e preencha o motivo para cada um');
            return;
        }

        const hasInvalidItems = exchangeItems.some(item => 
            item.quantity <= 0 || !item.reason || item.reason.trim() === ''
        );

        if (hasInvalidItems) {
            toast.error('Todos os produtos devem ter quantidade maior que zero e motivo preenchido');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await api.createExchange({
                orderId: currentOrderId,
                items: exchangeItems
            });

            if (response && response.code === CREATED) {
                toast.success(`Troca/devolução de ${exchangeItems.length} item(ns) solicitada com sucesso!`);
                handleClose();
                
                const updatedResponse = await api.getCustomerOrders();
                setCustomerOrders(updatedResponse.data || []);
            } else {
                toast.error(response?.message || 'Erro ao solicitar troca/devolução');
            }
        } catch (error: unknown) {
            const axiosError = error as { response?: { status?: number; data?: { message?: string } } };
            if (axiosError?.response?.status === 400) {
                const errorMessage = axiosError?.response?.data?.message || 'Erro ao solicitar troca/devolução';
                toast.error(errorMessage);
            } else {
                toast.error('Erro ao solicitar troca/devolução. Tente novamente.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        const fetchCustomerOrders = async () => {
            try {
                setLoading(true);
                const response = await api.getCustomerOrders();
                setCustomerOrders(response.data || []);
            } catch (err) {
                setError("Erro ao carregar pedidos. Tente novamente mais tarde.");
                console.error("Error fetching orders:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCustomerOrders();
    }, []);

    // Função para formatar o tipo do pedido
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

    // Função para formatar a data
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

    return (
        <Grid2 container xs={12} sx={{ mb: 10 }}>
            <Grid2 xs={12} sx={{ pl: 2, mt: 17 }}>
                <Typography fontFamily={'Public Sans'} fontSize={40} sx={{ mb: 10, ml: 3 }}>
                    Meus Pedidos
                </Typography>
            </Grid2>

            <MyProfileSidenavComponent />

            <Grid2 xs sx={{ display: 'flex', justifyContent: 'start', flexDirection: "column", ml: 10, mr: 10, mb:20, p: 2 }}>
                <Divider sx={{ mb: 3 }} />

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                        <CircularProgress size={60} />
                    </Box>
                ) : error ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, p: 3 }}>
                        <SentimentDissatisfied sx={{ fontSize: 60, color: 'error.main' }} />
                        <Typography color="error" variant="h6">{error}</Typography>
                        <Button variant="outlined" color="error" onClick={() => window.location.reload()}>
                            Tentar novamente
                        </Button>
                    </Box>
                ) : customerOrders.length ? (
                    customerOrders.map((order) => (
                        <Accordion key={order.id} sx={{ mb: 3 }}>
                            <AccordionSummary
                                expandIcon={<ExpandMore />}
                                sx={{
                                    width: '100%',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    backgroundColor: '#f5f5f5'
                                }}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                        <Typography variant="subtitle1">
                                            <strong>Pedido #{order.id}</strong>
                                        </Typography>
                                        <Typography variant="body2">
                                            Tipo: {formatOrderType(order.type)} • Data: {formatDate(order.createdAt)} • Total: R$ {productService.formatProductPrice(order.totalPrice)}
                                        </Typography>
                                    </Box>
                                    <Chip
                                        label={order.status.name}
                                        color={
                                            order.status.name === 'APROVADO' ? 'success' :
                                            order.status.name === 'EM PROCESSAMENTO' ? 'warning' :
                                            order.status.name === 'REPROVADO' || order.status.name === 'CANCELADO' ? 'error' :
                                            order.status.name === 'EM TRANSPORTE' ? 'info' :
                                            order.status.name === 'ENTREGUE' ? 'success' :
                                            order.status.name.includes('TROCA') || order.status.name.includes('DEVOLUÇÃO') ? 'warning' :
                                            'default'
                                        }
                                        size="small"
                                        sx={{ fontWeight: 600 }}
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

                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        <strong>Produtos:</strong>
                                    </Typography>
                                    <DataGrid
                                        rows={order.orderProducts}
                                        columns={productColumns}
                                        autoHeight
                                        pageSizeOptions={[5, 10]}
                                        initialState={{
                                            pagination: {
                                                paginationModel: { pageSize: 5, page: 0 },
                                            },
                                        }}
                                        checkboxSelection
                                        rowSelectionModel={(selectedRows.get(order.id) || []).map(item => item.id)}
                                        onRowSelectionModelChange={(ids) => {
                                            const selectedProducts = order.orderProducts
                                                .filter((product: any) => ids.includes(product.id));
                                            setSelectedRows(prev => {
                                                const newMap = new Map(prev);
                                                newMap.set(order.id, selectedProducts);
                                                return newMap;
                                            });
                                        }}
                                        sx={{
                                            '& .MuiDataGrid-cell': {
                                                py: 1,
                                            },
                                        }}
                                    />
                                </Box>

                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        <strong>Endereço de entrega:</strong>
                                    </Typography>
                                    <Typography>
                                        {order.address.streetName}, {order.address.addressNumber} - {order.address.neighborhoods}<br />
                                        {order.address.city}/{order.address.state} - CEP: {order.address.cep}
                                    </Typography>
                                </Box>

                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        <strong>Forma de pagamento:</strong>
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
                                                            mb: 2, 
                                                            p: 2, 
                                                            border: '1px solid #e0e0e0', 
                                                            borderRadius: 1,
                                                            bgcolor: '#f9f9f9'
                                                        }}
                                                    >
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                                            <Typography variant="body2" fontWeight={600}>
                                                                Cartão {index + 1} de {order.orderPayments.length}
                                                            </Typography>
                                                            {payment.creditCard.mainCard && (
                                                                <Chip 
                                                                    label="Principal" 
                                                                    size="small" 
                                                                    sx={{ bgcolor: '#484646', color: '#fff', fontSize: '0.7rem' }}
                                                                />
                                                            )}
                                                        </Box>
                                                        <Typography variant="body2">
                                                            <strong>Bandeira:</strong> {payment.creditCard.cardFlag}
                                                        </Typography>
                                                        <Typography variant="body2">
                                                            <strong>Cartão:</strong> •••• {lastFourDigits}
                                                        </Typography>
                                                        <Typography variant="body2">
                                                            <strong>Nome:</strong> {payment.creditCard.cardName}
                                                        </Typography>
                                                        <Divider sx={{ my: 1 }} />
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
                                            <Box sx={{ mt: 2, p: 1.5, bgcolor: '#f0f0f0', borderRadius: 1 }}>
                                                <Typography variant="body2" fontWeight={600}>
                                                    <strong>Total do pagamento:</strong> {productService.formatProductPrice(order.totalPrice)}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    ) : (
                                        <Typography variant="body2" color="text.secondary">
                                            Compra totalmente coberta por cupons - sem método de pagamento necessário
                                        </Typography>
                                    )}
                                </Box>

                                {order.orderCoupons && order.orderCoupons.length > 0 && (
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="subtitle2" gutterBottom>
                                            <strong>Cupons Utilizados:</strong>
                                        </Typography>
                                        {order.orderCoupons.map((coupon) => (
                                            <Box key={coupon.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                <Typography variant="body2">
                                                    {coupon.couponCode} ({coupon.couponType === 'PROMOTIONAL' ? 'Promocional' : 'Troca'})
                                                </Typography>
                                                <Typography variant="body2" color="success.main">
                                                    - {productService.formatProductPrice(coupon.amountUsed)}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                )}

                                {(order.shipment || order.shipping) && (
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="subtitle2" gutterBottom>
                                            <strong>Frete:</strong>
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
                            </AccordionDetails>
                            {order.status.name === 'ENTREGUE' && (
                                <AccordionActions>
                                    <Button
                                        variant="outlined"
                                        sx={{ m: 1 }}
                                        onClick={() => handleClickOpenDialog('Troca de produtos', order.id)}
                                        disabled={(selectedRows.get(order.id) || []).length === 0}
                                    >
                                        Trocar itens selecionados
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        sx={{ m: 1 }}
                                        onClick={() => handleClickOpenDialog('Devolução de produtos', order.id)}
                                        disabled={(selectedRows.get(order.id) || []).length === 0}
                                    >
                                        Devolver itens selecionados
                                    </Button>
                                </AccordionActions>
                            )}
                        </Accordion>
                    ))
                ) : (
                    <NoOrdersFound />
                )}
            </Grid2>

            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
                <DialogTitle sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {titleDialog}
                </DialogTitle>
                <DialogContent>
                    {titleDialog === 'Troca de produtos' ? (
                        <ChangeItemsFormComponent 
                            items={currentOrderId ? (selectedRows.get(currentOrderId) || []) : []} 
                            onItemsChange={handleItemsChange}
                        />
                    ) : (
                        <DevolutionFormComponent 
                            items={currentOrderId ? (selectedRows.get(currentOrderId) || []) : []} 
                            onItemsChange={handleItemsChange}
                        />
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button 
                        variant="outlined" 
                        onClick={handleClose} 
                        sx={{ mr: 2 }}
                        disabled={isSubmitting}
                    >
                        Cancelar
                    </Button>
                    {titleDialog === 'Troca de produtos' ? (
                        <Button 
                            variant="contained" 
                            color="primary"
                            onClick={handleConfirm}
                            disabled={isSubmitting || exchangeItems.length === 0}
                        >
                            {isSubmitting ? 'Enviando...' : 'Confirmar troca'}
                        </Button>
                    ) : (
                        <Button 
                            variant="contained" 
                            color="error"
                            onClick={handleConfirm}
                            disabled={isSubmitting || exchangeItems.length === 0}
                        >
                            {isSubmitting ? 'Enviando...' : 'Confirmar devolução'}
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </Grid2>
    );
}

export default MyOrdersPage;