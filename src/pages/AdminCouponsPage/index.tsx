import React, {useEffect, useRef, useState} from "react";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import {Button, Dialog, DialogContent, DialogTitle, Tooltip, Typography, Chip} from "@mui/material";
import AdminSidenavComponent from "../../shared/AdminSidenavComponent";
import {useApi} from "../../hooks/useApi.ts";
import {DataGrid, GridColDef, GridPaginationModel, GridRowsProp} from "@mui/x-data-grid";
import {CouponResponse} from "../../utils/types/response/Coupon/CouponResponse.ts";
import {Add} from "@mui/icons-material";
import CouponForm from "./components/coupon-form.tsx";
import {ProductService} from "../../services/ProductService.ts";
import {toast} from "react-toastify";
import {CREATED} from "../../utils/constants/apiCodes.ts";

interface AdminCouponsPageProps {}

const productService = new ProductService();

const AdminCouponsPage: React.FC<AdminCouponsPageProps> = () => {
    const [open, setOpen] = useState(false);
    const [titleDialog, setTitleDialog] = useState('');
    const [selectedCoupon, setSelectedCoupon] = useState<CouponResponse | null>(null);
    const [couponsRows, setCouponsRows] = useState<CouponResponse[]>([]);
    const paginationModelRef = useRef<{ page: number, pageSize: number }>({
        page: 0,
        pageSize: 10
    });
    const [isLoading, setIsLoading] = useState(false);

    const couponsTableColumns: GridColDef[] = [
        {field: 'id', headerName: 'ID', width: 80},
        {field: 'code', headerName: 'Código', width: 200},
        {
            field: 'value',
            headerName: 'Valor Total',
            width: 150,
            valueFormatter: (params) => {
                return productService.formatProductPrice(params.value);
            },
        },
        {
            field: 'usedValue',
            headerName: 'Valor Usado',
            width: 150,
            valueFormatter: (params) => {
                return productService.formatProductPrice(params.value);
            },
        },
        {
            field: 'availableValue',
            headerName: 'Valor Disponível',
            width: 150,
            valueFormatter: (params) => {
                return productService.formatProductPrice(params.value);
            },
        },
        {
            field: 'expiresAt',
            headerName: 'Expira em',
            width: 200,
            valueFormatter: (params) => {
                if (!params.value) return 'Sem expiração';
                const date = new Date(params.value);
                return date.toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            },
        },
        {
            field: 'isActive',
            headerName: 'Status',
            width: 120,
            renderCell: (params) => {
                const isExpired = params.row.expiresAt && new Date(params.row.expiresAt) < new Date();
                const hasValue = params.row.availableValue > 0;
                const isActive = params.value && !isExpired && hasValue;
                
                if (isExpired) {
                    return <Chip label="Expirado" color="error" size="small" />;
                }
                if (!hasValue) {
                    return <Chip label="Esgotado" color="warning" size="small" />;
                }
                if (params.value) {
                    return <Chip label="Ativo" color="success" size="small" />;
                }
                return <Chip label="Inativo" color="default" size="small" />;
            },
        },
    ];

    const handleClickOpenDialog = (title: string | null, coupon: CouponResponse | null) => {
        if(title !== null){
            setTitleDialog(title)
            setOpen(true);
        }

        if(coupon !== null){
            setSelectedCoupon(coupon);
        }else{
            setSelectedCoupon(null);
        }
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedCoupon(null);
    };

    const handlePageChange = (newPaginationModel: GridPaginationModel) => {
        paginationModelRef.current = {
            page: newPaginationModel.page,
            pageSize: newPaginationModel.pageSize,
        };

        setIsLoading(true);
        getAllCoupons().then(() => {
            setIsLoading(false);
        });
    };

    const handleCouponAdded = () => {
        setIsLoading(true);
        getAllCoupons().then(() => {
            setIsLoading(false);
            handleClose();
        });
    }

    const handleToggleCouponStatus = async (coupon: CouponResponse) => {
        try {
            setIsLoading(true);
            let response;
            
            if (coupon.isActive) {
                response = await api.deactivateCoupon(coupon.id);
                toast.success('Cupom desativado com sucesso!');
            } else {
                response = await api.activateCoupon(coupon.id);
                toast.success('Cupom ativado com sucesso!');
            }
            
            await getAllCoupons();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Erro ao alterar status do cupom');
        } finally {
            setIsLoading(false);
        }
    };

    const getAllCoupons = async () => {
        try {
            const response = await api.getAllPromotionalCoupons();
            
            const rows = response.data.map((coupon: CouponResponse) => ({
                id: coupon.id,
                code: coupon.code,
                value: coupon.value,
                usedValue: coupon.usedValue,
                availableValue: coupon.availableValue,
                isActive: coupon.isActive,
                expiresAt: coupon.expiresAt,
                customerId: coupon.customerId,
                couponType: coupon.couponType
            }));

            setCouponsRows(rows);
        } catch (error: any) {
            toast.error('Erro ao carregar cupons promocionais');
        }
    }

    const api = useApi();

    useEffect(() => {
        setIsLoading(true);
        getAllCoupons().then(() => {
            setIsLoading(false);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Grid2 container xs={12} sx={{mb:30}}>
            <Grid2 xs={12} sx={{ pl: 32,  mt: 5}}>
                <Typography fontFamily={'Public Sans'} fontSize={40} sx={{mb: 5, ml: 4}}>
                    Cupons Promocionais
                </Typography>
            </Grid2>
            <AdminSidenavComponent/>
            <Grid2 xs sx={{
                mr: 5,
                ml: 5,
                gap: '20px',
                marginTop: '20px'
            }}>
                <Tooltip title='Criar novo cupom promocional'>
                    <Button
                        data-cy="btn-add-new-coupon"
                        variant="contained"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            bgcolor: '#000',
                            fontWeight: 800,
                            '&:hover': {
                                bgcolor: '#fff',
                                color: '#000'
                            },
                            mb: 2
                        }}
                        onClick={() => handleClickOpenDialog('Criar Cupom Promocional', null)}
                        endIcon={<Add/>}
                    >
                        Criar Cupom
                    </Button>
                </Tooltip>
                <DataGrid
                    autoHeight
                    rows={couponsRows as GridRowsProp}
                    columns={couponsTableColumns}
                    paginationModel={paginationModelRef.current}
                    onPaginationModelChange={handlePageChange}
                    pageSizeOptions={[5, 10, 20]}
                    disableRowSelectionOnClick
                    loading={isLoading}
                    getRowHeight={() => 'auto'}
                    onRowDoubleClick={(params) => {
                        handleClickOpenDialog('Editar Cupom Promocional', params.row as CouponResponse);
                    }}
                />
            </Grid2>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>{titleDialog}</DialogTitle>
                <DialogContent>
                    <CouponForm
                        handleClose={handleClose}
                        handleCouponAdded={handleCouponAdded}
                        selectedCoupon={selectedCoupon}
                    />
                </DialogContent>
            </Dialog>
        </Grid2>
    )
}

export default AdminCouponsPage;

