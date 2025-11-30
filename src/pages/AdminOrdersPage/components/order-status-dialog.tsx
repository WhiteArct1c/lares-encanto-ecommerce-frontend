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
    Box, SelectChangeEvent
} from '@mui/material';

interface OrderStatusDialogProps {
    open: boolean;
    onClose: () => void;
    onSave: (selectedStatus: string) => void;
    orderId: number;
    currentStatus: string;
    orderType?: string;
}

const OrderStatusDialog: React.FC<OrderStatusDialogProps> = ({ open, onClose, onSave, currentStatus, orderType }) => {
    const getAllStatusOptions = () => {
        return [
            'EM PROCESSAMENTO',
            'REPROVADO',
            'APROVADO',
            'CANCELADO',
            'EM TRANSPORTE',
            'ENTREGUE',
            'TROCA SOLICITADA',
            'TROCA ACEITA',
            'TROCA CONCLUÍDA',
            'TROCA RECUSADA',
            'DEVOLUÇÃO SOLICITADA',
            'DEVOLUÇÃO ACEITA',
            'DEVOLUÇÃO RECUSADA',
            'DEVOLUÇÃO CONCLUÍDA'
        ];
    };

    const statusOptions = useMemo(() => {
        const allOptions = getAllStatusOptions();
        const normalizedType = orderType?.toUpperCase();

        if (normalizedType === 'COMPRA') {
            return allOptions.filter(status => 
                ['REPROVADO', 'APROVADO', 'CANCELADO', 'EM TRANSPORTE', 'ENTREGUE'].includes(status)
            );
        } else if (normalizedType === 'TROCA') {
            return allOptions.filter(status => 
                status.includes('TROCA')
            );
        } else if (normalizedType === 'DEVOLUCAO' || normalizedType === 'DEVOLUÇÃO') {
            return allOptions.filter(status => 
                status.includes('DEVOLUÇÃO')
            );
        }

        return allOptions;
    }, [orderType]);

    const [selectedStatus, setSelectedStatus] = useState(currentStatus);

    useEffect(() => {
        if (open) {
            if (statusOptions.includes(currentStatus)) {
                setSelectedStatus(currentStatus);
            } else if (statusOptions.length > 0) {
                setSelectedStatus(statusOptions[0]);
            }
        }
    }, [open, currentStatus, statusOptions]);

    const handleChange = (event: SelectChangeEvent) => {
        setSelectedStatus(event.target.value);
    };

    const handleSave = () => {
        onSave(selectedStatus);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Alterar Status do Pedido</DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 2 }}>
                    <FormControl fullWidth>
                        <InputLabel id="status-select-label">Status</InputLabel>
                        <Select
                            labelId="status-select-label"
                            id="status-select"
                            value={selectedStatus}
                            label="Status"
                            onChange={handleChange}
                        >
                            {statusOptions.map((status) => (
                                <MenuItem key={status} value={status}>
                                    {status}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} sx={{color: '#000'}}>
                    Cancelar
                </Button>
                <Button
                    onClick={handleSave}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        bgcolor: '#000',
                        color: '#fff',
                        fontWeight: 800,
                        '&:hover': {
                            bgcolor: '#fff',
                            color: '#000'
                        }
                    }}
                    disabled={!selectedStatus}
                >
                    Salvar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default OrderStatusDialog;
