import React, { useEffect } from 'react'
import axios from 'axios';
import CarOwnerBanner from '../components/common/CarOwnerBanner';
import { Button, Box, Typography } from "@mui/material";
import BenefitsSection from '../components/common/BenefitSection';
const HomePageCarOwner = () => {
    return (
        <Box sx={{
            maxWidth: "1200px",
            mx: "auto",
            mt: 4,
        }}>
            <CarOwnerBanner></CarOwnerBanner>
            <BenefitsSection></BenefitsSection>
        </Box>
    )
}

export default HomePageCarOwner;