import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import {Button, Divider} from "@mui/material";
import React from "react";
import {Link} from "react-router-dom";

interface MyProfileSidenavComponentProps{
}
const MyProfileSidenavComponent: React.FC<MyProfileSidenavComponentProps> = () => {
    return(
        <Grid2
            container
            xs={2}
            spacing={2}
        >
            <Grid2 sx={{ pl: 5 }}>
                <Divider />
                <Button
                    variant='text'
                    sx={{ color: 'black', m: 1, display: "flex", justifyContent:"start" }}
                    component={Link}
                    to={'/my-profile'}
                >
                    Minhas Informações
                </Button>
                <Button
                    variant='text'
                    sx={{ color: 'black', m: 1, display: "flex", justifyContent:"start"  }}
                    component={Link}
                    to={'/my-orders'}
                >
                    Meus Pedidos
                </Button>
                <Button
                    variant='text'
                    sx={{ color: 'black', m: 1, display: "flex", justifyContent:"start"  }}
                    component={Link}
                    to={'/my-coupons'}
                >
                    Meus cupons
                </Button>
                <Button
                    variant='text'
                    sx={{ color: 'black', m: 1, display: "flex", justifyContent:"start"  }}
                    component={Link}
                    to={'/my-cards'}
                >
                    Meus cartões
                </Button>
            </Grid2>
        </Grid2>
    );
};

export default MyProfileSidenavComponent;