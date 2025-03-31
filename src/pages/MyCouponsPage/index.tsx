import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import {Divider, Typography} from "@mui/material";
import MyProfileSidenavComponent from "../../shared/MyProfileSidenavComponent";
import React from "react";
import NoCouponsMessage from "./components/no-coupons-message.tsx";

interface MyCouponsPageProps {}

const MyCouponsPage: React.FC<MyCouponsPageProps> = () => {
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
                    <NoCouponsMessage/>
            </Grid2>
        </Grid2>
    );
};

export default MyCouponsPage;