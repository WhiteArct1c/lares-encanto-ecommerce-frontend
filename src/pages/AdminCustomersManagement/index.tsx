import { Menu, MenuItem, Typography } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import React, { useEffect } from 'react';
import AdminSidenavComponent from '../../shared/AdminSidenavComponent';
import { DataGrid, GridActionsCellItem, GridColDef, GridPaginationModel, GridRowId, GridRowsProp } from '@mui/x-data-grid';
import { useApi } from '../../hooks/useApi';
import { ResponseCustomer } from '../../utils/types/ResponseCustomer';
import { MoreVert } from '@mui/icons-material';
import { OK } from '../../utils/constants/apiCodes.ts';
import TransactionHistoryDialog from "./components/transaction-history-dialog.tsx";

interface AdminCustomersManagementRows{
   id: number;
   fullName: string;
   cpf: string;
   birthDate: string;
   ranking: string;
   role: string;
   isActive: string;
}

const AdminCustomersManagement: React.FC = () => {
   const [customersRows, setCustomersRows] = React.useState<AdminCustomersManagementRows[]>([]);
   const paginationModelRef = React.useRef<{ page: number, pageSize: number }>({
      page: 0,
      pageSize: 10,
   });
   const [isLoading, setIsLoading] = React.useState(false);
   const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
   const subMenuUserIsOpen = Boolean(anchorEl);
   const [selectedUser, setSelectedUser] = React.useState<AdminCustomersManagementRows | undefined>();
   const [dialogOpen, setDialogOpen] = React.useState(false);

   const api = useApi();

   const usersTableColumns: GridColDef[] = [
      { field: 'id', headerName: 'ID', width: 90 },
      { field: 'fullName', headerName: 'Nome completo', width: 200 },
      { field: 'cpf', headerName: 'CPF', width: 200 },
      {
         field: 'birthDate',
         headerName: 'Data de nascimento',
         width: 200,
      },
      {
         field: 'ranking',
         headerName: 'Ranking',
         width: 200,
      },
      {
         field: 'role',
         headerName: 'Tipo de usuário',
         width: 200,
      },
      {
         field: 'isActive',
         headerName: 'Ativo',
         width: 100,
      },
      {
         field: 'actions',
         type: 'actions',
         headerName: 'Ações',
         width: 100,
         cellClassName: 'actions',
         sortable: false,
         getActions: ({ id }) => {
            return [
               <GridActionsCellItem
                  icon={<MoreVert/>}
                  label="userSubMenu"
                  data-cy={`user-submenu-button-${customersRows.find((user) => user.id === id)?.fullName}`}
                  onClick={(event) => handleUserSubMenuClick(event, id)}
                  color='inherit'
               />
            ]
         }
      }  
   ];

   const handleUserSubMenuClick = (event: React.MouseEvent<HTMLButtonElement>, userId: GridRowId) => {
      setAnchorEl(event.currentTarget);
      setSelectedUser(customersRows.find((user) => user.id === userId));
   }; 

   const handleUserSubMenuClose = () => {
      setAnchorEl(null);
   };

   const handlePageChange = (newPaginationModel: GridPaginationModel) => {
      paginationModelRef.current = {
         page: newPaginationModel.page,
         pageSize: newPaginationModel.pageSize,
      };
      
      getCustomersInfo();
   };

   const getCustomersInfo = async () => {
      setIsLoading(true);

      try {
         const response = await api.listAllCustomers(paginationModelRef.current.page, paginationModelRef.current.pageSize);
   
         const rows = response.content.map((customer: ResponseCustomer) => ({
            id: customer.id,
            fullName: customer.fullName,
            cpf: customer.cpf,
            birthDate: customer.birthDate,
            ranking: customer.ranking,
            role: customer.userRole,
            isActive: customer.isActive === "1" ? 'Sim' : 'Não',
         }));
   
         setCustomersRows(rows);
      } catch (error) {
         console.error('Error fetching customers:', error);
      } finally {
         setIsLoading(false);
      }
   };

   const handleInnactivateUser = async () => {
      if (selectedUser) {
         const apiCall = selectedUser.isActive === 'Sim' ? api.deactivateUserById : api.activateUserById;
         const response = await apiCall(selectedUser.id);
         if (response.code === OK) {
            getCustomersInfo();
         }
      }
      handleUserSubMenuClose();
   };

   const handleShowTransactionHistory = () => {
      setDialogOpen(true);
   }

   useEffect(() => {
      getCustomersInfo();
   }, []);

   return(
      <>
         <Grid2 container xs={12} sx={{mb:30}}>
            <Grid2 xs={12} sx={{ pl: 32,  mt: 5}}>
                <Typography fontFamily={'Public Sans'} fontSize={40} sx={{mb: 5, ml: 4}}>
                    Usuários
                </Typography>
            </Grid2>
            <AdminSidenavComponent/>
            <Grid2 xs sx={{
               mr:10,
               gap: '20px',
               marginTop: '20px'
            }}>
               <DataGrid
                  autoHeight
                  rows={customersRows as GridRowsProp}
                  columns={usersTableColumns}
                  paginationModel={paginationModelRef.current}
                  onPaginationModelChange={handlePageChange}
                  pageSizeOptions={[5, 10, 20]}
                  disableRowSelectionOnClick
                  loading={isLoading}
               />
            </Grid2>
         </Grid2>

         <Menu
            id="user-submenu-menu"
            anchorEl={anchorEl}
            open={subMenuUserIsOpen}
            onClose={handleUserSubMenuClose}
            data-cy="user-submenu"
         >
            <MenuItem 
               data-cy="user-submenu-inactivate" 
               onClick={handleInnactivateUser}
            >
               {
                  selectedUser?.isActive === 'Sim' ? 'Inativar' : 'Ativar'
               }
            </MenuItem>
            <MenuItem
               data-cy="user-submenu-transaction-history"
               onClick={handleShowTransactionHistory}
            >
               Histórico de transações
            </MenuItem>
         </Menu>

         <TransactionHistoryDialog
             open={dialogOpen}
             onClose={() => setDialogOpen(false)}
             userName={selectedUser?.fullName}
         />
      </>
   )
};

export default AdminCustomersManagement;