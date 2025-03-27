import { Grid } from "@mui/joy";
import { Button, Box, Typography, Stack, Divider } from "@mui/material";
import FeatureItem from "./FeatureItem"
const InfoItem = ({ icon, title, value }) => (
    <Grid item xs={6}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ display: "flex", justifyContent: "center" }}>
            <img width="80" height="80" src={icon} alt={title} />
            <Stack direction="column" alignItems="center">
                <Typography sx={{ color: "#767676", fontSize: "16px", fontWeight: "bold" }}>{title}</Typography>
                <Typography sx={{ fontSize: "24px", fontWeight: "bold" }}>{value}</Typography>
            </Stack>
        </Stack>
    </Grid>
);

export const DetailsComponent = ({ CarData }) => {
    const features = [
        { title: "Bluetooth", icon: "https://img.icons8.com/?size=100&id=69592&format=png&color=40C057" },
        { title: "Sun roof", icon: "https://img.icons8.com/?size=100&id=bjHY26MVCIVX&format=png&color=40C057" },
        { title: "DVD", icon: "https://img.icons8.com/?size=100&id=12762&format=png&color=40C057" },
        { title: "GPS", icon: "https://img.icons8.com/?size=100&id=345&format=png&color=40C057" },
        { title: "Child lock", icon: "https://img.icons8.com/?size=100&id=15437&format=png&color=40C057" },
        { title: "USB", icon: "https://img.icons8.com/?size=100&id=FKw5hYVbOIgS&format=png&color=40C057" },
        { title: "Camera", icon: "https://img.icons8.com/?size=100&id=5376&format=png&color=40C057" },
        { title: "Child seat", icon: "https://img.icons8.com/?size=100&id=fbFdlhfY4vzY&format=png&color=40C057" },
    ];

    return (
        <div>
            <Grid container spacing={10} item xs={12} sx={{ p: 4 }}>
                <InfoItem icon="https://img.icons8.com/?size=100&id=96BMm9UAgxhC&format=png&color=40C057" title="MileAge" value={`${CarData.mileage} Miles`} />
                <InfoItem icon="https://img.icons8.com/?size=100&id=jU1n39Rx23Ee&format=png&color=40C057" title="Fuel Consumption" value={`${CarData.fuelConsumption} Liter/100Km`} />
            </Grid>
            <Divider />
            <Box sx={{ p: 4 }}>
                <Typography sx={{ color: "#767676", fontSize: "24px", fontWeight: "bold" }}>Address</Typography>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 4 }}>
                    <Box component="img" src="https://img.icons8.com/?size=100&id=3723&format=png&color=40C057" alt="Location Icon" sx={{ width: 20, height: 20 }} />
                    <Typography sx={{ color: "#333", fontSize: "14px" }}>{CarData.address}</Typography>
                </Stack>
            </Box>
            <Divider />
            <Box sx={{ p: 4 }}>
                <Typography sx={{ color: "#767676", fontSize: "24px", fontWeight: "bold" }}>Description</Typography>
                <Typography sx={{ color: "#333", fontSize: "14px", mt: 4 }}>{CarData.description}</Typography>
            </Box>
            <Divider />
            <Box sx={{ p: 4 }}>
                <Typography sx={{ color: "#767676", fontSize: "24px", fontWeight: "bold" }}>Additional Function</Typography>
                <Grid container spacing={5} sx={{ p: 4 }}>
                    {features.map(({ title, icon }) => (
                        <FeatureItem key={title} icon={icon} name={title} isActive={CarData.additionalFunction?.toLowerCase().includes(title.toLowerCase())} />
                    ))}
                </Grid>
            </Box>
        </div>
    );
};
