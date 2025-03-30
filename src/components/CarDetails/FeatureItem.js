import { Grid } from "@mui/joy";
import { Box, Typography, Stack } from "@mui/material";

/**
 * FeatureItem Component
 * Display additional function.
 */

const FeatureItem = ({ name, icon, isActive }) => (
    <Grid item xs={6} sm={4} md={3} lg={3} >
        <Stack
            direction="row"
            alignItems="center"
            spacing={{ xs: 1, sm: 2 }}
            justifyContent="space-between"
        >
            {/* Icon */}
            <Box
                component="img"
                src={icon}
                alt={`${name} icon`}
                sx={{
                    width: { xs: "25px", sm: "40px" },
                    height: "auto",
                }}
            />
            {/* Name of additional function */}
            <Box minWidth={{ xs: "50px", sm: "80px" }}>
                <Typography
                    sx={{
                        color: "#767676",
                        fontSize: { xs: "12px", sm: "16px" },
                        fontWeight: "bold",
                        textAlign: "left"
                    }}
                >
                    {name}
                </Typography>
            </Box>

            {/* Checkbox Icon */}
            <Box
                component="img"
                src={isActive
                    ? "https://img.icons8.com/?size=100&id=jHQbIMnZor2r&format=png&color=40C057"
                    : "https://img.icons8.com/?size=100&id=cIsoY4nDXfnz&format=png&color=40C057"
                }
                alt={`${name} status`}
                sx={{
                    width: { xs: "20px", sm: "30px" },
                    height: "auto",
                }}
            />
        </Stack>
    </Grid>
);

export default FeatureItem;
