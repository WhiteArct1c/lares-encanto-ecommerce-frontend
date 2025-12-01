import React, {useState} from 'react';
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import {Box, Tab, Typography} from "@mui/material";
import AdminSidenavComponent from "../../shared/AdminSidenavComponent";
import {TabContext, TabList, TabPanel} from "@mui/lab";
import PendingExchangesComponent from "./components/pending-exchanges-component.tsx";
import AllExchangesComponent from "./components/all-exchanges-component.tsx";

const AdminExchangesPage: React.FC = () => {

    const [tab, setTab] = useState("pending-exchanges");
    const handleChange = (_event: React.SyntheticEvent, newTab: string) => {
        setTab(newTab);
    };

    return (
        <Grid2 container xs={12} sx={{mb:30}}>
            <Grid2 xs={12} sx={{ pl: 32,  mt: 5}}>
                <Typography fontFamily={'Public Sans'} fontSize={40} sx={{mb: 5, ml: 4}}>
                    Trocas/Devoluções
                </Typography>
            </Grid2>
            <AdminSidenavComponent/>
            <Grid2 xs sx={{mr:10}}>
                <TabContext value={tab}>
                    <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                        <TabList onChange={handleChange}>
                            <Tab label="Pendentes" value="pending-exchanges"/>
                            <Tab label="Todas" value="all-exchanges"/>
                        </TabList>
                    </Box>
                    <TabPanel value="pending-exchanges">
                        <PendingExchangesComponent/>
                    </TabPanel>
                    <TabPanel value="all-exchanges">
                        <AllExchangesComponent/>
                    </TabPanel>
                </TabContext>
            </Grid2>
        </Grid2>
    );
};

export default AdminExchangesPage;


