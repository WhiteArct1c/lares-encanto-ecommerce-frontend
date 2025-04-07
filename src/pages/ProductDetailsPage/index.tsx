import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { Box, Button, Typography, Chip, Divider, useTheme, useMediaQuery, CircularProgress } from '@mui/material';
import { ShoppingCartContext } from '../../contexts/ShoppingCartContext';
import { toast } from 'react-toastify';
import { useApi } from "../../hooks/useApi.ts";
import { ProductResponse } from "../../utils/types/response/Product/ProductResponse.ts";
import { ProductService } from "../../services/ProductService.ts";

interface ProductDetailsPageProps {}

const ProductDetailsPage: React.FC<ProductDetailsPageProps> = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [product, setProduct] = useState<ProductResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { id } = useParams();

    const cart = useContext(ShoppingCartContext);
    const api = useApi();
    const productService = new ProductService();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await api.getAvailableProductById(Number(id));

                if (response.data && Array.isArray(response.data)) {
                    setProduct(response.data[0]);
                } else {
                    setError("Os dados recebidos estão em um formato inválido");
                    toast.error("Os dados recebidos estão em um formato inválido");
                }
            } catch (error) {
                setError("Ocorreu um erro ao carregar o produto");
                toast.error("Ocorreu um erro ao carregar o produto");
            } finally {
                setLoading(false);
            }
        }

        fetchProduct();
    }, [id]);

    const handleAddProductOnCart = () => {
        if (!product) return;

        cart?.addCartProduct(product);
        toast.success("Produto adicionado ao carrinho!");
    }

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 20 }}>
                <CircularProgress size={60} />
            </Box>
        );
    }

    if (error || !product) {
        return (
            <Box sx={{ textAlign: 'center', mt: 20 }}>
                <Typography variant="h5" color="error">
                    {error || "Produto não encontrado"}
                </Typography>
                <Button
                    variant="outlined"
                    sx={{ mt: 2 }}
                    onClick={() => window.location.reload()}
                >
                    Tentar novamente
                </Button>
            </Box>
        );
    }

    return (
        <Grid2
            container
            sx={{
                mt: { xs: 15, md: 20 },
                width: '100%',
                mb: 10,
                px: { xs: 2, md: 4 }
            }}
            spacing={4}
        >
            <Grid2
                container
                xs={12}
                md={6}
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    p: { xs: 0, md: 4 }
                }}
            >
                <Box
                    sx={{
                        width: '100%',
                        maxWidth: '600px',
                        height: { xs: '300px', md: '490px' },
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#f9f9f9',
                        borderRadius: '8px',
                        p: 2
                    }}
                >
                    <Box
                        component='img'
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            maxHeight: '100%'
                        }}
                    />
                </Box>
            </Grid2>

            <Grid2
                xs={12}
                md={6}
                sx={{
                    p: { xs: 2, md: 4 }
                }}
            >
                <Box sx={{ mb: 3 }}>
                    <Chip
                        label={product.category?.name || 'Sem categoria'}
                        color="secondary"
                        size="small"
                        sx={{ mb: 1 }}
                    />
                    <Typography
                        variant="h3"
                        fontWeight={700}
                        fontFamily={'Public Sans'}
                        sx={{ mb: 1 }}
                    >
                        {product.name}
                    </Typography>
                    <Typography
                        variant="h4"
                        color="primary"
                        fontWeight={600}
                        fontFamily={'Public Sans'}
                        sx={{ mb: 3 }}
                    >
                        {productService.formatProductPrice(product.salePrice)}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                </Box>

                <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" fontWeight={500} sx={{ mb: 1 }}>
                        Descrição
                    </Typography>
                    <Typography variant="body1" paragraph>
                        {product.description || 'Nenhuma descrição disponível.'}
                    </Typography>
                </Box>

                <Box sx={{ mb: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                        Vendido por: <strong>Lares Encanto</strong>
                    </Typography>
                    {product.pricingGroup && (
                        <Typography variant="body2" color="text.secondary">
                            Grupo: <strong>{product.pricingGroup.name}</strong>
                        </Typography>
                    )}
                </Box>

                <Box sx={{ mt: 4 }}>
                    <Button
                        data-cy="btn-add-to-cart"
                        variant='contained'
                        size="large"
                        fullWidth={isMobile}
                        sx={{
                            height: '56px',
                            fontWeight: 700,
                            fontSize: '1rem',
                            bgcolor: 'black',
                            '&:hover': {
                                bgcolor: 'grey.900',
                            }
                        }}
                        onClick={handleAddProductOnCart}
                    >
                        Adicionar ao carrinho - {productService.formatProductPrice(product.salePrice)}
                    </Button>
                </Box>
            </Grid2>
        </Grid2>
    );
};

export default ProductDetailsPage;