import React, { useEffect, useState } from 'react'
import axios from 'axios';
import CarOwnerBanner from '../components/common/CarOwnerBanner';
import { Button, Box, Typography } from "@mui/material";
import BenefitsSection from '../components/common/BenefitSection';
import SearchCar from '../components/SearchCar/SearchCar';
import WhyUs from '../components/common/WhyUs';
import WhereToFindUs from '../components/common/WhereToFindUs';
import { getFeedback, getTop6City } from "../services/HomePageService";

import city01 from "../assets/city01.png";
import city02 from "../assets/city02.jpg";
import city03 from "../assets/city03.jpg";
import city04 from "../assets/city04.jpg";
import city05 from "../assets/city05.jpg";
import city06 from "../assets/city06.jpg";

const cityImages = [city01, city02, city03, city04, city05, city06];

const HomePageCustomer = () => {
    const [feedbackList, setFeedbackList] = useState(null);
    const [cityList, setCityList] = useState(null);

    useEffect(() => {
        async function getFeedbackData() {
            try {
                const response = await getFeedback();
                setFeedbackList(response.data);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        }
        getFeedbackData();
    }, []);

    useEffect(() => {
        async function getCityData() {
            try {
                const response = await getTop6City();
                const cities = response.data.topCities;

                if (!Array.isArray(cities)) {
                    throw new Error("Invalid city data format");
                }

                const citiesWithImages = cities.map((city, index) => ({
                    ...city,
                    image: cityImages[index] || city01,
                }));

                setCityList(citiesWithImages);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        }
        getCityData();
    }, []);

    return (
        <Box sx={{
            maxWidth: "1200px",
            mx: "auto",
            mt: 4,
        }}>
            <SearchCar></SearchCar>
            <WhyUs />
            {cityList && <WhereToFindUs citiesData={cityList} />}
        </Box>
    )
}

export default HomePageCustomer;