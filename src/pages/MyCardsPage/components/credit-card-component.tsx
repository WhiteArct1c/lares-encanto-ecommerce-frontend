import {Card, CardContent, CardHeader, Chip, IconButton, Menu, MenuItem, Typography} from "@mui/material";
import React from "react";
import {CreditCardRequest} from "../../../utils/types/request/CreditCard/CreditCardRequest.ts";
import MoreVertIcon from "@mui/icons-material/MoreVert";

interface CreditCardComponentProps{
    creditCard: CreditCardRequest,
    openDialogBySubmenuFunction: (title: string | null, card: CreditCardRequest) => void
}

const CreditCardComponent: React.FC<CreditCardComponentProps> = ({creditCard, openDialogBySubmenuFunction}) => {

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const mainCardBorderStyle = creditCard.mainCard ? '1px solid #2d2d2d' : '';

    const handleSubMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleSubMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <Card
                data-cy="credit-card"
                variant="outlined" 
                key={creditCard.id} 
                sx={{width:320, borderRadius:2, border:`${mainCardBorderStyle}`}}
            >
                <CardHeader
                    data-cy="credit-card-header"
                    title={creditCard.cardName}
                    subheader={creditCard.cardFlag}
                    action={
                        <IconButton 
                            aria-label="settings"
                            onClick={handleSubMenuClick}
                        >
                            <MoreVertIcon />
                        </IconButton>
                    }
            />
                <CardContent>
                    <Typography
                        data-cy="credit-card-number"
                        component="span"
                        variant="body2"
                        color="text.secondary"
                        sx={{display:'flex', justifyContent:'space-between', alignItems:'center'}}
                    >
                        {creditCard.cardNumber}
                        {creditCard.mainCard &&
                            <Chip
                                data-cy="chip-main-card"
                                label="Principal"
                                sx={{bgcolor:'#484646', color:'#fff'}}
                            />
                        }
                    </Typography>
                </CardContent>
            </Card>
            <Menu
                id="cc-submenu-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleSubMenuClose}
                data-cy="cc-submenu"
            >
                <MenuItem 
                    data-cy="cc-submenu-edit" 
                    onClick={() => openDialogBySubmenuFunction('Alterar cartão de crédito', creditCard)}
                >
                    Editar
                </MenuItem>
                <MenuItem 
                    data-cy="cc-submenu-delete" 
                    onClick={() => openDialogBySubmenuFunction('Excluir cartão de crédito', creditCard)}
                >
                    Excluir
                </MenuItem>
            </Menu>
        </>
    );
}

export default CreditCardComponent;