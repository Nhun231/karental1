import { Box, Typography, Card, CardContent, Avatar, Rating } from "@mui/material";
import { useState, useEffect } from "react";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import GavelIcon from "@mui/icons-material/Gavel";
import HeadsetMicIcon from "@mui/icons-material/HeadsetMic";

const fallbackFeedback = [
    { id: 1, user: "Anonymous", rating: 5, comment: "Great service! Highly recommended.", date: "2025-03-26 10:00" },
    { id: 2, user: "John Doe", rating: 5, comment: "Super easy to rent a car!", date: "2025-03-26 12:30" },
    { id: 3, user: "Emma Smith", rating: 5, comment: "Affordable and convenient!", date: "2025-03-26 14:45" },
    { id: 4, user: "Alex Brown", rating: 5, comment: "Support team was really helpful!", date: "2025-03-26 16:20" },
];

const WhyUs = ({ feedbackData }) => {
    const [filteredFeedback, setFilteredFeedback] = useState([]);
    const benefits = [
        { title: "Save money", desc: "No setup or registration fees. You are only charged when you rent a car. So get started for FREE!", icon: <MonetizationOnIcon fontSize="large" /> },
        { title: "Convenient", desc: "We have a large selection of privately owned cars to suit your needs throughout the country.", icon: <DirectionsCarIcon fontSize="large" /> },
        { title: "Legal and insurance", desc: "We fully cover all rentals and even provide roadside assistance. Our rating system and extended member profile checks provide safety.", icon: <GavelIcon fontSize="large" /> },
        { title: "24/7 support", desc: "Our team is ready to support you all along the way with our 24/7 hotline and services.", icon: <HeadsetMicIcon fontSize="large" /> },
    ];

    useEffect(() => {
        if (feedbackData && Array.isArray(feedbackData)) {
            const topFeedback = feedbackData
                .filter((fb) => fb.rating === 5 && fb.comment)
                .slice(0, 4);
            setFilteredFeedback(topFeedback.length ? topFeedback : fallbackFeedback);
        } else {
            setFilteredFeedback(fallbackFeedback);
        }
    }, [feedbackData]);

    return (
        <Box sx={{ maxWidth: "1200px", mx: "auto", mt: 4, textAlign: "center", px: 2 }}>
            {/* Why Us Section */}
            <Typography variant="h4" fontWeight="bold" mb={3}>
                Why us?
            </Typography>
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(4, 1fr)" },
                    gap: 3,
                    justifyContent: "center",
                }}
            >
                {benefits.map((item, index) => (
                    <Card
                        key={index}
                        sx={{
                            minWidth: "200px",
                            maxWidth: "300px",
                            textAlign: "center",
                            p: 3,
                            boxShadow: 3,
                            borderRadius: "12px",
                            mx: "auto",
                        }}
                    >
                        <Box sx={{ display: "flex", justifyContent: "center", mb: 2, color: "#05ce80" }}>
                            {item.icon}
                        </Box>
                        <CardContent sx={{ textAlign: "justify" }}>
                            <Typography variant="h6" fontWeight="bold" textAlign="center">{item.title}</Typography>
                            <Typography variant="body2">{item.desc}</Typography>
                        </CardContent>
                    </Card>
                ))}
            </Box>

            {/* What People Say Section */}
            <Typography variant="h4" fontWeight="bold" mt={5} mb={3}>
                What people say?
            </Typography>
            <Box sx={{ backgroundColor: "#f5f5f5", borderRadius: 2, p: 3 }}>
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
                    {filteredFeedback.map((fb) => (
                        <Card key={fb.id} sx={{ display: "flex", p: 2, alignItems: "center" }}>
                            <Avatar sx={{ width: 50, height: 50, mr: 2 }}>👤</Avatar>
                            <CardContent sx={{ flex: 1 }}>
                                <Typography fontWeight="bold">{fb.user}</Typography>
                                <Rating value={fb.rating} readOnly size="small" />
                                <Typography variant="body2" sx={{ mt: 1 }}>{fb.comment}</Typography>
                                <Typography variant="caption" color="textSecondary">
                                    {fb.date}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            </Box>
        </Box>
    );
};

export default WhyUs;
