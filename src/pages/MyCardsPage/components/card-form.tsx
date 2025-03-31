import React, {ChangeEvent, useContext, useEffect, useState} from 'react';
import {
    Button,
    DialogActions,
    FormControlLabel, FormGroup,
    InputAdornment,
    styled,
    Switch,
    SwitchProps,
    TextField
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {getCardFlag} from "../../../utils/getCardFlag.ts";
import {AuthContext} from "../../../contexts/Auth/AuthContext.tsx";
import {toast} from "react-toastify";
import {CreditCardRequest} from "../../../utils/types/request/CreditCard/CreditCardRequest.ts";
import {ResponseAPI} from "../../../utils/types/response/ResponseAPI.ts";
import {CREATED, OK} from "../../../utils/types/apiCodes.ts";
import {useApi} from "../../../hooks/useApi.ts";

const createCardSchema = z.object({
    cardNumber: z.string()
    .trim()
        .max(16, 'O número do cartão deve conter no máximo 16 dígitos!')
        .min(13, 'O número do cartão deve conter no mínimo 13 dígitos!'),
    cardName: z.string()
        .min(1, 'Este campo é obrigatório'),
    cardCode: z.coerce.number({
        invalid_type_error: 'Este campo deve conter apenas números!'
    })
        .min(1, 'O código de segurança do cartão é obrigatório!')
});

type CardFormData = z.infer<typeof createCardSchema>;

interface CardFormProps{
    handleClose: () => void;
    handleCardAdded: () => void;
    creditCards: CreditCardRequest[];
    creditCardSelected: CreditCardRequest | null;
}

const CardForm: React.FC<CardFormProps> = ({ handleClose, handleCardAdded, creditCards, creditCardSelected }) => {
    const [flag, setFlag] = useState('');
    const [isDefault, setIsDefault] = useState(false);
    const auth = useContext(AuthContext);
    const api = useApi();

    const {
        register,
        handleSubmit,
        formState: {
            errors
        },
        setValue
    } = useForm<CardFormData>({
        resolver: zodResolver(createCardSchema),
    });

    const handleSwitchChange = (event: ChangeEvent<HTMLInputElement>) => {
        setIsDefault(event.target.checked);
    };

    const handleCardNumberChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        const cardFlag = getCardFlag(value);
        setFlag(cardFlag);
    };

    const IOSSwitch = styled((props: SwitchProps) => (
        <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
    ))(({ theme }) => ({
        width: 42,
        height: 26,
        padding: 0,
        '& .MuiSwitch-switchBase': {
            padding: 0,
            margin: 2,
            transitionDuration: '300ms',
            '&.Mui-checked': {
                transform: 'translateX(16px)',
                color: '#fff',
                '& + .MuiSwitch-track': {
                    backgroundColor: theme.palette.mode === 'dark' ? '#000' : '#000',
                    opacity: 1,
                    border: 0,
                },
                '&.Mui-disabled + .MuiSwitch-track': {
                    opacity: 0.5,
                },
            },
            '&.Mui-focusVisible .MuiSwitch-thumb': {
                color: '#000   ',
                border: '6px solid #fff',
            },
            '&.Mui-disabled .MuiSwitch-thumb': {
                color:
                    theme.palette.mode === 'light'
                        ? theme.palette.grey[600]
                        : theme.palette.grey[600],
            },
            '&.Mui-disabled + .MuiSwitch-track': {
                opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
            },
        },
        '& .MuiSwitch-thumb': {
            boxSizing: 'border-box',
            width: 22,
            height: 22,
        },
        '& .MuiSwitch-track': {
            borderRadius: 26 / 2,
            backgroundColor: theme.palette.mode === 'light' ? '#C2C2C2' : '#C2C2C2',
            opacity: 1,
            transition: theme.transitions.create(['background-color'], {
                duration: 500,
            }),
        },
    }));

    const updateCard = (data: CardFormData) => {
        if(flag === 'Bandeira inválida'){
            toast.error('A bandeira do cartão é inválida!');
            return;
        }

        if(auth.user && creditCardSelected){
            const request: CreditCardRequest = {
                token: localStorage.getItem('authToken'),
                id: creditCardSelected!.id,
                cardNumber: Number(data.cardNumber.replace(/\D/gi, '')),
                cardName: data.cardName,
                cardCode: data.cardCode,
                mainCard: isDefault,
                cardFlag: flag
            }

            api.updateCreditCard(request).then((response: ResponseAPI) => {
                if(response.code === OK){
                    toast.success(response.message);
                    handleClose();
                    handleCardAdded();
                }else{
                    toast.error(response.message);
                }
            })
        }
    }

    const createCard = (data: CardFormData) => {
        if(flag === 'Bandeira inválida'){
            toast.error('A bandeira do cartão é inválida!');
            return;
        }

        if(auth.user){
            const request: CreditCardRequest = {
                token: localStorage.getItem('authToken'),
                id: null,
                cardNumber: Number(data.cardNumber.replace(/\D/gi, '')),
                cardName: data.cardName,
                cardCode: data.cardCode,
                mainCard: creditCards.length ? isDefault : true,
                cardFlag: flag
            }

            auth.createCreditCard(request).then((response: ResponseAPI) => {
                if(response.code === CREATED){
                    toast.success(response.message);
                    handleClose();
                    handleCardAdded();
                }else{
                    toast.error(response.message);
                }
            })
        }
    };

    useEffect(() => {
        if(creditCardSelected){
            const { cardNumber, cardName, cardFlag, cardCode, mainCard } = creditCardSelected;
            setFlag(cardFlag);
            setIsDefault(mainCard);
            setValue('cardNumber', cardNumber.toString());
            setValue('cardName', cardName);
            setValue('cardCode', cardCode);
        }
    }, [creditCardSelected, setValue]);

    return (
        <Grid2 xs
               component={'form'}
               sx={{display: 'flex', flexDirection:'column', gap:2, mt:1, width:'500px'}}
               onSubmit={creditCardSelected === null ? handleSubmit(createCard) : handleSubmit(updateCard)}
        >
            <TextField
                fullWidth
                variant='outlined'
                label='Número do cartão'
                data-cy="txt-card-number"
                required          
                {...register('cardNumber')}
                InputProps={{
                    endAdornment: <InputAdornment data-cy="card-flag" position='end'>{flag}</InputAdornment>
                }}
                InputLabelProps={{
                    shrink: true
                }}
                error={!!errors.cardNumber}
                helperText={errors?.cardNumber?.message}
                onChange={handleCardNumberChange}
            />
            <TextField
                fullWidth
                variant='outlined'
                label='Nome impresso no cartão'
                data-cy="txt-card-name"
                required
                {...register('cardName')}
                InputLabelProps={{
                    shrink: true,
                }}
                error={!!errors.cardName}
                helperText={errors?.cardName?.message}
            />
            <TextField
                fullWidth
                variant='outlined'
                data-cy="txt-card-code"
                label='CVV'
                required
                {...register('cardCode')}
                InputLabelProps={{
                    shrink: true,
                }}
                error={!!errors.cardCode}
                helperText={errors?.cardCode?.message}
            />
            {
                creditCards.length >= 1 ?
                    <FormGroup sx={{display:'flex', flexDirection:'row', alignItems:'center', ml:1}}>
                        <FormControlLabel
                            control={<IOSSwitch data-cy="switcher-main-card" checked={isDefault} onChange={handleSwitchChange} sx={{ m: 1 }}/>}
                            label="Definir como principal"
                        />
                    </FormGroup>
                    :
                    <></>
            }
            <DialogActions>
                <Button data-cy="btn-cancel-add-card" onClick={handleClose}>Cancelar</Button>
                <Button data-cy="btn-confirm-add-card" type='submit'>Salvar</Button>
            </DialogActions>
        </Grid2>
    );
}

export default CardForm;