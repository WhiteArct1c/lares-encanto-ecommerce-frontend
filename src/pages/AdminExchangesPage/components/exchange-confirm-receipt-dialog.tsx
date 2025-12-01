import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    FormControlLabel,
    Checkbox
} from '@mui/material';
import { ExchangeResponse } from '../../../utils/types/response/Exchange/ExchangeResponse.ts';
import { useApi } from '../../../hooks/useApi.ts';
import { toast } from 'react-toastify';
import { OK } from '../../../utils/constants/apiCodes.ts';

interface ExchangeConfirmReceiptDialogProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    exchange: ExchangeResponse;
}

const ExchangeConfirmReceiptDialog: React.FC<ExchangeConfirmReceiptDialogProps> = ({
    open,
    onClose,
    onSuccess,
    exchange
}) => {
    const [returnToStock, setReturnToStock] = useState(true);
    const [loading, setLoading] = useState(false);
    const api = useApi();

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const response = await api.confirmExchangeReceipt({
                exchangeId: exchange.id,
                returnToStock: returnToStock
            });

            if (response && response.code === OK) {
                toast.success('Recebimento confirmado e cupom gerado com sucesso!');
                onSuccess();
            } else {
                toast.error(response?.message || 'Erro ao confirmar recebimento');
            }
        } catch (error: unknown) {
            const axiosError = error as { response?: { status?: number; data?: { message?: string } } };
            if (axiosError?.response?.status === 400) {
                const errorMessage = axiosError?.response?.data?.message || 'Erro ao confirmar recebimento';
                toast.error(errorMessage);
            } else {
                toast.error('Erro ao confirmar recebimento. Tente novamente.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                Confirmar Recebimento - Troca/Devolução #{exchange.id}
            </DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Pedido #{exchange.orderId} • {exchange.items.length} produto(s)
                    </Typography>

                    <Typography variant="body2" sx={{ mb: 2 }}>
                        Ao confirmar o recebimento:
                    </Typography>
                    <Box component="ul" sx={{ pl: 2, mb: 2 }}>
                        <li>
                            <Typography variant="body2">
                                O status será alterado para <strong>TROCA CONCLUÍDA</strong>
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body2">
                                Um cupom de troca será gerado com o valor total dos itens
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body2">
                                Os itens poderão retornar ao estoque (se marcado)
                            </Typography>
                        </li>
                    </Box>

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={returnToStock}
                                onChange={(e) => setReturnToStock(e.target.checked)}
                            />
                        }
                        label="Retornar itens ao estoque"
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading}>
                    Cancelar
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={loading}
                    color="success"
                >
                    {loading ? 'Processando...' : 'Confirmar Recebimento'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ExchangeConfirmReceiptDialog;


