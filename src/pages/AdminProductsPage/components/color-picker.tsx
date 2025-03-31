import React, { useState } from "react";
import { Button, Popover, Box } from "@mui/material";
import { SketchPicker, ColorResult } from "react-color";

interface ColorPickerProps {
    value: string;
    onChange: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ value, onChange }) => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    // Função para abrir o popover
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    // Função para fechar o popover
    const handleClose = () => {
        setAnchorEl(null);
    };

    // Função para atualizar a cor selecionada
    const handleColorChange = (newColor: ColorResult) => {
        onChange(newColor.hex);
    };

    const open = Boolean(anchorEl); // Verifica se o popover está aberto
    const id = open ? "color-picker-popover" : undefined; // ID para o popover

    return (
        <>
            <Button
                variant="contained"
                onClick={handleClick}
                style={{ backgroundColor: value }}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: '#000',
                    fontWeight: 800,
                    '&:hover': {
                        bgcolor: '#fff',
                        color: '#000'
                    }
                }}
            >
                Cor do produto: {value}
            </Button>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
            >
                <Box p={2}>
                    <SketchPicker
                        color={value}
                        onChangeComplete={handleColorChange}
                    />
                </Box>
            </Popover>
        </>
    );
};

export default ColorPicker;