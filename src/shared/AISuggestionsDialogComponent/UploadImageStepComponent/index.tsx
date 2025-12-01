import React from "react";
import FileUploadArea from "./components/file-upload-area-component.tsx";
import {Box} from "@mui/material";
import FileGuidelinesComponent from "./components/file-guidelines-component.tsx";

interface UploadImageStepComponentProps {
    onUpload: (files: File[]) => void;
}

const UploadImageStepComponent: React.FC<UploadImageStepComponentProps> = ({onUpload}) => {

    const handleFileUpload = (files: File[]) => {
        onUpload(files);
    }

    return (
        <Box
            sx={{
                width: '100%',
                padding: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 2
            }}
        >
            <FileUploadArea
                maxSizeMB={10}
                onDrop={handleFileUpload}
            />
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <img
                    src='/src/assets/laresAi/SVG/laresAi%20-%20explicando.svg'
                    alt='laresAi'
                    style={{
                        width: '150px'
                    }}
                />
                <FileGuidelinesComponent/>
            </Box>
        </Box>
    );
}

export default UploadImageStepComponent;