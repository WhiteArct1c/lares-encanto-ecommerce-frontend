import React from 'react';
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import {RowData} from "../index.tsx";
import {Box, Card, CardHeader, TextField, Typography} from "@mui/material";


interface DevolutionFormComponentProps{
    items:  RowData[]
}

const DevolutionFormComponent: React.FC<DevolutionFormComponentProps> = ({items}) => {
    return (
        <Grid2 xs={12} sx={{display: 'flex', flexDirection:'column', gap:3, width:'100%' }}>
            <Typography fontFamily={'Public sans'}>
                Items selecionados:
            </Typography>
            <Box sx={{display:'flex', gap:3, maxWidth: 600, flexWrap:'wrap'}}>
                {
                    items.map((item: RowData, index: number) => {
                        return(
                            <Card key={index} sx={{
                                width:'250px',
                                display: 'flex',
                                flexDirection:'column',
                                justifyContent:'center',
                                alignItems:'center',
                                gap:1
                            }}>
                                <CardHeader
                                    title={item.productName}
                                />
                                Quantidade: {item.productQtd}
                            </Card>
                        )
                    })
                }
            </Box>
            <Grid2 xs={12} sx={{display:'flex', gap:3, flexDirection:'column'}}>
                <TextField
                    label="Motivo da devolução"
                    multiline
                    fullWidth
                    rows={5}
                />
            </Grid2>
        </Grid2>
    )
};

export default DevolutionFormComponent;