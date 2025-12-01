import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel
} from '@mui/material';
import { ExchangeResponse } from '../../../utils/types/response/Exchange/ExchangeResponse.ts';
import { useApi } from '../../../hooks/useApi.ts';
import { toast } from 'react-toastify';
import { OK } from '../../../utils/constants/apiCodes.ts';

interface ExchangeAuthorizeDialogProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    exchange: ExchangeResponse;
}

const ExchangeAuthorizeDialog: React.FC<ExchangeAuthorizeDialogProps> = ({
    open,
    onClose,
    onSuccess,
    exchange
}) => {
    const [action, setAction] = useState<'APPROVE' | 'REJECT'>('APPROVE');
    const [loading, setLoading] = useState(false);
    const api = useApi();

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const response = await api.authorizeExchange({
                exchangeId: exchange.id,
                action: action
            });

            if (response && response.code === OK) {
                toast.success(
                    action === 'APPROVE'
                        ? 'Troca/devolução autorizada com sucesso!'
                        : 'Troca/devolução recusada com sucesso!'
                );
                onSuccess();
            } else {
                toast.error(response?.message || 'Erro ao processar autorização');
            }
        } catch (error: unknown) {
            const axiosError = error as { response?: { status?: number; data?: { message?: string } } };
            if (axiosError?.response?.status === 400) {
                const errorMessage = axiosError?.response?.data?.message || 'Erro ao processar autorização';
                toast.error(errorMessage);
            } else {
                toast.error('Erro ao processar autorização. Tente novamente.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                Autorizar/Recusar Troca/Devolução #{exchange.id}
            </DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Pedido #{exchange.orderId} • {exchange.items.length} produto(s)
                    </Typography>

                    <FormControl component="fieldset">
                        <FormLabel component="legend">Ação</FormLabel>
                        <RadioGroup
                            value={action}
                            onChange={(e) => setAction(e.target.value as 'APPROVE' | 'REJECT')}
                        >
                            <FormControlLabel
                                value="APPROVE"
                                control={<Radio />}
                                label="Autorizar troca/devolução"
                            />
                            <FormControlLabel
                                value="REJECT"
                                control={<Radio />}
                                label="Recusar troca/devolução"
                            />
                        </RadioGroup>
                    </FormControl>
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
                    color={action === 'APPROVE' ? 'success' : 'error'}
                >
                    {loading ? 'Processando...' : action === 'APPROVE' ? 'Autorizar' : 'Recusar'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ExchangeAuthorizeDialog;


