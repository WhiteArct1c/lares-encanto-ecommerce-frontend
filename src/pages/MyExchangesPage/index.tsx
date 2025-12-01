import React, { useEffect, useState } from "react";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Chip,
    Typography,
    CircularProgress,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import MyProfileSidenavComponent from "../../shared/MyProfileSidenavComponent";
import { ExpandMore, SentimentDissatisfied } from "@mui/icons-material";
import { useApi } from "../../hooks/useApi.ts";
import { ExchangeResponse } from "../../utils/types/response/Exchange/ExchangeResponse.ts";
import { ProductService } from "../../services/ProductService.ts";
import { Button } from "@mui/material";

interface MyExchangesPageProps {}

const productService = new ProductService();

const MyExchangesPage: React.FC<MyExchangesPageProps> = () => {
    const [exchanges, setExchanges] = useState<ExchangeResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    const calculateTotalItems = (exchange: ExchangeResponse) => {
        return exchange.items.reduce((total, item) => total + item.quantity, 0);
    };

    const calculateTotalValue = (exchange: ExchangeResponse) => {
        return exchange.items.reduce((total, item) => {
            const unitPrice = item.orderProduct.product.salePrice;
            return total + (unitPrice * item.quantity);
        }, 0);
    };

    useEffect(() => {
        const fetchExchanges = async () => {
            try {
                setLoading(true);
                const response = await api.getMyExchanges();
                setExchanges(response.data || []);
            } catch (err) {
                setError("Erro ao carregar trocas/devoluções. Tente novamente mais tarde.");
                console.error("Error fetching exchanges:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchExchanges();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Grid2 container xs={12} sx={{ mb: 10 }}>
            <Grid2 xs={12} sx={{ pl: 2, mt: 17 }}>
                <Typography fontFamily={'Public Sans'} fontSize={40} sx={{ mb: 10, ml: 3 }}>
                    Minhas Trocas/Devoluções
                </Typography>
            </Grid2>

            <MyProfileSidenavComponent />

            <Grid2 xs sx={{ display: 'flex', justifyContent: 'start', flexDirection: "column", ml: 10, mr: 10, mb: 20, p: 2 }}>
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
                ) : exchanges.length === 0 ? (
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
                ) : (
                    exchanges.map((exchange) => {
                        const totalItems = calculateTotalItems(exchange);
                        const totalValue = calculateTotalValue(exchange);
                        const firstItem = exchange.items[0];

                        return (
                            <Accordion key={exchange.id} sx={{ mb: 3 }}>
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
                                                <strong>Troca/Devolução #{exchange.id}</strong>
                                            </Typography>
                                            <Typography variant="body2">
                                                {exchange.items.length === 1 
                                                    ? `${firstItem.orderProduct.product.name}`
                                                    : `${exchange.items.length} produtos`
                                                } • {totalItems} item(ns) • Data: {formatDate(exchange.createdAt)}
                                            </Typography>
                                        </Box>
                                        <Chip
                                            label={formatStatusName(exchange.status.name)}
                                            color={
                                                exchange.status.name === 'TROCA ACEITA' || exchange.status.name === 'DEVOLUÇÃO ACEITA' ? 'success' :
                                                exchange.status.name === 'TROCA SOLICITADA' || exchange.status.name === 'DEVOLUÇÃO SOLICITADA' ? 'warning' :
                                                exchange.status.name === 'TROCA RECUSADA' || exchange.status.name === 'DEVOLUÇÃO RECUSADA' ? 'error' :
                                                exchange.status.name === 'TROCA CONCLUÍDA' || exchange.status.name === 'DEVOLUÇÃO CONCLUÍDA' ? 'success' :
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
                                                ✅ Cupom gerado! Verifique seus cupons.
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
                            </Accordion>
                        );
                    })
                )}
            </Grid2>
        </Grid2>
    );
};

export default MyExchangesPage;
