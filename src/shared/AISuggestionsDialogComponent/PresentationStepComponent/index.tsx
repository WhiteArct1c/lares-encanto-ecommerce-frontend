import React from "react";
import {Box, Typography} from "@mui/material";
import 'animate.css';
import {AutoAwesome} from "@mui/icons-material";

interface PresentationStepComponentProps {}

const PresentationStepComponent: React.FC<PresentationStepComponentProps> = () => {
    return (
        <Box sx={{
            width: '100%',
            display: 'flex',
            flexDirection:'column',
            justifyContent: 'center',
            alignItems: 'center',
            paddingRight: 7,
            paddingLeft: 7,
            gap: 2
        }}>
            <img
                src="/src/assets/laresAi/SVG/laresAI%20-%20normal.svg"
                alt='laresAi'
                style={{
                    width: '200px',
                    filter: 'drop-shadow(0 10px 5px rgba(0, 0, 0, 0.3))'
                }}
                className='animate__animated animate__fadeIn'
            />
            <Typography
                sx={{
                    width: '100%',
                    textAlign: 'center',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 2,
                    marginBottom: 2
                }}
                className='animate__animated animate__fadeIn animate__delay-1s'
            >
                powered by <AutoAwesome color='primary'/> Google Cloud Vision.
            </Typography>
        </Box>

    );
}

export default PresentationStepComponent;