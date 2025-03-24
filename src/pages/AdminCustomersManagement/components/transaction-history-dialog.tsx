import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    IconButton,
    Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface TransactionHistoryDialogProps {
    open: boolean;
    onClose: () => void;
    userName: string | undefined;
}

const TransactionHistoryDialog: React.FC<TransactionHistoryDialogProps> = ({open, onClose, userName}) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">
                        Histórico de Transações - {userName}
                    </Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent dividers>
                {/* Área vazia para conteúdo dinâmico */}
                <Box py={4} textAlign="center">
                    <Typography color="textSecondary">
                        Nenhuma transação disponível
                    </Typography>
                </Box>
            </DialogContent>

            <DialogActions>
                <Button
                    onClick={onClose}
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
                >
                    Fechar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TransactionHistoryDialog;