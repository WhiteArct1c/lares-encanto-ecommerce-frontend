import React, { useEffect, useState } from "react";
import {
    Accordion,
    AccordionActions,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
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
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [customerOrders, setCustomerOrders] = useState<OrderCreateResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const api = useApi();

    const handleClickOpenDialog = (value: string) => {
        setTitleDialog(value);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
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
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <Typography variant="subtitle1">
                                        <strong>Pedido #{order.id}</strong> - {order.status.name}
                                    </Typography>
                                    <Typography variant="body2">
                                        Data: {formatDate(order.createdAt)} • Total: R$ {productService.formatProductPrice(order.totalPrice)}
                                    </Typography>
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails>
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
                                        onRowSelectionModelChange={(ids) => {
                                            const selectedProducts = order.orderProducts
                                                .filter((product: any) => ids.includes(product.id));
                                            setSelectedRows(selectedProducts);
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

                                <Box>
                                    <Typography variant="subtitle2" gutterBottom>
                                        <strong>Forma de pagamento:</strong>
                                    </Typography>
                                    <Typography>
                                        {order.orderPayments[0].paymentMethod.replace('_', ' ')} •
                                        {order.orderPayments[0].installments > 1 ?
                                            ` ${order.orderPayments[0].installments}x de R$ ${order.orderPayments[0].installmentValue.toFixed(2).replace('.', ',')}` :
                                            ' À vista'}
                                    </Typography>
                                </Box>
                            </AccordionDetails>
                            <AccordionActions>
                                <Button
                                    variant="outlined"
                                    sx={{ m: 1 }}
                                    onClick={() => handleClickOpenDialog('Troca de produtos')}
                                    disabled={selectedRows.length === 0}
                                >
                                    Trocar itens selecionados
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    sx={{ m: 1 }}
                                    onClick={() => handleClickOpenDialog('Devolução de produtos')}
                                    disabled={selectedRows.length === 0}
                                >
                                    Devolver itens selecionados
                                </Button>
                            </AccordionActions>
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
                        <ChangeItemsFormComponent items={selectedRows} />
                    ) : (
                        <DevolutionFormComponent items={selectedRows} />
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button variant="outlined" onClick={handleClose} sx={{ mr: 2 }}>
                        Cancelar
                    </Button>
                    {titleDialog === 'Troca de produtos' ? (
                        <Button variant="contained" color="primary">
                            Confirmar troca
                        </Button>
                    ) : (
                        <Button variant="contained" color="error">
                            Confirmar devolução
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </Grid2>
    );
}

export default MyOrdersPage;