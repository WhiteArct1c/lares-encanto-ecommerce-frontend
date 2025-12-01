import React, { useEffect, useState } from "react";
import { Box, Step, StepLabel, Stepper } from "@mui/material";
import PresentationStepComponent from "../PresentationStepComponent";
import UploadImageStepComponent from "../UploadImageStepComponent";
import SelectResultsStepComponent from "../SelectResultsStepComponent";
import LoadingResultsComponent from "../UploadImageStepComponent/components/loading-results-component.tsx";
import {useNavigate} from "react-router-dom";
import {useApi} from "../../../hooks/useApi.ts";
import {toast} from "react-toastify";

interface StepperComponentProps {
    closeModal: () => void;
}

const StepperComponent: React.FunctionComponent<StepperComponentProps> = ({closeModal}) => {
    const [activeStep, setActiveStep] = useState(0);
    const [skipped, setSkipped] = useState(new Set<number>());
    const [finishedTimeout, setFinishedTimeout] = useState<boolean>(false);
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [suggestedProducts, setSuggestedProducts] = useState<
        {
            id: number;
            name: string;
            image: string;
        }[]
    >([]);
    const [currentProductIndex, setCurrentProductIndex] = useState<number>(0);
    const navigate = useNavigate();
    const api = useApi();

    const steps = ["Upload de imagem", "Escolha o resultado"];

    const isStepSkipped = (step: number) => skipped.has(step);

    const handleNext = () => {
        let newSkipped = new Set<number>();
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleDislike = () => {
        // Avança para o próximo produto sugerido, se existir.
        const nextIndex = currentProductIndex + 1;

        if (nextIndex < suggestedProducts.length) {
            setCurrentProductIndex(nextIndex);
        } else {
            // Se acabou a lista, volta para o upload de imagem
            toast.info("Acabaram as sugestões para esta imagem. Envie outra foto para tentar novamente.");
            setSuggestedProducts([]);
            setCurrentProductIndex(0);
            setActiveStep(0);
        }
    };

    const handleLike = (productId: number) => {
        navigate(`/products/${productId}`);
        closeModal();
    };

    const handleImageUpload = async (files: File[]) => {
        if (!files || files.length === 0) {
            toast.error("Nenhuma imagem selecionada. Tente novamente.");
            return;
        }

        const [file] = files;

        const formData = new FormData();
        formData.append("image", file);

        try {
            setIsSearching(true);

            const response = await api.searchProductByImage(formData);
            console.log("LaresAI response:", response);

            const status = response?.status;
            const data = response?.data;
            const message = response?.message;

            const isSuccess =
                status === "200" ||
                status === 200 ||
                (status === undefined && data); // fallback p/ caso sem wrapper de status

            if (isSuccess) {
                // Alguns backends podem retornar data como array ou objeto único
                const payload = Array.isArray(data) ? data[0] : data;
                const matchedProducts = payload?.matchedProducts || [];

                if (!matchedProducts || matchedProducts.length === 0) {
                    toast.info("Nenhum produto semelhante foi encontrado para essa imagem.");
                    return;
                }

                // Mapeia toda a lista de produtos sugeridos (até 3)
                const mappedProducts = matchedProducts.map((p: any) => ({
                    id: p.productId,
                    name: p.productName,
                    image: p.productImage
                }));

                setSuggestedProducts(mappedProducts);
                setCurrentProductIndex(0);

                handleNext();
            } else if (status === "400" || status === 400) {
                toast.error(message || "Não foi possível processar a imagem. Envie uma imagem de móveis.");
            } else {
                toast.error(message || "Erro ao buscar sugestão com a LaresAI.");
            }
        } catch (error: any) {
            const status = error?.response?.status;
            const message = error?.response?.data?.message;

            if (status === 400 && message) {
                toast.error(message);
            } else {
                toast.error("Erro ao processar a imagem. Tente novamente.");
            }
        } finally {
            setIsSearching(false);
        }
    };

    useEffect(() => {
        const id = setTimeout(() => {
            setFinishedTimeout(true);
        }, 5000);
        return () => clearTimeout(id);
    }, []);

    return (
        <>
            {!finishedTimeout && <PresentationStepComponent />}
            {finishedTimeout && (
                <Box sx={{ width: "100%" }} className="animate__animated animate__fadeIn">
                    <Stepper activeStep={activeStep}>
                        {steps.map((label, index) => {
                            const stepProps: { completed?: boolean } = {};
                            const labelProps: { optional?: React.ReactNode } = {};
                            if (isStepSkipped(index)) {
                                stepProps.completed = false;
                            }
                            return (
                                <Step key={label} {...stepProps}>
                                    <StepLabel {...labelProps}>{label}</StepLabel>
                                </Step>
                            );
                        })}
                    </Stepper>

                    {activeStep === 0 && (
                        <>
                            {isSearching ? (
                                <LoadingResultsComponent />
                            ) : (
                                <UploadImageStepComponent onUpload={handleImageUpload} />
                            )}
                        </>
                    )}
                    {activeStep === 1 && suggestedProducts.length > 0 && (
                        <Box
                            sx={{
                                width: "500px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            {/** Produto atual da lista de sugestões */}
                            {(() => {
                                const currentProduct = suggestedProducts[currentProductIndex];
                                if (!currentProduct) return null;

                                return (
                            <SelectResultsStepComponent
                                imageUrl={currentProduct.image}
                                name={currentProduct.name}
                                onDislike={handleDislike}
                                onLike={() => handleLike(currentProduct.id)}
                            />
                                );
                            })()}
                        </Box>
                    )}
                </Box>
            )}
        </>
    );
};

export default StepperComponent;
