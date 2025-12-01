import {Box, Button, Card, CardContent, CardMedia, Typography} from "@mui/material";
import 'animate.css';
import React from "react";
import {StarRounded} from "@mui/icons-material";

interface SelectResultStepComponentProps {
    imageUrl: string;
    name: string;
    onDislike: () => void;
    onLike: () => void;
}

const SelectResultStepComponent: React.FC<SelectResultStepComponentProps> = ({imageUrl, name, onDislike, onLike}) => {
    return (
        <Box
            sx={{
                width: "450px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: 2,
                margin: 3,
                textAlign: "center",
                position: "relative",
                backgroundColor: "#fff",
            }}
        >
            {/* Título */}
            <Typography
                variant="h6"
                fontFamily="Lexend"
                fontSize="2rem"
                fontWeight="bold"
                sx={{ marginBottom: 1 }}
            >
                Que tal este aqui?
            </Typography>

            <Box
                sx={{
                    display: "flex"
                }}
            >
                {/* Estrelas animadas */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-around",
                        margin: 3
                    }}
                >
                    <StarRounded
                        color='warning'
                        className="animate__animated animate__pulse animate__infinite"
                        fontSize="large"
                    />
                    <StarRounded
                        color='warning'
                        className="animate__animated animate__pulse animate__infinite animate__delay-2s"
                        fontSize="large"
                    />
                    <StarRounded
                        color='warning'
                        className="animate__animated animate__pulse animate__infinite animate__delay-4s"
                        fontSize="large"
                    />
                </Box>
                {/* Cartão do produto */}
                <Card sx={{ maxWidth: 250, boxShadow: "none", border: "1px solid #ddd", borderRadius: 2 }}>
                    <CardMedia component="img" height="300" image={imageUrl} alt={name} />
                    <CardContent>
                        <Typography variant="h6" fontWeight="bold">
                            {name}
                        </Typography>
                    </CardContent>
                </Card>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-around",
                        margin: 3
                    }}
                >
                    <StarRounded
                        color='warning'
                        className="animate__animated animate__pulse animate__infinite"
                        fontSize="large"
                    />
                    <StarRounded
                        color='warning'
                        className="animate__animated animate__pulse animate__infinite animate__delay-2s"
                        fontSize="large"
                    />
                    <StarRounded
                        color='warning'
                        className="animate__animated animate__pulse animate__infinite animate__delay-4s"
                        fontSize="large"
                    />
                </Box>
            </Box>

            {/* Botões */}
            <Box sx={{ display: "flex", gap: 3, marginTop: 5 }}>
                <Button variant="outlined" color="error" onClick={onDislike}>
                    NÃO GOSTEI
                </Button>
                <Button variant="contained" color="success" onClick={onLike}>
                    PERFEITO!
                </Button>
            </Box>
        </Box>
    );
}

export default SelectResultStepComponent;