import React, { useState, useEffect, useMemo } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    SelectChangeEvent
} from '@mui/material';
import { ExchangeResponse } from '../../../utils/types/response/Exchange/ExchangeResponse.ts';
import { useApi } from '../../../hooks/useApi.ts';
import { toast } from 'react-toastify';
import { OK } from '../../../utils/constants/apiCodes.ts';
import { Typography } from '@mui/material';

interface ExchangeStatusDialogProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    exchange: ExchangeResponse;
}

const ExchangeStatusDialog: React.FC<ExchangeStatusDialogProps> = ({
    open,
    onClose,
    onSuccess,
    exchange
}) => {
    const getAllStatusOptions = () => {
        return [
            'TROCA SOLICITADA',
            'TROCA ACEITA',
            'TROCA RECUSADA',
            'TROCA CONCLUÍDA',
            'DEVOLUÇÃO SOLICITADA',
            'DEVOLUÇÃO ACEITA',
            'DEVOLUÇÃO RECUSADA',
            'DEVOLUÇÃO CONCLUÍDA'
        ];
    };

    const getAvailableStatuses = (currentStatus: string): string[] => {
        const allStatuses = getAllStatusOptions();
        const normalizedStatus = currentStatus.toUpperCase();

        if (normalizedStatus === 'TROCA SOLICITADA') {
            return allStatuses.filter(status => 
                status === 'TROCA ACEITA' || status === 'TROCA RECUSADA'
            );
        } else if (normalizedStatus === 'DEVOLUÇÃO SOLICITADA') {
            return allStatuses.filter(status => 
                status === 'DEVOLUÇÃO ACEITA' || status === 'DEVOLUÇÃO RECUSADA'
            );
        } else if (normalizedStatus === 'TROCA ACEITA') {
            return allStatuses.filter(status => status === 'TROCA CONCLUÍDA');
        } else if (normalizedStatus === 'DEVOLUÇÃO ACEITA') {
            return allStatuses.filter(status => status === 'DEVOLUÇÃO CONCLUÍDA');
        } else {
            return [];
        }
    };

    const statusOptions = useMemo(() => {
        return getAvailableStatuses(exchange.status.name);
    }, [exchange.status.name]);

    const [selectedStatus, setSelectedStatus] = useState(exchange.status.name);

    useEffect(() => {
        if (open) {
            if (statusOptions.length > 0 && statusOptions.includes(exchange.status.name)) {
                setSelectedStatus(exchange.status.name);
            } else if (statusOptions.length > 0) {
                setSelectedStatus(statusOptions[0]);
            } else {
                setSelectedStatus(exchange.status.name);
            }
        }
    }, [open, exchange.status.name, statusOptions]);

    const [loading, setLoading] = useState(false);
    const api = useApi();

    const handleChange = (event: SelectChangeEvent) => {
        setSelectedStatus(event.target.value);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const response = await api.updateExchangeStatus({
                exchangeId: exchange.id,
                statusName: selectedStatus
            });

            if (response && response.code === OK) {
                toast.success(`Status da troca/devolução #${exchange.id} alterado para ${selectedStatus}`);
                onSuccess();
            } else {
                toast.error(response?.message || 'Erro ao atualizar status');
            }
        } catch (error: unknown) {
            const axiosError = error as { response?: { status?: number; data?: { message?: string } } };
            if (axiosError?.response?.status === 400) {
                const errorMessage = axiosError?.response?.data?.message || 'Erro ao atualizar status';
                toast.error(errorMessage);
            } else {
                toast.error('Erro ao atualizar status. Tente novamente.');
            }
        } finally {
            setLoading(false);
        }
    };

    const formatStatusName = (statusName: string) => {
        return statusName
            .replace('TROCA', 'Troca')
            .replace('DEVOLUÇÃO', 'Devolução')
            .replace('_', ' ');
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                Alterar Status - Troca/Devolução #{exchange.id}
            </DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Status atual: <strong>{formatStatusName(exchange.status.name)}</strong>
                    </Typography>

                    {statusOptions.length === 0 ? (
                        <Typography variant="body2" color="error">
                            Este status não pode ser alterado. Status finais (recusados ou concluídos) não podem ser modificados.
                        </Typography>
                    ) : (
                        <FormControl fullWidth>
                            <InputLabel id="status-select-label">Novo Status</InputLabel>
                            <Select
                                labelId="status-select-label"
                                id="status-select"
                                value={selectedStatus}
                                label="Novo Status"
                                onChange={handleChange}
                            >
                                {statusOptions.map((status) => (
                                    <MenuItem key={status} value={status}>
                                        {formatStatusName(status)}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading}>
                    Cancelar
                </Button>
                {statusOptions.length > 0 && (
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={loading || selectedStatus === exchange.status.name}
                        sx={{
                            bgcolor: '#000',
                            color: '#fff',
                            '&:hover': {
                                bgcolor: '#333',
                            }
                        }}
                    >
                        {loading ? 'Salvando...' : 'Salvar'}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default ExchangeStatusDialog;

