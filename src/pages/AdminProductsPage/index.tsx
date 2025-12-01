import React, {useEffect, useRef, useState} from "react";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import {Button, Dialog, DialogContent, DialogTitle, DialogActions, Tooltip, Typography, IconButton, Box} from "@mui/material";
import AdminSidenavComponent from "../../shared/AdminSidenavComponent";
import {useApi} from "../../hooks/useApi.ts";
import {DataGrid, GridColDef, GridPaginationModel, GridRowsProp, GridActionsCellItem} from "@mui/x-data-grid";
import {ProductResponse} from "../../utils/types/response/Product/ProductResponse.ts";
import {Add, Edit, Delete} from "@mui/icons-material";
import ProductForm from "./components/product-form.tsx";
import { ImageService } from "../../services/ImageService.ts";
import {ProductEditRequest} from "../../utils/types/request/Product/ProductEditRequest.ts";
import { toast } from "react-toastify";
import { OK } from "../../utils/constants/apiCodes.ts";

interface AdminProductsPageProps {}

const AdminProductsPage: React.FC<AdminProductsPageProps> = () => {
    const [open, setOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<ProductResponse | null>(null);
    const [titleDialog, setTitleDialog] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<ProductResponse | null>(null);
    const [productsRows, setProductsRows] = useState<ProductResponse[]>([]);
    const paginationModelRef = useRef<{ page: number, pageSize: number }>({
        page: 0,
        pageSize: 10
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const productsTableColumns: GridColDef[] = [
        {field: 'id', headerName: 'ID'},
        {field: 'name', headerName: 'Nome', width: 180},
        {field: 'type', headerName: 'Tipo'},
        {
            field: 'salePrice',
            headerName: 'Preço de venda',
            width: 180,
            valueFormatter: (params) => {
                return new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                }).format(params.value);
            },
        },
        {field: 'stockQuantity', headerName: 'Qtd.'},
        {
            field: 'pricingGroup',
            headerName: 'Grupo de Precificação',
            width: 210,
            valueGetter: (params) => `${params.value?.profitMargin}% - ${params.value?.name}` || '-',
        },
        {
            field: 'category', //TODO: categoria nao está sendo exibida
            headerName: 'Categoria',
            width: 130,
            valueGetter: (params) => params.value?.id || '-',
        },
        {
            field: 'isActive',
            headerName: 'Ativo',
            valueFormatter: (params) => params.value ? 'SIM' : 'NÃO',
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Ações',
            width: 150,
            getActions: (params) => [
                <GridActionsCellItem
                    icon={<Edit />}
                    label="Editar"
                    onClick={() => handleEdit(params.row)}
                />,
                <GridActionsCellItem
                    icon={<Delete />}
                    label="Excluir"
                    onClick={() => handleDeleteClick(params.row)}
                />,
            ],
        },
    ];

    const handleEdit = (product: ProductResponse) => {
        setSelectedProduct(product);
        setTitleDialog('Editar Produto');
        setOpen(true);
    };

    const handleDeleteClick = (product: ProductResponse) => {
        setProductToDelete(product);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!productToDelete) return;
        
        setIsDeleting(true);
        try {
            const response = await api.deleteProduct(productToDelete.id);
            
            if (response.code === OK || response.code === '200 OK') {
                toast.success('Produto excluído com sucesso!');
                setDeleteDialogOpen(false);
                setProductToDelete(null);
                setIsLoading(true);
                getAllProducts().then(() => {
                    setIsLoading(false);
                });
            } else {
                toast.error(response.message || 'Erro ao excluir produto');
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Erro ao excluir produto');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setProductToDelete(null);
    };

    const handleClickOpenDialog = (title: string | null) => {
        if(title !== null){
            setTitleDialog(title);
            setSelectedProduct(null);
            setOpen(true);
        }
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedProduct(null);
    };

    const handlePageChange = (newPaginationModel: GridPaginationModel) => {
        paginationModelRef.current = {
            page: newPaginationModel.page,
            pageSize: newPaginationModel.pageSize,
        };

        setIsLoading(true);
        getAllProducts().then(() => {
            setIsLoading(false);
        });
    };

    const handleProductAdded = () => {
        setIsLoading(true);
        getAllProducts().then(() => {
            setIsLoading(false);
        });
    }

    const getAllProducts = async () => {
        const response = await api.listAllProducts(
            paginationModelRef.current.page,
            paginationModelRef.current.pageSize
        );

        const rows = response.data.map((product: ProductResponse) => ({
            ...product,
            id: product.id,
            name: product.name,
            type: product.type,
            description: product.description,
            image: product.image,
            color: product.color,
            salePrice: product.salePrice,
            stockQuantity: product.stockQuantity,
            pricingGroup: product.pricingGroup,
            category: product.category,
            isActive: product.isActive
        }));

        setProductsRows(rows);
    }

    const api = useApi();

    useEffect(() => {
        setIsLoading(true);
        getAllProducts().then(() => {
            setIsLoading(false);
        });
    }, []);

    return (
        <Grid2 container xs={12} sx={{mb:30}}>
            <Grid2 xs={12} sx={{ pl: 32,  mt: 5}}>
                <Typography fontFamily={'Public Sans'} fontSize={40} sx={{mb: 5, ml: 4}}>
                    Produtos
                </Typography>
            </Grid2>
            <AdminSidenavComponent/>
            <Grid2 xs sx={{
                mr: 5,
                ml: 5,
                gap: '20px',
                marginTop: '20px'
            }}>
                <Tooltip title='Adicionar produtos'>
                    <Button
                        data-cy="btn-add-new-product"
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
                         onClick={() => handleClickOpenDialog('Adicionar produto')}
                        endIcon={<Add/>}
                    >
                        Adicionar
                    </Button>
                </Tooltip>
                <DataGrid
                    autoHeight
                    rows={productsRows as GridRowsProp}
                    columns={productsTableColumns}
                    paginationModel={paginationModelRef.current}
                    onPaginationModelChange={handlePageChange}
                    pageSizeOptions={[5, 10, 20]}
                    disableRowSelectionOnClick
                    loading={isLoading}
                />
            </Grid2>

            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>{titleDialog}</DialogTitle>
                <DialogContent>
                    <ProductForm
                        handleClose={handleClose}
                        handleProductAdded={handleProductAdded}
                        initialData={selectedProduct}
                    />
                </DialogContent>
            </Dialog>

            <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
                <DialogTitle>Confirmar Exclusão</DialogTitle>
                <DialogContent>
                    <Typography>
                        Tem certeza que deseja excluir o produto <strong>{productToDelete?.name}</strong>?
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Esta ação não pode ser desfeita.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel} disabled={isDeleting}>
                        Cancelar
                    </Button>
                    <Button 
                        onClick={handleDeleteConfirm} 
                        color="error" 
                        variant="contained"
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Excluindo...' : 'Excluir'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid2>
    )
}

export default AdminProductsPage;