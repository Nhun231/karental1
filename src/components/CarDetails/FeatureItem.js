import { Grid } from "@mui/joy";
import { Box, Typography, Stack } from "@mui/material";
const FeatureItem = ({ name, icon, isActive }) => (
    <Grid item xs={3}>
        <Stack direction="row" alignItems="center" spacing={2} justifyContent="space-between">
            <img width="40" height="40" src={icon} alt={`${name} icon`} />
            <Box minWidth="100px">
                <Typography sx={{ color: "#767676", fontSize: "16px", fontWeight: "bold" }}>
                    {name}
                </Typography>
            </Box>
            <img
                width="30"
                height="30"
                src={isActive
                    ? "https://img.icons8.com/?size=100&id=jHQbIMnZor2r&format=png&color=40C057"
                    : "https://img.icons8.com/?size=100&id=cIsoY4nDXfnz&format=png&color=40C057"
                }
                alt={`${name} status`}
            />
        </Stack>
    </Grid>
);
export default FeatureItem;