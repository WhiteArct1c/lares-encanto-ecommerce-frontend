import React, { useEffect, useState} from "react";
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider,
    Tooltip,
    Typography
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import MyProfileSidenavComponent from "../../shared/MyProfileSidenavComponent";
import { Add } from "@mui/icons-material";
import CardForm from "./components/card-form.tsx";
import NoCardsMessage from "./components/no-cards-message.tsx";
import { useApi } from "../../hooks/useApi.ts";
import CreditCardComponent from "./components/credit-card-component.tsx";
import {CreditCardRequest} from "../../utils/types/request/CreditCard/CreditCardRequest.ts";
import {OK} from "../../utils/types/apiCodes.ts";
import {toast} from "react-toastify";
interface MyCardsPageProps{

}

const MyCardsPage: React.FC<MyCardsPageProps> = () => {
    const [open, setOpen] = useState(false);
    const [titleDialog, setTitleDialog] = useState('');
    const [creditCards, setCreditCards] = useState<CreditCardRequest[]>([]);
    const [selectedCard, setSelectedCard] = useState<CreditCardRequest | null>(null);
    const api = useApi();

    const handleClickOpenDialog = (title: string | null, card: CreditCardRequest | null) => {
        if(title !== null){
            setTitleDialog(title)
            setOpen(true);
        }

        if(card !== null){
            setSelectedCard(card);
        }else{
            setSelectedCard(null);
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleCardAdded = () => {
        loadCreditCards();
    }

    const deleteCreditCard = async () => {
        if(selectedCard !== null) {
            const response = await api.deleteCreditCard(selectedCard.id!);
            if (response.code === OK) {
                toast.success(response.message);
            }else{
                toast.error(response.message);
            }
        }
        handleClose();
        await loadCreditCards();
    }

    const loadCreditCards = async () => {
        const data = await api.listCreditCards();
        setCreditCards(data.data);
    }

    useEffect(() => {
        loadCreditCards();
    }, []);

    return(
        <Grid2 container xs={12} sx={{mb: 15,}}>
            <Grid2 xs={12} sx={{ pl: 2,  mt: 17}}>
                <Typography fontFamily={'Public Sans'} fontSize={40} sx={{mb: 10, ml: 3}}>
                    Meus Cartões
                </Typography>
            </Grid2>

            <MyProfileSidenavComponent/>

            <Grid2 xs sx={{display:'flex', justifyContent:'start', flexDirection:"column", ml: 10, mr:10, p:2}}>
                <Tooltip title='Adicionar cartões'>
                    <Button
                        data-cy="btn-add-new-card"
                        variant="contained"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width:200,
                            bgcolor: '#000',
                            fontWeight: 800,
                            '&:hover': {
                                bgcolor: '#fff',
                                color: '#000'
                            },
                            mb: 2
                        }}
                        onClick={() => handleClickOpenDialog('Adicionar cartão de crédito', null)}
                        endIcon={<Add/>}
                    >
                        Adicionar cartão
                    </Button>
                </Tooltip>
                <Divider sx={{mb:3}}/>
                {creditCards.length ?
                    <Grid2 container xs sx={{display:'flex', gap:3}}>
                        {
                            creditCards
                                .sort((cardA) => cardA.mainCard ? -1 : 1)
                                .map((creditCard) => (
                                    <CreditCardComponent
                                        key={creditCard.id}
                                        creditCard={creditCard}
                                        openDialogBySubmenuFunction={handleClickOpenDialog}
                                    />
                                ))
                        }
                    </Grid2>
                    :
                    <NoCardsMessage/>
                }
            </Grid2>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{titleDialog}</DialogTitle>
                <DialogContent>
                    {
                        selectedCard !== null && titleDialog === 'Excluir cartão de crédito' ?
                            <Typography>
                                Deseja realmente excluir o cartão de crédito com final {selectedCard.cardNumber.toString().slice(12)}?
                            </Typography>
                            :
                            <CardForm
                                handleClose={handleClose}
                                handleCardAdded={handleCardAdded}
                                creditCards={creditCards}
                                creditCardSelected={selectedCard}
                            />
                    }
                </DialogContent>
                {
                    titleDialog === 'Excluir cartão de crédito' ?
                        <DialogActions>
                            <Button
                                data-cy="btn-cancel-delete-card"
                                onClick={handleClose}
                            >
                                Cancelar
                            </Button>
                            <Button
                                data-cy="btn-confirm-delete-card"
                                onClick={deleteCreditCard}
                            >
                                Confirmar
                            </Button>
                        </DialogActions>
                        :
                        <></>
                }
            </Dialog>
        </Grid2>
    );
}

export default MyCardsPage;