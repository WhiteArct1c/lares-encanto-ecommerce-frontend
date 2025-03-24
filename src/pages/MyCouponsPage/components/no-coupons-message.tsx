import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import {LocalOfferRounded} from "@mui/icons-material";

const NoCouponsMessage = () => {
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100%"
            mt="50px"
        >
            <LocalOfferRounded style={{ fontSize: 64, color: '#757575' }} />
            <Typography variant="h5" color="textSecondary" mt={2}>
                Você não possui nenhum cupom.
            </Typography>
        </Box>
    );
};

export default NoCouponsMessage;
