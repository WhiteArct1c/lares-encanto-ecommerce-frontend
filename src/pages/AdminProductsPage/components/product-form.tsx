import { z } from "zod";
import React, { useEffect, useState } from "react";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, DialogActions, MenuItem, TextField, Input, FormControlLabel, Switch, Chip, IconButton, Typography } from "@mui/material";
import { NumericFormat } from "react-number-format";
import ColorPicker from "./color-picker.tsx";
import { Delete } from "@mui/icons-material";
import { useApi } from "../../../hooks/useApi.ts";
import { toast } from "react-toastify";
import { ProductCategoryResponse } from "../../../utils/types/response/ProductCategory/ProductCategoryResponse.ts";
import { PricingGroupResponse } from "../../../utils/types/response/PricingGroup/PricingGroupResponse.ts";
import { ProductResponse } from "../../../utils/types/response/Product/ProductResponse.ts";
import { CREATED, OK } from "../../../utils/constants/apiCodes.ts";

// Schema do Zod base (campos comuns)
const baseProductSchema = {
    name: z.string({
        required_error: "O nome é obrigatório",
    }),
    description: z.string().max(255, "A descrição deve conter apenas 255 caracteres"),
    price: z.coerce.number({
        invalid_type_error: "Este campo deve conter apenas números",
        required_error: "O preço é obrigatório",
    }).positive("O preço não pode ser abaixo de 0"),
    color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Cor inválida").optional(), // Opcional para compatibilidade
    type: z.string({
        required_error: "O tipo é obrigatório",
    }),
    category: z.string({
        required_error: "A categoria é obrigatória",
    }),
    pricingGroup: z.string({
        required_error: "O grupo de precificação é obrigatório",
    }),
    weightKg: z.union([
        z.string().length(0).transform(() => undefined),
        z.coerce.number({
            invalid_type_error: "Este campo deve conter apenas números",
        }).min(0.1, "O peso deve ser no mínimo 0.1 kg")
          .max(1000, "O peso deve ser no máximo 1000 kg")
    ]).optional(),
    isActive: z.boolean().optional(),
};

// Schema para criação (imagem obrigatória, initialStockQuantity obrigatório)
const createProductSchema = z.object({
    ...baseProductSchema,
    initialStockQuantity: z.coerce.number({
        invalid_type_error: "Este campo deve conter apenas números",
        required_error: "A quantidade inicial do estoque é obrigatória",
    }).positive("A quantidade inicial do estoque não pode ser abaixo de 0"),
    image: z.instanceof(File).refine((file) => file instanceof File && file.size > 0, {
        message: "O upload de uma imagem é obrigatório",
    }),
});

// Schema para edição (imagem opcional, stockQuantity opcional)
const editProductSchema = z.object({
    ...baseProductSchema,
    stockQuantity: z.coerce.number().positive().optional(),
    image: z.instanceof(File).optional(),
});

type CreateProductFormData = z.infer<typeof createProductSchema>;
type EditProductFormData = z.infer<typeof editProductSchema>;
type ProductFormData = CreateProductFormData | EditProductFormData;

interface ProductFormProps {
    handleClose: () => void;
    handleProductAdded: () => void;
    initialData?: ProductResponse | null;
}

const ProductForm: React.FC<ProductFormProps> = ({ handleClose, handleProductAdded, initialData }) => {
    const isEditMode = !!initialData;
    const [categories, setCategories] = useState<ProductCategoryResponse[]>([]);
    const [pricingGroups, setPricingGroups] = useState<PricingGroupResponse[]>([]);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [colors, setColors] = useState<string[]>([]); // Array de hexCodes
    const [tags, setTags] = useState<string[]>([]); // Array de tag names
    const [newColorInput, setNewColorInput] = useState<string>("#000000");
    const [newTagInput, setNewTagInput] = useState<string>("");
    const api = useApi();

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors },
    } = useForm<ProductFormData>({
        resolver: zodResolver(isEditMode ? editProductSchema : createProductSchema),
    });

    const selectedColor = watch("color");
    const isActive = watch("isActive");

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

    // Preenche o formulário com dados iniciais quando estiver editando
    useEffect(() => {
        if (initialData && categories.length > 0 && pricingGroups.length > 0) {
            reset({
                name: initialData.name,
                description: initialData.description,
                price: initialData.price,
                color: initialData.color,
                type: initialData.type,
                category: initialData.category?.name || "",
                pricingGroup: initialData.pricingGroup?.name || "",
                stockQuantity: initialData.stockQuantity,
                weightKg: initialData.weightKg || undefined,
                isActive: initialData.isActive,
                image: undefined,
            });
            
            // Carregar cores: usar colors se disponível, senão usar color como fallback
            if (initialData.colors && initialData.colors.length > 0) {
                setColors(initialData.colors.map(c => c.hexCode));
            } else if (initialData.color) {
                setColors([initialData.color]);
            } else {
                setColors([]);
            }
            
            // Carregar tags
            if (initialData.tags && initialData.tags.length > 0) {
                setTags(initialData.tags.map(t => t.name));
            } else {
                setTags([]);
            }
            
            // Exibir imagem existente
            if (initialData.image) {
                setImagePreview(initialData.image);
            }
        } else if (!initialData) {
            // Limpar formulário quando não há dados iniciais (criação)
            reset({
                name: "",
                description: "",
                price: 0,
                color: "#000000",
                type: "",
                category: "",
                pricingGroup: "",
                initialStockQuantity: 1,
                weightKg: undefined,
                image: undefined,
            });
            setImagePreview(null);
            setColors([]);
            setTags([]);
        }
    }, [initialData, categories, pricingGroups, reset]);

    // Atualiza a cor no formulário (mantido para compatibilidade)
    const handleColorChange = (color: string) => {
        setValue("color", color, { shouldValidate: true });
    };

    // Adiciona uma nova cor
    const handleAddColor = () => {
        const hexCode = newColorInput.toUpperCase().trim();
        const colorRegex = /^#[0-9A-F]{6}$/i;
        
        if (!colorRegex.test(hexCode)) {
            toast.error("Cor inválida. Use o formato #RRGGBB (ex: #808080)");
            return;
        }
        
        if (colors.includes(hexCode)) {
            toast.error("Esta cor já foi adicionada");
            return;
        }
        
        setColors([...colors, hexCode]);
        setNewColorInput("#000000");
    };

    // Remove uma cor
    const handleRemoveColor = (hexCode: string) => {
        setColors(colors.filter(c => c !== hexCode));
    };

    // Adiciona uma nova tag
    const handleAddTag = () => {
        const tagName = newTagInput.trim().toLowerCase();
        
        if (!tagName) {
            toast.error("A tag não pode estar vazia");
            return;
        }
        
        if (tags.includes(tagName)) {
            toast.error("Esta tag já foi adicionada");
            return;
        }
        
        setTags([...tags, tagName]);
        setNewTagInput("");
    };

    // Remove uma tag
    const handleRemoveTag = (tagName: string) => {
        setTags(tags.filter(t => t !== tagName));
    };

    // Função para determinar se uma cor é clara ou escura (para escolher cor do texto)
    const isLightColor = (hexCode: string): boolean => {
        // Remove o # se presente
        const hex = hexCode.replace('#', '');
        // Converte para RGB
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        // Calcula a luminosidade relativa
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance > 0.5;
    };

    // Função para lidar com a seleção de imagem
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setValue("image", file, { shouldValidate: true });
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // Função chamada ao enviar o formulário
    const onSubmit = async (data: ProductFormData) => {
        // Validação: pelo menos uma cor deve ser adicionada ou o campo color deve estar preenchido
        if (colors.length === 0 && !data.color) {
            toast.error("Adicione pelo menos uma cor ao produto");
            return;
        }
        
        const formData = new FormData();

        // Adiciona os campos ao FormData (apenas os que foram alterados)
        if (data.name) formData.append("name", data.name);
        if (data.description) formData.append("description", data.description);
        if (data.price !== undefined) formData.append("price", data.price.toString());
        if (data.color) formData.append("color", data.color); // Mantido para compatibilidade
        
        // Adiciona cores como array (uma por vez no FormData)
        colors.forEach(hexCode => {
            formData.append("colorHexCodes", hexCode);
        });
        
        // Adiciona tags como array (uma por vez no FormData)
        tags.forEach(tagName => {
            formData.append("tagNames", tagName);
        });
        
        if (data.type) formData.append("type", data.type);
        
        if (data.category) {
            const categoryId = categories.find(c => c.name === data.category)?.id;
            if (categoryId) formData.append("categoryId", categoryId.toString());
        }
        
        if (data.pricingGroup) {
            const pricingGroupId = pricingGroups.find(g => g.name === data.pricingGroup)?.id;
            if (pricingGroupId) formData.append("pricingGroupId", pricingGroupId.toString());
        }

        if (isEditMode && 'stockQuantity' in data && data.stockQuantity !== undefined) {
            formData.append("stockQuantity", data.stockQuantity.toString());
        } else if (!isEditMode && 'initialStockQuantity' in data) {
            formData.append("initialStockQuantity", data.initialStockQuantity.toString());
        }

        if (data.weightKg !== undefined && data.weightKg !== null) {
            formData.append("weightKg", data.weightKg.toString());
        }

        if (data.isActive !== undefined) {
            formData.append("isActive", data.isActive.toString());
        }

        // Adiciona a imagem ao FormData (apenas se uma nova foi selecionada)
        if (data.image) {
            formData.append("image", data.image);
        }

        try {
            let response;
            if (isEditMode && initialData) {
                response = await api.updateProduct(initialData.id, formData);
                if (response.code === OK || response.code === '200 OK') {
                    toast.success('Produto atualizado com sucesso!');
                    handleClose();
                    handleProductAdded();
                } else {
                    toast.error(response.message || 'Erro ao atualizar produto');
                }
            } else {
                response = await api.createProduct(formData);
                if (response.code === CREATED) {
                    toast.success(response.message);
                    handleClose();
                    handleProductAdded();
                } else {
                    toast.error(response.message);
                }
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Erro ao processar produto');
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
                sx={{ 
                    display: "flex", 
                    flexDirection: "column", 
                    gap: 2, 
                    mt: 1, 
                    width: "100%",
                    maxWidth: "100%",
                    boxSizing: "border-box"
                }}
                onSubmit={handleSubmit(onSubmit)}
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
                    InputLabelProps={{ shrink: true }}
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
                    defaultValue={initialData?.price || 0}
                    onValueChange={(values) => {
                        setValue("price", values.floatValue || 0, { shouldValidate: true });
                    }}
                    error={!!errors.price}
                    helperText={errors?.price?.message}
                    InputLabelProps={{ shrink: true }}
                />

                {/* Cores - Múltiplas */}
                <Box sx={{ width: '100%' }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                        Cores do Produto
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 1, width: '100%' }}>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <ColorPicker
                                value={newColorInput}
                                onChange={(color) => setNewColorInput(color)}
                            />
                        </Box>
                        <Button
                            variant="outlined"
                            onClick={handleAddColor}
                            sx={{ flexShrink: 0 }}
                        >
                            Adicionar Cor
                        </Button>
                    </Box>
                    {colors.length > 0 && (
                        <Box sx={{ 
                            display: 'flex', 
                            flexWrap: 'wrap', 
                            gap: 1, 
                            mt: 1,
                            width: '100%',
                            boxSizing: 'border-box'
                        }}>
                            {colors.map((hexCode) => {
                                const isLight = isLightColor(hexCode);
                                return (
                                    <Chip
                                        key={hexCode}
                                        label={hexCode}
                                        sx={{
                                            bgcolor: hexCode,
                                            color: isLight ? '#000' : '#fff',
                                            fontWeight: 600,
                                            border: '2px solid',
                                            borderColor: isLight ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.3)',
                                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12)',
                                            '& .MuiChip-deleteIcon': {
                                                color: isLight ? '#000' : '#fff',
                                                '&:hover': {
                                                    color: isLight ? '#333' : '#f0f0f0'
                                                }
                                            }
                                        }}
                                        onDelete={() => handleRemoveColor(hexCode)}
                                    />
                                );
                            })}
                        </Box>
                    )}
                    {colors.length === 0 && (
                        <Typography variant="caption" color="text.secondary">
                            Nenhuma cor adicionada. Use o formato #RRGGBB (ex: #808080)
                        </Typography>
                    )}
                </Box>

                {/* Tags */}
                <Box sx={{ width: '100%' }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                        Tags do Produto
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 1, width: '100%' }}>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Digite uma tag (ex: sofa, moderno)"
                            value={newTagInput}
                            onChange={(e) => setNewTagInput(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddTag();
                                }
                            }}
                            sx={{ flex: 1, minWidth: 0 }}
                        />
                        <Button
                            variant="outlined"
                            onClick={handleAddTag}
                            sx={{ flexShrink: 0 }}
                        >
                            Adicionar Tag
                        </Button>
                    </Box>
                    {tags.length > 0 && (
                        <Box sx={{ 
                            display: 'flex', 
                            flexWrap: 'wrap', 
                            gap: 1, 
                            mt: 1,
                            width: '100%',
                            boxSizing: 'border-box'
                        }}>
                            {tags.map((tagName) => (
                                <Chip
                                    key={tagName}
                                    label={tagName}
                                    onDelete={() => handleRemoveTag(tagName)}
                                />
                            ))}
                        </Box>
                    )}
                    {tags.length === 0 && (
                        <Typography variant="caption" color="text.secondary">
                            Nenhuma tag adicionada
                        </Typography>
                    )}
                </Box>

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
                    InputLabelProps={{ shrink: true }}
                />

                {/* Campo Categoria */}
                <TextField
                    fullWidth
                    select
                    required
                    label="Categoria"
                    data-cy="select-product-category"
                    {...register("category")}
                    error={!!errors.category}
                    helperText={errors?.category?.message}
                    InputLabelProps={{ shrink: true }}
                >
                    <MenuItem value="">Selecione uma categoria</MenuItem>
                    {categories.map((category) => (
                        <MenuItem key={category.id} value={category.name}>
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
                    data-cy="select-product-pricing-group"
                    {...register("pricingGroup")}
                    error={!!errors.pricingGroup}
                    helperText={errors?.pricingGroup?.message}
                    InputLabelProps={{ shrink: true }}
                >
                    <MenuItem value="">Selecione um grupo</MenuItem>
                    {pricingGroups.map((pricingGroup) => (
                        <MenuItem key={pricingGroup.id} value={pricingGroup.name}>
                            {pricingGroup.name} - {pricingGroup.profitMargin}%
                        </MenuItem>
                    ))}
                </TextField>

                {/* Campo Quantidade de Estoque */}
                {isEditMode ? (
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Quantidade de estoque"
                        data-cy="select-product-stock-quantity"
                        type="number"
                        {...register("stockQuantity")}
                        error={!!errors.stockQuantity}
                        helperText={errors?.stockQuantity?.message}
                        InputLabelProps={{ shrink: true }}
                    />
                ) : (
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Quantidade inicial de estoque"
                        data-cy="select-product-stock-quantity"
                        type="number"
                        {...register("initialStockQuantity")}
                        error={!!errors.initialStockQuantity}
                        helperText={errors?.initialStockQuantity?.message}
                        InputLabelProps={{ shrink: true }}
                    />
                )}

                {/* Campo Peso (kg) */}
                <TextField
                    fullWidth
                    variant="outlined"
                    type="number"
                    label="Peso (kg)"
                    placeholder="Ex: 15.5"
                    inputProps={{
                        step: "0.1",
                        min: "0.1",
                        max: "1000"
                    }}
                    data-cy="txt-product-weight"
                    {...register("weightKg")}
                    error={!!errors.weightKg}
                    helperText={
                        errors?.weightKg?.message ||
                        "Peso do produto em quilogramas. Usado para cálculo preciso do frete. Se não informado, será usado 15kg como padrão."
                    }
                    InputLabelProps={{ shrink: true }}
                />

                {/* Campo Ativo/Inativo (apenas no modo de edição) */}
                {isEditMode && (
                    <FormControlLabel
                        control={
                            <Switch
                                checked={isActive ?? initialData?.isActive ?? true}
                                onChange={(e) => setValue("isActive", e.target.checked, { shouldValidate: true })}
                            />
                        }
                        label="Produto Ativo"
                    />
                )}

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
                        {isEditMode ? 'Alterar Imagem' : 'Upload de Imagem'}
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
                {!isEditMode && errors.image && (
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
                    InputLabelProps={{ shrink: true }}
                />

                {/* Botões de Ação */}
                <DialogActions>
                    <Button data-cy="btn-cancel-add-product" onClick={handleClose}>Cancelar</Button>
                    <Button data-cy="btn-confirm-add-product" type="submit">
                        {isEditMode ? 'Atualizar' : 'Salvar'}
                    </Button>
                </DialogActions>
            </Grid2>
        </>
    );
};

export default ProductForm;
