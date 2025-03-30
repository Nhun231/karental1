import { Grid } from "@mui/joy";
import { Box, Typography, Stack, Divider } from "@mui/material";
import FeatureItem from "./FeatureItem"
/**
 * InfoItem Component
 * Displays information of mileage and fuel consumption.
 */
const InfoItem = ({ icon, title, value }) => (
    <Grid item xs={6}>
        <Stack
            direction={{ xs: "column", md: "row" }}
            alignItems="center"
            spacing={2}
            sx={{ display: "flex", justifyContent: "center", textAlign: "center" }}
        >
            {/* Icon */}
            <img
                width="60"
                height="auto"
                src={icon}
                alt={title}
                style={{ maxWidth: "100%" }}
            />
            {/* Title and information */}
            <Stack direction="column" alignItems="center">
                <Typography variant="body2" color="text.secondary" fontWeight="bold" sx={{ minHeight: "40px", display: "flex", alignItems: "center" }} >{title}</Typography>
                <Typography variant="body1" fontWeight="bold">{value || "-"}</Typography>
            </Stack>
        </Stack>
    </Grid>
);


export const TermofUse = ({ CarData }) => {
    const features = [
        { title: "No smoking", icon: "https://img.icons8.com/?size=100&id=1102&format=png&color=40C057" },
        { title: "No food in car", icon: "https://img.icons8.com/?size=100&id=S4ZlB0QP5xD3&format=png&color=40C057" },
        { title: "No pet", icon: "https://img.icons8.com/?size=100&id=6u9TpPzDoaNF&format=png&color=40C057" },
        { title: "Other", icon: "https://img.icons8.com/?size=100&id=33934&format=png&color=40C057" },
    ];
    return (
        <Box sx={{ px: { xs: 2, md: 4 } }}>
            <Grid container spacing={4} sx={{ p: 2 }}>
                <InfoItem icon="https://img.icons8.com/?size=100&id=7163&format=png&color=40C057" title="Base Price" value={`${CarData.basePrice}`} />
                <InfoItem icon="https://img.icons8.com/?size=100&id=35072&format=png&color=40C057" title="Required deposit" value={`${CarData.deposit}`} />
            </Grid>
            <Divider sx={{ my: 3 }}></Divider>
            <Box>
                <Typography sx={{ color: "#767676", fontSize: "24px", fontWeight: "bold" }}>Term of Use</Typography>
                <Grid container spacing={5} sx={{ p: 4 }}>
                    {features.map(({ title, icon }) => (
                        <FeatureItem key={title} icon={icon} name={title} isActive={CarData.additionalFunction?.toLowerCase().includes(title.toLowerCase())} />
                    ))}
                </Grid>
            </Box>
        </Box>
    )
}