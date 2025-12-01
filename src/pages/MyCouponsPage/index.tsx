import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import {Divider, Typography, Box, Card, CardContent, Chip, CircularProgress, Button} from "@mui/material";
import { SentimentDissatisfied } from "@mui/icons-material";
import MyProfileSidenavComponent from "../../shared/MyProfileSidenavComponent";
import React, { useEffect, useState } from "react";
import { useApi } from "../../hooks/useApi.ts";
import { CouponResponse } from "../../utils/types/response/Coupon/CouponResponse.ts";
import { ProductService } from "../../services/ProductService.ts";

interface MyCouponsPageProps {}

const productService = new ProductService();

const MyCouponsPage: React.FC<MyCouponsPageProps> = () => {
    const [coupons, setCoupons] = useState<CouponResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const api = useApi();

    useEffect(() => {
        const fetchCoupons = async () => {
            try {
                setLoading(true);
                const response = await api.getCoupons();
                setCoupons(response.data || []);
            } catch (err) {
                setError("Erro ao carregar cupons. Tente novamente mais tarde.");
                console.error("Error fetching coupons:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCoupons();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

    const isExpired = (expiresAt: string) => {
        return new Date(expiresAt) < new Date();
    };

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

    return (
        <Grid2 container xs={12} sx={{mb: 15,}}>
            <Grid2 xs={12} sx={{ pl: 2,  mt: 17}}>
                <Typography fontFamily={'Public Sans'} fontSize={40} sx={{mb: 10, ml: 3}}>
                  Meus Cupons
                </Typography>
            </Grid2>

            <MyProfileSidenavComponent/>

            <Grid2 xs sx={{display:'flex', justifyContent:'start', flexDirection:"column", ml: 10, mr:10, p:2}}>
                <Divider sx={{mb:3}}/>

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
                ) : coupons.length === 0 ? (
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        p: 4,
                        textAlign: 'center'
                    }}>
                        <SentimentDissatisfied sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary">
                            Você não possui cupons
                        </Typography>
                    </Box>
                ) : (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                        {coupons.map((coupon) => {
                            const expired = isExpired(coupon.expiresAt);
                            const isActive = coupon.isActive && !expired && coupon.availableValue > 0;

                            return (
                                <Card 
                                    key={coupon.id} 
                                    sx={{ 
                                        minWidth: 300, 
                                        maxWidth: 350,
                                        opacity: isActive ? 1 : 0.7,
                                        border: isActive ? '2px solid #4caf50' : '2px solid #e0e0e0'
                                    }}
                                >
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                            <Typography variant="h6" fontWeight={600}>
                                                {coupon.code}
                                            </Typography>
                                            <Chip
                                                label={formatCouponType(coupon.couponType)}
                                                size="small"
                                                color={coupon.couponType === 'EXCHANGE' ? 'primary' : 'secondary'}
                                            />
                                        </Box>

                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Valor total
                                            </Typography>
                                            <Typography variant="h6" fontWeight={600}>
                                                {productService.formatProductPrice(coupon.value)}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Valor utilizado
                                            </Typography>
                                            <Typography variant="body1">
                                                {productService.formatProductPrice(coupon.usedValue)}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Valor disponível
                                            </Typography>
                                            <Typography variant="h6" color={isActive ? 'success.main' : 'text.secondary'}>
                                                {productService.formatProductPrice(coupon.availableValue)}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Válido até
                                            </Typography>
                                            <Typography variant="body2" color={expired ? 'error.main' : 'text.primary'}>
                                                {formatDate(coupon.expiresAt)}
                                                {expired && ' (Expirado)'}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ mt: 2 }}>
                                            <Chip
                                                label={isActive ? 'Ativo' : !coupon.isActive ? 'Inativo' : expired ? 'Expirado' : 'Indisponível'}
                                                color={isActive ? 'success' : 'default'}
                                                size="small"
                                                variant={isActive ? 'filled' : 'outlined'}
                                            />
                                        </Box>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </Box>
                )}
            </Grid2>
        </Grid2>
    );
};

export default MyCouponsPage;
