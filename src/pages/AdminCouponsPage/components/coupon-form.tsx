import { z } from "zod";
import React from "react";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, DialogActions, TextField } from "@mui/material";
import { NumericFormat } from "react-number-format";
import { useApi } from "../../../hooks/useApi.ts";
import { toast } from "react-toastify";
import {CREATED} from "../../../utils/constants/apiCodes.ts";
import {CouponResponse} from "../../../utils/types/response/Coupon/CouponResponse.ts";

// Schema do Zod
const createCouponSchema = z.object({
    code: z.string({
        required_error: "O código é obrigatório",
    }).min(3, "O código deve ter no mínimo 3 caracteres")
      .max(50, "O código deve ter no máximo 50 caracteres")
      .regex(/^[A-Z0-9-_]+$/, "O código deve conter apenas letras maiúsculas, números, hífens e underscores"),
    value: z.coerce.number({
        invalid_type_error: "Este campo deve conter apenas números",
        required_error: "O valor é obrigatório",
    }).positive("O valor deve ser maior que 0")
      .min(0.01, "O valor mínimo é R$ 0,01"),
    expiresAt: z.string().nullable().optional(),
}).refine((data) => {
    if (data.expiresAt) {
        const expirationDate = new Date(data.expiresAt);
        const now = new Date();
        return expirationDate > now;
    }
    return true;
}, {
    message: "A data de expiração deve ser futura",
    path: ["expiresAt"],
});

type CouponFormData = z.infer<typeof createCouponSchema>;

interface CouponFormProps {
    handleClose: () => void;
    handleCouponAdded: () => void;
    selectedCoupon: CouponResponse | null;
}

const CouponForm: React.FC<CouponFormProps> = ({ handleClose, handleCouponAdded, selectedCoupon }) => {
    const api = useApi();
    const isEditMode = !!selectedCoupon;

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<CouponFormData>({
        resolver: zodResolver(createCouponSchema),
        defaultValues: {
            code: selectedCoupon?.code || "",
            value: selectedCoupon?.value || 0,
            expiresAt: selectedCoupon?.expiresAt 
                ? new Date(selectedCoupon.expiresAt).toISOString().slice(0, 16)
                : "",
        },
    });

    const expiresAt = watch("expiresAt");

    const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toUpperCase().replace(/[^A-Z0-9-_]/g, '');
        setValue("code", value, { shouldValidate: true });
    };

    const createCoupon = async (data: CouponFormData) => {
        try {
            const couponData = {
                code: data.code,
                value: data.value,
                expiresAt: data.expiresAt && data.expiresAt.trim() !== "" 
                    ? new Date(data.expiresAt).toISOString() 
                    : null,
                couponType: "PROMOTIONAL" as const,
            };

            if (isEditMode && selectedCoupon) {
                const response = await api.updateCoupon(selectedCoupon.id, couponData);
                if (response.code === CREATED || response.code === "200 OK") {
                    toast.success(response.message || 'Cupom atualizado com sucesso!');
                    handleCouponAdded();
                } else {
                    toast.error(response.message || 'Erro ao atualizar cupom');
                }
            } else {
                const response = await api.createPromotionalCoupon(couponData);
                if (response.code === CREATED || response.code === "200 OK") {
                    toast.success(response.message || 'Cupom criado com sucesso!');
                    handleCouponAdded();
                } else {
                    toast.error(response.message || 'Erro ao criar cupom');
                }
            }
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || 'Erro ao processar cupom';
            toast.error(errorMessage);
        }
    };

    return (
        <Grid2
            component="form"
            container
            spacing={3}
            onSubmit={handleSubmit(createCoupon)}
            sx={{ mt: 1, p: 2, minWidth: 500 }}
        >
            <Grid2 xs={12}>
                <TextField
                    fullWidth
                    label="Código do Cupom"
                    {...register("code")}
                    onChange={handleCodeChange}
                    error={!!errors.code}
                    helperText={errors.code?.message || "Apenas letras maiúsculas, números, hífens e underscores"}
                    disabled={isEditMode}
                    required
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </Grid2>

            <Grid2 xs={12}>
                <NumericFormat
                    customInput={TextField}
                    label="Valor do Cupom (R$)"
                    fullWidth
                    required
                    thousandSeparator="."
                    decimalSeparator=","
                    prefix="R$ "
                    decimalScale={2}
                    fixedDecimalScale
                    error={!!errors.value}
                    helperText={errors.value?.message || "Valor total do desconto disponível"}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    {...register("value")}
                    onValueChange={(values) => {
                        setValue("value", values.floatValue || 0, { shouldValidate: true });
                    }}
                />
            </Grid2>

            <Grid2 xs={12}>
                <TextField
                    fullWidth
                    label="Data de Expiração (Opcional)"
                    type="datetime-local"
                    {...register("expiresAt")}
                    error={!!errors.expiresAt}
                    helperText={errors.expiresAt?.message || "Deixe em branco para cupom sem expiração"}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    inputProps={{
                        min: new Date().toISOString().slice(0, 16)
                    }}
                />
            </Grid2>

            <Grid2 xs={12}>
                <Box sx={{ 
                    p: 2, 
                    bgcolor: 'info.light', 
                    borderRadius: 1,
                    color: 'info.contrastText'
                }}>
                    <strong>Informações:</strong>
                    <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                        <li>O código será convertido automaticamente para maiúsculas</li>
                        <li>O cupom será válido para qualquer cliente</li>
                        <li>Se não informar data de expiração, o cupom não expirará</li>
                    </ul>
                </Box>
            </Grid2>

            <Grid2 xs={12}>
                <DialogActions>
                    <Button onClick={handleClose} variant="outlined">
                        Cancelar
                    </Button>
                    <Button type="submit" variant="contained" sx={{ bgcolor: '#000', '&:hover': { bgcolor: '#333' } }}>
                        {isEditMode ? 'Atualizar' : 'Criar'} Cupom
                    </Button>
                </DialogActions>
            </Grid2>
        </Grid2>
    );
};

export default CouponForm;

