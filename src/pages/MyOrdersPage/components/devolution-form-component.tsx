import React, { useState, useEffect } from 'react';
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import {Box, Card, TextField, Typography, Avatar} from "@mui/material";
import { OrderProduct } from '../../../utils/types/response/Order/OrderProduct.ts';
import { ProductService } from '../../../services/ProductService.ts';
import { ExchangeItemRequest } from '../../../utils/types/request/Exchange/ExchangeItemRequest.ts';

interface DevolutionFormComponentProps{
    items: OrderProduct[];
    onItemsChange: (items: ExchangeItemRequest[]) => void;
}

const productService = new ProductService();

interface ItemFormData {
    orderProductId: number;
    quantity: number;
    reason: string;
    maxQuantity: number;
    productName: string;
}

const DevolutionFormComponent: React.FC<DevolutionFormComponentProps> = ({items, onItemsChange}) => {
    const [itemsData, setItemsData] = useState<ItemFormData[]>([]);

    useEffect(() => {
        const initialData = items.map(item => ({
            orderProductId: item.id,
            quantity: item.quantity,
            reason: '',
            maxQuantity: item.quantity,
            productName: item.product.name
        }));
        setItemsData(initialData);
    }, [items]);

    useEffect(() => {
        const exchangeItems: ExchangeItemRequest[] = itemsData
            .filter(item => item.quantity > 0 && item.reason.trim() !== '')
            .map(item => ({
                orderProductId: item.orderProductId,
                quantity: item.quantity,
                reason: item.reason.trim() || null
            }));
        onItemsChange(exchangeItems);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [itemsData]);

    const updateItemQuantity = (index: number, quantity: number) => {
        const newItems = [...itemsData];
        const maxQty = newItems[index].maxQuantity;
        const validQuantity = Math.max(0, Math.min(quantity, maxQty));
        newItems[index].quantity = validQuantity;
        setItemsData(newItems);
    };

    const updateItemReason = (index: number, reason: string) => {
        const newItems = [...itemsData];
        newItems[index].reason = reason;
        setItemsData(newItems);
    };

    if (items.length === 0) {
        return (
            <Grid2 xs={12} sx={{ p: 2 }}>
                <Typography variant="body2" color="text.secondary">
                    Nenhum produto selecionado
                </Typography>
            </Grid2>
        );
    }

    return (
        <Grid2 xs={12} sx={{display: 'flex', flexDirection:'column', gap:3, width:'100%', p: 2 }}>
            <Typography variant="h6" fontFamily={'Public Sans'} fontWeight={600}>
                Itens selecionados para devolução:
            </Typography>
            <Box sx={{display:'flex', flexDirection:'column', gap:3, mb: 2}}>
                {
                    itemsData.map((itemData, index) => {
                        const orderProduct = items.find(p => p.id === itemData.orderProductId);
                        if (!orderProduct) return null;

                        return (
                            <Card 
                                key={itemData.orderProductId} 
                                sx={{
                                    width:'100%',
                                    display: 'flex',
                                    flexDirection:'column',
                                    gap:2,
                                    p: 2
                                }}
                            >
                                <Box sx={{display: 'flex', gap: 2, alignItems: 'flex-start'}}>
                                    <Avatar 
                                        src={orderProduct.product.image || undefined} 
                                        alt={orderProduct.product.name}
                                        variant="square"
                                        sx={{ width: 80, height: 80 }}
                                    >
                                        {orderProduct.product.name.charAt(0)}
                                    </Avatar>
                                    <Box sx={{flex: 1}}>
                                        <Typography variant="h6" fontWeight={600}>
                                            {orderProduct.product.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Quantidade comprada: {itemData.maxQuantity}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Preço unitário: {productService.formatProductPrice(orderProduct.product.salePrice)}
                                        </Typography>
                                    </Box>
                                </Box>
                                
                                <Box sx={{display: 'flex', gap: 2, flexDirection: 'column'}}>
                                    <TextField
                                        label="Quantidade a devolver"
                                        type="number"
                                        inputProps={{ min: 1, max: itemData.maxQuantity }}
                                        value={itemData.quantity}
                                        onChange={(e) => updateItemQuantity(index, parseInt(e.target.value) || 0)}
                                        helperText={`Máximo: ${itemData.maxQuantity} unidades`}
                                        required
                                        sx={{ maxWidth: 200 }}
                                    />
                                    <TextField
                                        label="Motivo da devolução"
                                        multiline
                                        fullWidth
                                        rows={3}
                                        required
                                        value={itemData.reason}
                                        onChange={(e) => updateItemReason(index, e.target.value)}
                                        placeholder="Descreva o motivo da devolução deste produto..."
                                        helperText="Campo obrigatório"
                                    />
                                </Box>
                            </Card>
                        )
                    })
                }
            </Box>
        </Grid2>
    )
};

export default DevolutionFormComponent;
