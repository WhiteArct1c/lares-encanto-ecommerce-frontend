import React, { useEffect, useState, useContext } from 'react';
import {
    Box,
    Card,
    CardContent,
    Chip,
    Divider,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
    Typography,
    CircularProgress,
    IconButton,
    Alert,
    Button,
    InputAdornment
} from '@mui/material';
import { Delete, LocalOffer, Check, Close } from '@mui/icons-material';
import { useApi } from '../../hooks/useApi.ts';
import { CouponResponse } from '../../utils/types/response/Coupon/CouponResponse.ts';
import { CouponUsage } from '../../utils/types/request/Order/CouponUsage.ts';
import { OrderContext } from '../../contexts/OrderContext/OrderContext.tsx';
import { ProductService } from '../../services/ProductService.ts';
import { NumericFormat } from 'react-number-format';
import { toast } from 'react-toastify';

interface CouponSelectionComponentProps {
    orderTotal: number;
}

const productService = new ProductService();

const CouponSelectionComponent: React.FC<CouponSelectionComponentProps> = ({ orderTotal }) => {
    const [availableCoupons, setAvailableCoupons] = useState<CouponResponse[]>([]);
    const [selectedCoupons, setSelectedCoupons] = useState<Map<string, CouponUsage>>(new Map());
    const [promotionalCoupon, setPromotionalCoupon] = useState<CouponResponse | null>(null);
    const [promotionalCouponInput, setPromotionalCouponInput] = useState('');
    const [validatingPromotional, setValidatingPromotional] = useState(false);
    const [loading, setLoading] = useState(false);
    const order = useContext(OrderContext);
    const api = useApi();

    useEffect(() => {
        const fetchCoupons = async () => {
            try {
                setLoading(true);
                const response = await api.getActiveCoupons();
                const coupons = response.data || [];
                setAvailableCoupons(coupons.filter(c => c.availableValue > 0 && c.couponType === 'EXCHANGE'));
            } catch (err) {
                console.error("Error fetching coupons:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCoupons();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (order?.orderCoupons) {
            const couponsMap = new Map<string, CouponUsage>();
            let promoCode: string | null = null;
            
            order.orderCoupons.forEach(couponUsage => {
                const coupon = availableCoupons.find(c => c.code === couponUsage.couponCode);
                if (coupon && coupon.couponType === 'EXCHANGE') {
                    couponsMap.set(couponUsage.couponCode, couponUsage);
                } else {
                    // Pode ser um cupom promocional - vamos buscar via API
                    promoCode = couponUsage.couponCode;
                }
            });
            
            setSelectedCoupons(couponsMap);
            
            // Se encontrou um código de cupom promocional, buscar os dados completos
            if (promoCode && !availableCoupons.find(c => c.code === promoCode && c.couponType === 'PROMOTIONAL')) {
                api.validatePromotionalCoupon(promoCode).then(response => {
                    if (response.data && response.data.length > 0) {
                        const promo = response.data[0];
                        if (promo.couponType === 'PROMOTIONAL') {
                            setPromotionalCoupon(promo);
                        }
                    }
                }).catch(() => {
                    // Se falhar, não faz nada - o cupom pode ter sido removido
                });
            }
        } else {
            setSelectedCoupons(new Map());
            setPromotionalCoupon(null);
            setPromotionalCouponInput('');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [order?.orderCoupons, availableCoupons]);

    const formatCouponType = (type: string) => {
        switch (type?.toUpperCase()) {
            case 'EXCHANGE':
                return 'Troca';
            case 'PROMOTIONAL':
                return 'Promocional';
            default:
                return type || 'N/A';
        }
    };

    const hasPromotionalCoupon = () => {
        return promotionalCoupon !== null;
    };

    const handleValidatePromotionalCoupon = async () => {
        if (!promotionalCouponInput.trim()) {
            toast.error('Digite o código do cupom');
            return;
        }

        if (promotionalCoupon) {
            toast.error('Você já possui um cupom promocional aplicado. Apenas um cupom promocional por compra.');
            return;
        }

        setValidatingPromotional(true);
        try {
            const response = await api.validatePromotionalCoupon(promotionalCouponInput.toUpperCase().trim());
            
            if (response.data && response.data.length > 0) {
                const coupon = response.data[0];
                
                if (coupon.couponType !== 'PROMOTIONAL') {
                    toast.error('Este cupom não é promocional');
                    return;
                }

                // Cupons promocionais não validam valor disponível - podem ser usados mesmo quando totalmente usados
                // Apenas verificamos se está ativo e não expirado
                if (!coupon.isActive) {
                    toast.error('Cupom inativo');
                    return;
                }

                const expiresAt = coupon.expiresAt ? new Date(coupon.expiresAt) : null;
                if (expiresAt && expiresAt < new Date()) {
                    toast.error('Cupom expirado');
                    return;
                }

                setPromotionalCoupon(coupon);
                setPromotionalCouponInput('');
                
                // Cupons promocionais podem usar até o valor do cupom OU o total do pedido, o que for menor
                // O valor do cupom é o limite máximo (ex: cupom de R$ 500 não pode usar mais que R$ 500)
                const maxAmountFromCoupon = Math.min(coupon.value, orderTotal);
                
                // Calcular o desconto total dos outros cupons (de troca)
                const otherCouponsDiscount = Array.from(selectedCoupons.values()).reduce((sum, c) => sum + c.amountToUse, 0);
                const remainingTotal = orderTotal - otherCouponsDiscount;
                
                // O cupom promocional não pode exceder o que resta do total após os outros cupons
                const maxAmount = Math.min(maxAmountFromCoupon, remainingTotal);
                
                const newCouponUsage: CouponUsage = {
                    couponCode: coupon.code,
                    amountToUse: maxAmount
                };

                const currentCoupons = Array.from(selectedCoupons.values());
                currentCoupons.push(newCouponUsage);

                if (order?.setOrderCoupons) {
                    order.setOrderCoupons(currentCoupons);
                }

                toast.success('Cupom promocional validado com sucesso!');
            }
        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || err?.message || 'Erro ao validar cupom';
            toast.error(errorMessage);
        } finally {
            setValidatingPromotional(false);
        }
    };

    const handleRemovePromotionalCoupon = () => {
        if (promotionalCoupon) {
            const currentCoupons = Array.from(selectedCoupons.values());
            const filteredCoupons = currentCoupons.filter(c => c.couponCode !== promotionalCoupon.code);

            if (order?.setOrderCoupons) {
                order.setOrderCoupons(filteredCoupons);
            }

            setPromotionalCoupon(null);
            setPromotionalCouponInput('');
        }
    };

    const handleAddCoupon = (couponCode: string) => {
        const coupon = availableCoupons.find(c => c.code === couponCode);
        if (!coupon) return;

        if (coupon.couponType === 'PROMOTIONAL' && hasPromotionalCoupon()) {
            toast.error('Apenas um cupom promocional pode ser usado por compra');
            return;
        }

        if (selectedCoupons.has(couponCode)) {
            toast.warning('Este cupom já foi adicionado');
            return;
        }

        const maxAmountFromCoupon = Math.min(coupon.availableValue, orderTotal);
        
        // Calcular o desconto total dos outros cupons
        const otherCouponsDiscount = Array.from(selectedCoupons.values()).reduce((sum, c) => sum + c.amountToUse, 0);
        
        // Incluir cupom promocional se existir
        const promoDiscount = promotionalCoupon && order?.orderCoupons?.find(c => c.couponCode === promotionalCoupon.code)
            ? order.orderCoupons.find(c => c.couponCode === promotionalCoupon.code)!.amountToUse
            : 0;
        
        const remainingTotal = orderTotal - otherCouponsDiscount - promoDiscount;
        const maxAmount = Math.min(maxAmountFromCoupon, remainingTotal);
        
        const newCouponUsage: CouponUsage = {
            couponCode: coupon.code,
            amountToUse: maxAmount
        };

        const newMap = new Map(selectedCoupons);
        newMap.set(couponCode, newCouponUsage);
        setSelectedCoupons(newMap);

        if (order?.setOrderCoupons) {
            // Incluir cupom promocional se existir
            const allCoupons = Array.from(newMap.values());
            if (promotionalCoupon && order.orderCoupons) {
                const promoUsage = order.orderCoupons.find(c => c.couponCode === promotionalCoupon.code);
                if (promoUsage) {
                    allCoupons.push(promoUsage);
                }
            }
            order.setOrderCoupons(allCoupons);
        }
    };

    const handleRemoveCoupon = (couponCode: string) => {
        const newMap = new Map(selectedCoupons);
        newMap.delete(couponCode);
        setSelectedCoupons(newMap);

        if (order?.setOrderCoupons) {
            // Incluir cupom promocional se existir
            const allCoupons = Array.from(newMap.values());
            if (promotionalCoupon && order.orderCoupons) {
                const promoUsage = order.orderCoupons.find(c => c.couponCode === promotionalCoupon.code);
                if (promoUsage) {
                    allCoupons.push(promoUsage);
                }
            }
            order.setOrderCoupons(allCoupons);
        }
    };

    const handleAmountChange = (couponCode: string, amount: number) => {
        const coupon = availableCoupons.find(c => c.code === couponCode);
        if (!coupon) return;

        const maxAmountFromCoupon = Math.min(coupon.availableValue, orderTotal);
        
        // Calcular o desconto total atual (sem este cupom)
        const otherCouponsDiscount = Array.from(selectedCoupons.entries())
            .filter(([code]) => code !== couponCode)
            .reduce((sum, [, couponUsage]) => sum + couponUsage.amountToUse, 0);
        
        // Incluir cupom promocional se existir
        const promoDiscount = promotionalCoupon && order?.orderCoupons?.find(c => c.couponCode === promotionalCoupon.code)
            ? order.orderCoupons.find(c => c.couponCode === promotionalCoupon.code)!.amountToUse
            : 0;
        
        const remainingTotal = orderTotal - otherCouponsDiscount - promoDiscount;
        const maxAmount = Math.min(maxAmountFromCoupon, remainingTotal);
        const validAmount = Math.max(0, Math.min(amount, maxAmount));

        // Validação final: garantir que a soma de todos os cupons não exceda o total
        const totalDiscount = otherCouponsDiscount + promoDiscount + validAmount;
        if (totalDiscount > orderTotal) {
            toast.error(`A soma dos cupons (R$ ${totalDiscount.toFixed(2)}) não pode exceder o valor total do pedido (R$ ${orderTotal.toFixed(2)})`);
            return;
        }

        const newCouponUsage: CouponUsage = {
            couponCode: coupon.code,
            amountToUse: validAmount
        };

        const newMap = new Map(selectedCoupons);
        newMap.set(couponCode, newCouponUsage);
        setSelectedCoupons(newMap);

        if (order?.setOrderCoupons) {
            // Incluir cupom promocional se existir
            const allCoupons = Array.from(newMap.values());
            if (promotionalCoupon && order.orderCoupons) {
                const promoUsage = order.orderCoupons.find(c => c.couponCode === promotionalCoupon.code);
                if (promoUsage) {
                    allCoupons.push(promoUsage);
                }
            }
            order.setOrderCoupons(allCoupons);
        }
    };

    const calculateTotalDiscount = () => {
        let discount = Array.from(selectedCoupons.values()).reduce((sum, coupon) => sum + coupon.amountToUse, 0);
        
        if (promotionalCoupon) {
            const promoUsage = order?.orderCoupons?.find(c => c.couponCode === promotionalCoupon.code);
            if (promoUsage) {
                discount += promoUsage.amountToUse;
            }
        }
        
        return discount;
    };

    const getUnusedCoupons = () => {
        const usedCodes = Array.from(selectedCoupons.keys());
        
        return availableCoupons.filter(c => {
            if (usedCodes.includes(c.code)) return false;
            return true;
        });
    };

    const handlePromotionalAmountChange = (amount: number) => {
        if (!promotionalCoupon) return;

        // Cupons promocionais podem usar até o valor do cupom OU o total do pedido, o que for menor
        // O valor do cupom é o limite máximo (ex: cupom de R$ 500 não pode usar mais que R$ 500)
        const maxAmountFromCoupon = Math.min(promotionalCoupon.value, orderTotal);
        
        // Calcular o desconto total atual (sem o cupom promocional)
        const otherCouponsDiscount = Array.from(selectedCoupons.values()).reduce((sum, coupon) => sum + coupon.amountToUse, 0);
        const remainingTotal = orderTotal - otherCouponsDiscount;
        
        // O cupom promocional não pode exceder o que resta do total após os outros cupons
        const maxAmount = Math.min(maxAmountFromCoupon, remainingTotal);
        const validAmount = Math.max(0, Math.min(amount, maxAmount));

        // Validação final: garantir que a soma de todos os cupons não exceda o total
        const totalDiscount = otherCouponsDiscount + validAmount;
        if (totalDiscount > orderTotal) {
            toast.error(`A soma dos cupons (R$ ${totalDiscount.toFixed(2)}) não pode exceder o valor total do pedido (R$ ${orderTotal.toFixed(2)})`);
            return;
        }

        const newCouponUsage: CouponUsage = {
            couponCode: promotionalCoupon.code,
            amountToUse: validAmount
        };

        const currentCoupons = Array.from(selectedCoupons.values());
        const filteredCoupons = currentCoupons.filter(c => c.couponCode !== promotionalCoupon.code);
        filteredCoupons.push(newCouponUsage);

        if (order?.setOrderCoupons) {
            order.setOrderCoupons(filteredCoupons);
        }
    };

    const totalDiscount = calculateTotalDiscount();
    const unusedCoupons = getUnusedCoupons();

    return (
        <Box sx={{ 
            mb: 3, 
            width: '100%', 
            maxWidth: '100%', 
            boxSizing: 'border-box', 
            overflow: 'hidden',
            minWidth: 0
        }}>
            <Typography
                fontFamily={'Public Sans'}
                fontSize={'1.2rem'}
                fontWeight={600}
                color={'#000'}
                sx={{ mb: 2 }}
            >
                <LocalOffer sx={{ verticalAlign: 'middle', mr: 1 }} />
                Cupons de Desconto
            </Typography>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                    <CircularProgress size={24} />
                </Box>
            ) : (
                <>
                    {/* Seção de Cupom Promocional */}
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                            Cupom Promocional
                        </Typography>
                        {!promotionalCoupon ? (
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <TextField
                                    fullWidth
                                    label="Digite o código do cupom promocional"
                                    value={promotionalCouponInput}
                                    onChange={(e) => setPromotionalCouponInput(e.target.value.toUpperCase())}
                                    disabled={validatingPromotional}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            handleValidatePromotionalCoupon();
                                        }
                                    }}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                {validatingPromotional && <CircularProgress size={20} />}
                                            </InputAdornment>
                                        )
                                    }}
                                />
                                <Button
                                    variant="contained"
                                    onClick={handleValidatePromotionalCoupon}
                                    disabled={!promotionalCouponInput.trim() || validatingPromotional}
                                    sx={{ minWidth: 120 }}
                                >
                                    {validatingPromotional ? 'Validando...' : 'Validar'}
                                </Button>
                            </Box>
                        ) : (
                            <Card variant="outlined">
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                        <Box>
                                            <Typography variant="h6" fontWeight={600}>
                                                {promotionalCoupon.code}
                                            </Typography>
                                            <Chip
                                                label={formatCouponType(promotionalCoupon.couponType)}
                                                size="small"
                                                color="secondary"
                                                sx={{ mt: 0.5 }}
                                            />
                                        </Box>
                                        <IconButton
                                            size="small"
                                            onClick={handleRemovePromotionalCoupon}
                                            color="error"
                                        >
                                            <Delete />
                                        </IconButton>
                                    </Box>

                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                        Valor máximo do cupom: {productService.formatProductPrice(promotionalCoupon.value)}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '0.75rem' }}>
                                        Pode usar até {productService.formatProductPrice(Math.min(promotionalCoupon.value, orderTotal))} (menor entre valor do cupom e total do pedido)
                                    </Typography>

                                    <NumericFormat
                                        customInput={TextField}
                                        label="Valor a usar"
                                        value={order?.orderCoupons?.find(c => c.couponCode === promotionalCoupon.code)?.amountToUse || 0}
                                        onValueChange={(values) => {
                                            handlePromotionalAmountChange(values.floatValue || 0);
                                        }}
                                        thousandSeparator="."
                                        decimalSeparator=","
                                        prefix="R$ "
                                        decimalScale={2}
                                        fixedDecimalScale
                                        fullWidth
                                        size="small"
                                        inputProps={{
                                            min: 0,
                                            max: Math.min(promotionalCoupon.value, orderTotal)
                                        }}
                                    />
                                </CardContent>
                            </Card>
                        )}
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* Seção de Cupons de Troca */}
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                            Meus Cupons de Troca
                        </Typography>
                        {unusedCoupons.length > 0 && (
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel id="coupon-select-label">Adicionar Cupom de Troca</InputLabel>
                                <Select
                                    labelId="coupon-select-label"
                                    id="coupon-select"
                                    value=""
                                    label="Adicionar Cupom de Troca"
                                    onChange={(e: SelectChangeEvent) => {
                                        if (e.target.value) {
                                            handleAddCoupon(e.target.value);
                                        }
                                    }}
                                >
                                    {unusedCoupons.map((coupon) => (
                                        <MenuItem key={coupon.id} value={coupon.code}>
                                            {coupon.code} - Disponível: {productService.formatProductPrice(coupon.availableValue)}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                    </Box>

                    {selectedCoupons.size === 0 ? (
                        <Alert severity="info">
                            Você não possui cupons de troca disponíveis ou não adicionou nenhum cupom ainda.
                        </Alert>
                    ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {Array.from(selectedCoupons.values()).map((couponUsage) => {
                                const coupon = availableCoupons.find(c => c.code === couponUsage.couponCode);
                                if (!coupon) return null;

                                return (
                                    <Card key={coupon.code} variant="outlined" sx={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
                                        <CardContent sx={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                                <Box>
                                                    <Typography variant="h6" fontWeight={600}>
                                                        {coupon.code}
                                                    </Typography>
                                                    <Chip
                                                        label={formatCouponType(coupon.couponType)}
                                                        size="small"
                                                        color="primary"
                                                        sx={{ mt: 0.5 }}
                                                    />
                                                </Box>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleRemoveCoupon(coupon.code)}
                                                    color="error"
                                                >
                                                    <Delete />
                                                </IconButton>
                                            </Box>

                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                Valor disponível: {productService.formatProductPrice(coupon.availableValue)}
                                            </Typography>

                                            <NumericFormat
                                                customInput={TextField}
                                                label="Valor a usar"
                                                value={couponUsage.amountToUse}
                                                onValueChange={(values) => {
                                                    handleAmountChange(coupon.code, values.floatValue || 0);
                                                }}
                                                thousandSeparator="."
                                                decimalSeparator=","
                                                prefix="R$ "
                                                decimalScale={2}
                                                fixedDecimalScale
                                                fullWidth
                                                size="small"
                                                inputProps={{
                                                    min: 0,
                                                    max: Math.min(coupon.availableValue, orderTotal)
                                                }}
                                            />
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </Box>
                    )}

                    {totalDiscount > 0 && (
                        <>
                            <Divider sx={{ my: 2 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="body1" fontWeight={600}>
                                    Desconto total:
                                </Typography>
                                <Typography variant="h6" color="success.main" fontWeight={600}>
                                    - {productService.formatProductPrice(totalDiscount)}
                                </Typography>
                            </Box>
                        </>
                    )}
                </>
            )}
        </Box>
    );
};

export default CouponSelectionComponent;

