import React, {useState} from "react";
import {
    Accordion,
    AccordionActions,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Dialog, DialogActions, DialogContent, DialogTitle,
    Typography
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import MyProfileSidenavComponent from "../../shared/MyProfileSidenavComponent";
import {DataGrid, GridColDef} from '@mui/x-data-grid';
import {ExpandMore} from "@mui/icons-material";
import ChangeItemsFormComponent from "./components/change-items-form-component.tsx";
import DevolutionFormComponent from "./components/devolution-form-component.tsx";

interface MyOrdersPageProps{

}

const columns: GridColDef[] = [
    {
        field: 'id',
        headerName:'ID',
        width:90
    },
    {
        field: 'productName',
        headerName:'Nome do Produto',
        width:150
    },
    {
        field: 'productQtd',
        headerName:'Quantidade',
        width:90
    }
];

export interface RowData{
    id: number;
    productName: string;
    productQtd: number;
}

const rows: RowData[] = [
    {id: 1, productName: 'Cadeira Flex', productQtd: 1},
    {id: 2, productName: 'Sofá Urban Black', productQtd: 1},
    {id: 3, productName: 'Sofá Urban Black', productQtd: 1},
    {id: 4, productName: 'Sofá Urban Black', productQtd: 1},
    {id: 5, productName: 'Sofá Urban Black', productQtd: 1},
    {id: 6, productName: 'Sofá Urban Black', productQtd: 1},
    {id: 7, productName: 'Mesa Ego White', productQtd: 1}
];

const MyOrdersPage: React.FC<MyOrdersPageProps> = () => {

    const [open, setOpen] = useState(false);
    const [titleDialog, setTitleDialog] = useState('');
    const [selectedRows, setSelectedRows] = useState<RowData[]>([]);

    const handleClickOpenDialog = (value: string) => {
        setTitleDialog(value)
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return(
        <Grid2 container xs={12} sx={{mb: 10}}>
            <Grid2 xs={12} sx={{ pl: 2,  mt: 17}}>
                <Typography fontFamily={'Public Sans'} fontSize={40} sx={{mb: 10, ml: 3}}>
                    Meus Pedidos
                </Typography>
            </Grid2>

            <MyProfileSidenavComponent/>

            <Grid2 xs sx={{mr: 5, ml: 5}}>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMore/>}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        Pedido: #12978867846
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box sx={{width: '100%'}}>
                            <DataGrid
                                rows={rows}
                                columns={columns}
                                initialState={{
                                    pagination: {
                                        paginationModel: {
                                            pageSize: 5,
                                        },
                                    },
                                }}
                                checkboxSelection
                                onRowSelectionModelChange={(ids) => {
                                    const selectedRowData = rows.filter(row => ids.includes(row.id))
                                    setSelectedRows(selectedRowData);
                                }}
                            />
                        </Box>
                    </AccordionDetails>
                    <AccordionActions>
                        <Button sx={{ color: 'black', m: 1 }} onClick={() => handleClickOpenDialog('Troca de produtos')}>Trocar items</Button>
                        <Button sx={{ color: 'black', m: 1 }} onClick={() => handleClickOpenDialog('Devolução de produtos')}>Devolver items</Button>
                    </AccordionActions>
                </Accordion>
            </Grid2>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle sx={{display: 'flex', justifyContent:'center', alignItems:'center'}}>{titleDialog}</DialogTitle>
                <DialogContent>
                    {
                        titleDialog === 'Troca de produtos' ?
                            <ChangeItemsFormComponent items={selectedRows}/>
                            :
                            <DevolutionFormComponent items={selectedRows}/>
                    }
                    <DialogActions>
                        {
                            titleDialog === 'Troca de produtos' ?
                                <Button sx={{ color: 'black', m: 1 }}>Solicitar troca</Button>
                                :<Button sx={{ color: 'black', m: 1 }}>Solicitar devolução</Button>
                        }
                    </DialogActions>
                </DialogContent>
            </Dialog>
        </Grid2>
    );
}

export default MyOrdersPage;