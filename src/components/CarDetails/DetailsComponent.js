import { Grid } from "@mui/joy";
import { Box, Typography, Stack, Divider } from "@mui/material";
import FeatureItem from "./FeatureItem";

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
                height="60"
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

/**
 * Details Component
 * Displays a collection of car details like mileage, fuel consumption, address, description, additional function.
 */
export const DetailsComponent = ({ CarData = {} }) => {
    /**
   * List of additional function.
   */
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
        <Box sx={{ px: { xs: 2, md: 4 } }}>
            {/* Display mileage and fuel consumption */}
            <Grid container spacing={4} sx={{ p: 2 }}>
                <InfoItem icon="https://img.icons8.com/?size=100&id=96BMm9UAgxhC&format=png&color=40C057" title="Mileage" value={`${CarData.mileage || "-"} Miles`} />
                <InfoItem icon="https://img.icons8.com/?size=100&id=jU1n39Rx23Ee&format=png&color=40C057" title="Fuel Consumption" value={`${CarData.fuelConsumption || "-"} L/100Km`} />
            </Grid>
            <Divider sx={{ my: 3 }} />
            {/* Display address of car*/}
            <Box>
                <Typography sx={{ color: "#767676", fontSize: "20px", fontWeight: "bold" }}>Address</Typography>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 2 }}>
                    <Box component="img" src="https://img.icons8.com/?size=100&id=3723&format=png&color=40C057" alt="Location Icon" sx={{ width: 20, height: 20 }} />
                    <Typography sx={{ color: "#333", fontSize: "14px" }}>{CarData.address || "Not available"}</Typography>
                </Stack>
            </Box>
            <Divider sx={{ my: 3 }} />
            {/* Display description of car*/}
            <Box>
                <Typography sx={{ color: "#767676", fontSize: "20px", fontWeight: "bold" }}>Description</Typography>
                <Typography sx={{ color: "#333", fontSize: "14px", mt: 2 }}>{CarData.description || "No description available."}</Typography>
            </Box>
            <Divider sx={{ my: 3 }} />
            {/* Display additional function */}
            <Box>
                <Typography sx={{ color: "#767676", fontSize: "20px", fontWeight: "bold" }}>Additional Function</Typography>
                <Grid container spacing={2} sx={{ p: 2 }}>
                    {features.map(({ title, icon }) => (
                        <FeatureItem key={title} icon={icon} name={title} isActive={CarData.additionalFunction?.toLowerCase().includes(title.toLowerCase()) || false} />
                    ))}
                </Grid>
            </Box>
        </Box>
    );
};
