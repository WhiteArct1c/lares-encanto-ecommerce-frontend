import React, {useEffect, useRef, useState} from "react";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import {Button, Dialog, DialogContent, DialogTitle, Tooltip, Typography} from "@mui/material";
import AdminSidenavComponent from "../../shared/AdminSidenavComponent";
import {useApi} from "../../hooks/useApi.ts";
import {DataGrid, GridColDef, GridPaginationModel, GridRowsProp} from "@mui/x-data-grid";
import {ProductResponse} from "../../utils/types/response/Product/ProductResponse.ts";
import {Add} from "@mui/icons-material";
import {ProductCreateRequest} from "../../utils/types/request/Product/ProductCreateRequest.ts";
import ProductForm from "./components/product-form.tsx";

interface AdminProductsPageProps {}

interface AdminProductsRows {
    id: number;
    name: string;
    type: string;
    salePrice: number;
    stockQuantity: number;
    pricingGroup: string;
    categoryName: string;
    isActive: boolean;
}

const AdminProductsPage: React.FC<AdminProductsPageProps> = () => {
    const [open, setOpen] = useState(false);
    const [titleDialog, setTitleDialog] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<ProductCreateRequest | null>(null);
    const [productsRows, setProductsRows] = useState<AdminProductsRows[]>([]);
    const paginationModelRef = useRef<{ page: number, pageSize: number }>({
        page: 0,
        pageSize: 10
    });
    const [isLoading, setIsLoading] = useState(false);

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
        {field: 'pricingGroup', headerName: 'Grupo de Precificação', width: 210},
        {field: 'categoryName', headerName: 'Categoria', width: 130},
        {
            field: 'isActive',
            headerName: 'Ativo',
            valueFormatter: (params) => params.value ? 'SIM' : 'NÃO',
        },
    ];

    const handleClickOpenDialog = (title: string | null, product: ProductCreateRequest | null) => {
        if(title !== null){
            setTitleDialog(title)
            setOpen(true);
        }

        if(product !== null){
            setSelectedProduct(product);
        }else{
            setSelectedProduct(null);
        }
    };

    const handleClose = () => {
        setOpen(false);
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
            id: product.id,
            name: product.name,
            type: product.type,
            salePrice: product.salePrice,
            stockQuantity: product.stockQuantity,
            pricingGroup: product.pricingGroup,
            categoryName: product.categoryName,
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
                         onClick={() => handleClickOpenDialog('Adicionar produto', null)}
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

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{titleDialog}</DialogTitle>
                <DialogContent>
                    <ProductForm
                        handleClose={handleClose}
                        handleProductAdded={handleProductAdded}
                    />
                </DialogContent>
            </Dialog>
        </Grid2>
    )
}

export default AdminProductsPage;