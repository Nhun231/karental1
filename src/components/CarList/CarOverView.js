import { Button, Box, Typography, Grid } from "@mui/material";
import CarCard from "../common/CarCard";
import RentalDateTimePicker from "../common/RentalDateTimePicker";
import {useNavigate, useParams} from "react-router-dom";

/**
 * CarOverView Component
 * Display OverView about Car Detail
 * View Car Status in a specific time
 */
export const CarOverView = ({ CarData, large, onRentalTimeChange }) => {
    const navigate = useNavigate();
    const { id } = useParams();
    return (
        <Box sx={{ borderRadius: "8px" }}>
            {/* Title */}
            <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", mb: 2, textAlign: "center" }}>
                Car Details
            </Typography>

            {/* Content */}
            <Box className="border-box" sx={{ p: 2 }}>
                <Grid container alignItems="stretch">
                    {/* Display Car Card */}
                    <Grid item xs={12} sm={8.5}>
                        <CarCard carData={CarData} large={large} />
                    </Grid>

                    {/* Display RentalDate Time Picker */}
                    <Grid
                        item
                        xs={12}
                        sm={3.5}
                        sx={{ border: "1px solid #d6d6d6", p: 1, borderRadius: 2, backgroundColor: "rgb(247, 251, 255)" }}
                    >
                        <Grid container justifyContent="center" sx={{ mt: 2 }}>
                            <RentalDateTimePicker onRentalTimeChange={onRentalTimeChange} available={CarData.available} />

                            {/* Button Trigger Rent A Car */}
                            <Button
                                variant="contained"
                                disabled={!CarData.available}
                                onClick={() => navigate(`/booking-infor/${id}`)}
                                sx={{
                                    backgroundColor: "#05ce80",
                                    color: "white",
                                    "&:hover": { backgroundColor: "#04b16d" },
                                    width: "50%",
                                    py: 1,
                                    px: 2,
                                    fontSize: "1rem",
                                    height: "auto",
                                    mt: 2,
                                }}
                            >
                                Rent Now
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};
