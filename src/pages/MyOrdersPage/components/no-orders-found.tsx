import {Box, Typography} from "@mui/material";
import {SentimentDissatisfied} from "@mui/icons-material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import React from "react";

interface NoOrdersFoundProps {}

const NoOrdersFound: React.FC<NoOrdersFoundProps> = () => {
    return (
        <Grid2 xs={12}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 1,
                    p: 3,
                    textAlign: 'center'
                }}
            >
                <SentimentDissatisfied
                    sx={{
                        fontSize: 60,
                        color: 'text.secondary',
                        opacity: 0.6
                    }}
                />
                <Typography variant="h6" color="text.secondary">
                    Nenhum pedido encontrado
                </Typography>
                <Typography variant="body2" color="text.disabled">
                    Parece que você ainda não fez nenhum pedido
                </Typography>
            </Box>
        </Grid2>
    )
}

export default NoOrdersFound;