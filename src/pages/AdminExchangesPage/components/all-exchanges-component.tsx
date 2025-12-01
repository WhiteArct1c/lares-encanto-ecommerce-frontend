import React, { useEffect, useState } from 'react';
import {
    Accordion,
    AccordionActions,
    AccordionDetails,
    AccordionSummary,
    Button,
    Box,
    Chip,
    CircularProgress,
    Typography,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar
} from "@mui/material";
import { ExpandMore, SentimentDissatisfied } from "@mui/icons-material";
import { useApi } from "../../../hooks/useApi.ts";
import { ExchangeResponse } from "../../../utils/types/response/Exchange/ExchangeResponse.ts";
import { ProductService } from '../../../services/ProductService.ts';
import ExchangeAuthorizeDialog from "./exchange-authorize-dialog.tsx";
import ExchangeConfirmReceiptDialog from "./exchange-confirm-receipt-dialog.tsx";
import ExchangeStatusDialog from "./exchange-status-dialog.tsx";

const productService = new ProductService();

const AllExchangesComponent: React.FC = () => {
    const [allExchanges, setAllExchanges] = useState<ExchangeResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [authorizeDialogOpen, setAuthorizeDialogOpen] = useState(false);
    const [confirmReceiptDialogOpen, setConfirmReceiptDialogOpen] = useState(false);
    const [statusDialogOpen, setStatusDialogOpen] = useState(false);
    const [selectedExchange, setSelectedExchange] = useState<ExchangeResponse | null>(null);

    const api = useApi();

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

    const formatStatusName = (statusName: string) => {
        return statusName
            .replace('TROCA', 'Troca')
            .replace('DEVOLUÇÃO', 'Devolução')
            .replace('_', ' ');
    };

    const getStatusColor = (statusName: string) => {
        const normalizedStatus = statusName.toUpperCase();
        if (normalizedStatus === 'TROCA ACEITA' || normalizedStatus === 'DEVOLUÇÃO ACEITA') {
            return 'success';
        } else if (normalizedStatus === 'TROCA SOLICITADA' || normalizedStatus === 'DEVOLUÇÃO SOLICITADA') {
            return 'warning';
        } else if (normalizedStatus === 'TROCA RECUSADA' || normalizedStatus === 'DEVOLUÇÃO RECUSADA') {
            return 'error';
        } else if (normalizedStatus === 'TROCA CONCLUÍDA' || normalizedStatus === 'DEVOLUÇÃO CONCLUÍDA') {
            return 'success';
        }
        return 'default';
    };

    const calculateTotalItems = (exchange: ExchangeResponse) => {
        return exchange.items.reduce((total, item) => total + item.quantity, 0);
    };

    const calculateTotalValue = (exchange: ExchangeResponse) => {
        return exchange.items.reduce((total, item) => {
            const unitPrice = item.orderProduct.product.salePrice;
            return total + (unitPrice * item.quantity);
        }, 0);
    };

    const fetchExchanges = async () => {
        try {
            setLoading(true);
            const response = await api.getAllExchanges();
            setAllExchanges(response.data || []);
        } catch (err) {
            setError("Erro ao carregar trocas/devoluções");
            console.error("Error fetching all exchanges:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExchanges();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleAuthorizeSuccess = () => {
        setAuthorizeDialogOpen(false);
        setSelectedExchange(null);
        fetchExchanges();
    };

    const handleConfirmReceiptSuccess = () => {
        setConfirmReceiptDialogOpen(false);
        setSelectedExchange(null);
        fetchExchanges();
    };

    const handleStatusUpdateSuccess = () => {
        setStatusDialogOpen(false);
        setSelectedExchange(null);
        fetchExchanges();
    };

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
                <Button variant="outlined" onClick={() => window.location.reload()}>
                    Tentar novamente
                </Button>
            </Box>
        );
    }

    if (!allExchanges.length) {
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
                    Nenhuma troca/devolução encontrada
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%' }}>
            {allExchanges.map((exchange) => {
                const totalItems = calculateTotalItems(exchange);
                const totalValue = calculateTotalValue(exchange);

                return (
                    <Accordion key={exchange.id} sx={{ mb: 2 }}>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                width: '100%',
                                alignItems: 'center'
                            }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <Typography fontWeight={600}>
                                        Troca/Devolução #{exchange.id}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Pedido #{exchange.orderId} • {exchange.items.length} produto(s) • {totalItems} item(ns) • {formatDate(exchange.createdAt)}
                                    </Typography>
                                </Box>
                                <Chip
                                    label={formatStatusName(exchange.status.name)}
                                    color={getStatusColor(exchange.status.name) as any}
                                    size="small"
                                />
                            </Box>
                        </AccordionSummary>

                        <AccordionDetails>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Pedido Original
                                </Typography>
                                <Typography>
                                    Pedido #{exchange.orderId}
                                </Typography>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Produtos
                                </Typography>
                                <List dense>
                                    {exchange.items.map((item, index) => (
                                        <ListItem key={item.id || index} sx={{ px: 0, flexDirection: 'column', alignItems: 'flex-start' }}>
                                            <Box sx={{ display: 'flex', width: '100%', alignItems: 'flex-start', gap: 2 }}>
                                                <ListItemAvatar>
                                                    <Avatar
                                                        src={item.orderProduct.product.image}
                                                        alt={item.orderProduct.product.name}
                                                        variant="square"
                                                        sx={{ width: 60, height: 60 }}
                                                    >
                                                        {item.orderProduct.product.name.charAt(0)}
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={item.orderProduct.product.name}
                                                    secondary={
                                                        <Box>
                                                            <Typography variant="body2" color="text.secondary">
                                                                Quantidade: {item.quantity} de {item.orderProduct.quantity} comprada(s)
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                Preço unitário: {productService.formatProductPrice(item.orderProduct.product.salePrice)}
                                                            </Typography>
                                                            {item.reason && (
                                                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontStyle: 'italic' }}>
                                                                    Motivo: {item.reason}
                                                                </Typography>
                                                            )}
                                                        </Box>
                                                    }
                                                />
                                                <Typography variant="body2" fontWeight={600} sx={{ mt: 1 }}>
                                                    {productService.formatProductPrice(item.orderProduct.product.salePrice * item.quantity)}
                                                </Typography>
                                            </Box>
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Box sx={{ mb: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                                <Typography variant="body2" fontWeight={600}>
                                    Total: {productService.formatProductPrice(totalValue)} ({totalItems} item(ns))
                                </Typography>
                            </Box>

                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Status
                                </Typography>
                                <Typography>
                                    {formatStatusName(exchange.status.name)}
                                </Typography>
                            </Box>

                            {exchange.couponGenerated && (
                                <Box sx={{ mb: 2, p: 2, bgcolor: '#e8f5e9', borderRadius: 1 }}>
                                    <Typography variant="body2" fontWeight={600} color="success.main">
                                        ✅ Cupom gerado
                                    </Typography>
                                </Box>
                            )}

                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Data da Solicitação
                                </Typography>
                                <Typography>
                                    {formatDate(exchange.createdAt)}
                                </Typography>
                            </Box>
                        </AccordionDetails>

                        <AccordionActions>
                            {exchange.status.name === 'TROCA SOLICITADA' || exchange.status.name === 'DEVOLUÇÃO SOLICITADA' ? (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => {
                                        setSelectedExchange(exchange);
                                        setAuthorizeDialogOpen(true);
                                    }}
                                    sx={{ mr: 1 }}
                                >
                                    Autorizar/Recusar
                                </Button>
                            ) : exchange.status.name === 'TROCA ACEITA' || exchange.status.name === 'DEVOLUÇÃO ACEITA' ? (
                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={() => {
                                        setSelectedExchange(exchange);
                                        setConfirmReceiptDialogOpen(true);
                                    }}
                                    sx={{ mr: 1 }}
                                >
                                    Confirmar Recebimento
                                </Button>
                            ) : null}
                            <Button
                                variant="outlined"
                                onClick={() => {
                                    setSelectedExchange(exchange);
                                    setStatusDialogOpen(true);
                                }}
                            >
                                Alterar Status
                            </Button>
                        </AccordionActions>
                    </Accordion>
                );
            })}

            {selectedExchange && (
                <>
                    <ExchangeAuthorizeDialog
                        open={authorizeDialogOpen}
                        onClose={() => {
                            setAuthorizeDialogOpen(false);
                            setSelectedExchange(null);
                        }}
                        onSuccess={handleAuthorizeSuccess}
                        exchange={selectedExchange}
                    />
                    <ExchangeConfirmReceiptDialog
                        open={confirmReceiptDialogOpen}
                        onClose={() => {
                            setConfirmReceiptDialogOpen(false);
                            setSelectedExchange(null);
                        }}
                        onSuccess={handleConfirmReceiptSuccess}
                        exchange={selectedExchange}
                    />
                    <ExchangeStatusDialog
                        open={statusDialogOpen}
                        onClose={() => {
                            setStatusDialogOpen(false);
                            setSelectedExchange(null);
                        }}
                        onSuccess={handleStatusUpdateSuccess}
                        exchange={selectedExchange}
                    />
                </>
            )}
        </Box>
    );
};

export default AllExchangesComponent;

