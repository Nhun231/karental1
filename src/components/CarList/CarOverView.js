import { Grid } from "@mui/joy";
import CarCard from "../common/CarCard";
import { Button, Box, Typography } from "@mui/material";
import RentalDateTimePicker from "../common/RentalDateTimePicker"
export const CarOverView = ({ CarData, large, onRentalTimeChange }) => {
    return (
        <Box sx={{ p: 1 }} >
            <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", mb: 2 }}>
                Car Details
            </Typography>
            <Box sx={{ border: "1px solid #d6d6d6", p: 3, borderRadius: 2 }}>
                <Grid container spacing={2} alignItems="stretch">
                    <Grid item xs={8.5}>
                        <CarCard carData={CarData} large={large} />
                    </Grid>
                    <Grid item xs={3.5} sx={{ border: "1px solid #d6d6d6", p: 4, borderRadius: 8, backgroundColor: "rgb(247, 251, 255)" }}>
                        <Grid
                            container
                            justifyContent="center"
                            sx={{
                                marginTop: "15px",
                            }}
                        >
                            <RentalDateTimePicker onRentalTimeChange={onRentalTimeChange} available={CarData.available} />
                            <Button
                                variant="contained"
                                disabled={!CarData.available}
                                sx={{
                                    backgroundColor: "#05ce80",
                                    color: "white",
                                    "&:hover": { backgroundColor: "#04b16d" },
                                    width: "50%",
                                    paddingY: 1,
                                    paddingX: 2,
                                    fontSize: "1rem",
                                    height: "auto",
                                    margin: 2,
                                }}
                            >
                                Rent Now
                            </Button>

                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </Box >
    )
}