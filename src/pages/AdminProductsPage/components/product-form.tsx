import { z } from "zod";
import React, { useEffect, useState } from "react";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, DialogActions, MenuItem, TextField, Input } from "@mui/material";
import { NumericFormat } from "react-number-format";
import ColorPicker from "./color-picker.tsx";
import { useApi } from "../../../hooks/useApi.ts";
import { toast } from "react-toastify";
import { ProductCategoryResponse } from "../../../utils/types/response/ProductCategory/ProductCategoryResponse.ts";
import { PricingGroupResponse } from "../../../utils/types/response/PricingGroup/PricingGroupResponse.ts";
import {CREATED} from "../../../utils/types/apiCodes.ts";

// Schema do Zod
const createProductSchema = z.object({
    name: z.string({
        required_error: "O nome é obrigatório",
    }),
    description: z.string().max(255, "A descrição deve conter apenas 255 caracteres"),
    price: z.coerce.number({
        invalid_type_error: "Este campo deve conter apenas números",
        required_error: "O preço é obrigatório",
    }).positive("O preço não pode ser abaixo de 0"),
    color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Cor inválida"),
    type: z.string({
        required_error: "O tipo é obrigatório",
    }),
    category: z.string({
        required_error: "A categoria é obrigatória",
    }),
    pricingGroup: z.string({
        required_error: "O grupo de precificação é obrigatório",
    }),
    initialStockQuantity: z.coerce.number({
        invalid_type_error: "Este campo deve conter apenas números",
        required_error: "A quantidade inicial do estoque é obrigatória",
    }).positive("A quantidade inicial do estoque não pode ser abaixo de 0"),
    image: z.instanceof(File) // Espera uma instância de File
        .refine((file) => file instanceof File && file.size > 0, {
            message: "O upload de uma imagem é obrigatório", // Mensagem de erro
        }),
});

type ProductFormData = z.infer<typeof createProductSchema>;

interface ProductFormProps {
    handleClose: () => void;
    handleProductAdded: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ handleClose, handleProductAdded }) => {
    const [categories, setCategories] = useState<ProductCategoryResponse[]>([]);
    const [pricingGroups, setPricingGroups] = useState<PricingGroupResponse[]>([]);
    const [imagePreview, setImagePreview] = useState<string | null>(null); // Estado para a prévia da imagem
    const api = useApi();

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<ProductFormData>({
        resolver: zodResolver(createProductSchema),
        defaultValues: {
            name: "",
            description: "",
            price: 0,
            color: "",
            type: "",
            category: "Cozinha",
            pricingGroup: "Standard",
            initialStockQuantity: 1,
            image: undefined,
        },
    });

    const selectedColor = watch("color");

    // Carrega as categorias de produtos
    const getAllProductCategories = async () => {
        const response = await api.listAllProductCategories();
        setCategories(response.data);
    };

    // Carrega os grupos de precificação
    const getAllPricingGroups = async () => {
        const response = await api.listAllPricingGroups();
        setPricingGroups(response.data);
    };

    // Atualiza a cor no formulário
    const handleColorChange = (color: string) => {
        setValue("color", color, { shouldValidate: true });
    };

    // Função para lidar com a seleção de imagem
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setValue("image", file, { shouldValidate: true }); // Atualiza o valor da imagem no formulário
            setImagePreview(URL.createObjectURL(file)); // Exibe a prévia da imagem
        }
    };

    // Função chamada ao enviar o formulário
    const createProduct = async (data: ProductFormData) => {
        const formData = new FormData(); // Cria um FormData

        // Adiciona os campos ao FormData
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("price", data.price.toString());
        formData.append("color", data.color);
        formData.append("categoryId", categories.filter(category => category.name === data.category)[0].id.toString());
        formData.append("pricingGroupId", pricingGroups.filter(group => group.name === data.pricingGroup)[0].id.toString());
        formData.append("type", data.type);
        formData.append("initialStockQuantity", data.initialStockQuantity.toString());

        // Adiciona a imagem ao FormData (se existir)
        if (data.image) {
            formData.append("image", data.image);
        }

        const response = await api.createProduct(formData);

        if(response.code === CREATED){
            toast.success(response.message);
            handleClose();
            handleProductAdded();
        }else{
            toast.error(response.message);
        }
    };

    // Carrega as categorias e grupos de precificação ao montar o componente
    useEffect(() => {
        getAllProductCategories();
        getAllPricingGroups();
    }, []);

    return (
        <>
            <Grid2
                component="form"
                sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1, width: "500px" }}
                onSubmit={handleSubmit(createProduct)}
            >
                {/* Campo Nome */}
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Nome do produto"
                    data-cy="txt-product-name"
                    required
                    {...register("name")}
                    error={!!errors.name}
                    helperText={errors?.name?.message}
                />

                {/* Campo Preço */}
                <NumericFormat
                    thousandSeparator={"."}
                    decimalSeparator={","}
                    decimalScale={2}
                    valueIsNumericString
                    prefix="R$"
                    label="Preço"
                    required
                    customInput={TextField}
                    onValueChange={(values) => {
                        setValue("price", values.floatValue || 0, { shouldValidate: true });
                    }}
                    error={!!errors.price}
                    helperText={errors?.price?.message}
                />

                {/* ColorPicker */}
                <ColorPicker
                    value={selectedColor}
                    onChange={handleColorChange}
                />
                {errors.color && (
                    <Box
                        color="error.main"
                        fontSize="0.875rem"
                        width={"100%"}
                        display={"flex"}
                        justifyContent={"center"}
                    >
                        {errors.color.message}
                    </Box>
                )}

                {/* Campo Tipo */}
                <TextField
                    fullWidth
                    variant="outlined"
                    required
                    label="Tipo do móvel"
                    data-cy="txt-product-type"
                    {...register("type")}
                    error={!!errors.type}
                    helperText={errors?.type?.message}
                />

                {/* Campo Categoria */}
                <TextField
                    fullWidth
                    select
                    required
                    label="Categoria"
                    defaultValue={""}
                    data-cy="select-product-category"
                    {...register("category")}
                    error={!!errors.category}
                    helperText={errors?.category?.message}
                >
                    <MenuItem></MenuItem>
                    {categories.map((category, index) => (
                        <MenuItem key={index} value={category.name}>
                            {category.name}
                        </MenuItem>
                    ))}
                </TextField>

                {/* Campo Grupo de Precificação */}
                <TextField
                    fullWidth
                    select
                    required
                    label="Grupo de Precificação"
                    defaultValue={""}
                    data-cy="select-product-pricing-group"
                    {...register("pricingGroup")}
                    error={!!errors.pricingGroup}
                    helperText={errors?.pricingGroup?.message}
                >
                    <MenuItem></MenuItem>
                    {pricingGroups.map((pricingGroup, index) => (
                        <MenuItem key={index} value={pricingGroup.name}>
                            {pricingGroup.name} - {pricingGroup.profitMargin}%
                        </MenuItem>
                    ))}
                </TextField>

                {/* Campo Quantidade Inicial de Estoque */}
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Quantidade de estoque"
                    data-cy="select-product-stock-quantity"
                    {...register("initialStockQuantity")}
                    error={!!errors.initialStockQuantity}
                    helperText={errors?.initialStockQuantity?.message}
                />

                {/* Campo Upload de Imagem */}
                <Box>
                    <Button
                        variant="contained"
                        component="label"
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
                        Upload de Imagem
                        <Input
                            type="file"
                            inputProps={{ accept: "image/jpg, image/png, image/jpeg" }}
                            style={{ display: "none" }}
                            onChange={handleImageChange}
                        />
                    </Button>
                    {imagePreview && (
                        <Box mt={2} sx={{display: "flex", justifyContent: "center"}}>
                            <img
                                src={imagePreview}
                                alt="Prévia da imagem"
                                style={{ maxWidth: "100%", maxHeight: "200px" }}
                            />
                        </Box>
                    )}
                </Box>
                {errors.image && (
                    <Box
                        color="error.main"
                        fontSize="0.875rem"
                        width={"100%"}
                        display={"flex"}
                        justifyContent={"center"}
                    >
                        {errors?.image?.message}
                    </Box>
                )}

                {/* Campo Descrição */}
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Descrição do produto"
                    multiline
                    rows={4}
                    data-cy="txt-product-description"
                    required
                    {...register("description")}
                    error={!!errors.description}
                    helperText={errors?.description?.message}
                />

                {/* Botões de Ação */}
                <DialogActions>
                    <Button data-cy="btn-cancel-add-product" onClick={handleClose}>Cancelar</Button>
                    <Button data-cy="btn-confirm-add-product" type="submit">Salvar</Button>
                </DialogActions>
            </Grid2>
        </>
    );
};

export default ProductForm;