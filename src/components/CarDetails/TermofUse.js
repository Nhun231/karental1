import { Grid } from "@mui/joy";
import { Button, Box, Typography, Stack, Divider } from "@mui/material";
import FeatureItem from "./FeatureItem"
const InfoItem = ({ icon, title, value }) => (
    <Grid item xs={6}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ display: "flex", justifyContent: "center" }}>
            <img width="80" height="80" src={icon} alt={title} />
            <Stack direction="column" alignItems="center">
                <Typography sx={{ color: "#767676", fontSize: "16px", fontWeight: "bold" }}>{title}</Typography>
                <Typography sx={{ fontSize: "24px", fontWeight: "bold" }}>{new Intl.NumberFormat("vi-VN").format(value)}VNĐ</Typography>
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
        <div>
            <Grid container spacing={10} item xs={12} sx={{ p: 4 }}>
                <InfoItem icon="https://img.icons8.com/?size=100&id=7163&format=png&color=40C057" title="Base Price" value={`${CarData.basePrice}`} />
                <InfoItem icon="https://img.icons8.com/?size=100&id=35072&format=png&color=40C057" title="Required deposit" value={`${CarData.deposit}`} />
            </Grid>
            <Divider></Divider>
            <Box sx={{ p: 4 }}>
                <Typography sx={{ color: "#767676", fontSize: "24px", fontWeight: "bold" }}>Term of Use</Typography>
                <Grid container spacing={5} sx={{ p: 4 }}>
                    {features.map(({ title, icon }) => (
                        <FeatureItem key={title} icon={icon} name={title} isActive={CarData.additionalFunction?.toLowerCase().includes(title.toLowerCase())} />
                    ))}
                </Grid>
            </Box>
        </div>
    )
}