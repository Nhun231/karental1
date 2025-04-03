import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Typography, Grid
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/joy";
const CarListView = ({ ListCar }) => {
    const navigate = useNavigate();

    return (
        <Box sx={{ p: { sm: 1, md: 2 }, }}>
            <Grid container spacing={2}>
                {/* Display TableView on md screen */}
                <Grid item xs={12} sx={{ display: { xs: "none", sm: "block" } }}>
                    <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>No</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Image</TableCell>
                                    <TableCell>Ratings</TableCell>
                                    <TableCell>No. of Rides</TableCell>
                                    <TableCell>Price</TableCell>
                                    <TableCell>Location</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {ListCar.map((carData, index) => (
                                    <TableRow key={carData.id} sx={{ backgroundColor: index % 2 === 0 ? "#f5f5f5" : "white" }}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{carData.brand + " " + carData.model}</TableCell>
                                        <TableCell>
                                            <img src={carData.carImageFront} alt="car-img" style={{ width: "100px", height: "75px" }} />
                                        </TableCell>
                                        <TableCell>
                                            {carData.averageRatingByCar < 1 ? "No ratings" : carData.averageRatingByCar}
                                        </TableCell>
                                        <TableCell>{carData.noOfRides || 0}</TableCell>
                                        <TableCell>
                                            <strong style={{ color: "#05ce80" }}>
                                                {new Intl.NumberFormat("vi-VN").format(carData.basePrice)}đ/day
                                            </strong>
                                        </TableCell>
                                        <TableCell>{carData.address}</TableCell>
                                        <TableCell> <strong style={{ color: "#05ce80" }}>{carData.status}</strong></TableCell>
                                        <TableCell>
                                            {["View details", "Rent Now"].map((text, index) => (
                                                <Button
                                                    key={index}
                                                    variant="contained"
                                                    onClick={index === 0 ? () => navigate(`/car-detail/${carData.id}`) : () => navigate(`/booking-infor/${carData.id}`)}
                                                    sx={{
                                                        backgroundColor: index === 0 ? "#1976d2" : "#05ce80",
                                                        "&:hover": { backgroundColor: index === 0 ? "#1565c0" : "#04d16b" },
                                                        width: { xs: "30%", md: "80%" },
                                                        height: "auto",
                                                        color: "white",
                                                        fontSize: { xs: "0.75rem", md: "1rem" },
                                                        py: 0.5,
                                                        px: 2,
                                                        mt: 1,
                                                    }}
                                                >
                                                    {text}
                                                </Button>
                                            ))}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>

                {/* Display ListView on sm,xs screen */}
                <Grid item xs={12} sx={{ display: { xs: "block", sm: "none" } }}>
                    <Box sx={{ display: "grid", gap: 4, }}>
                        {ListCar.map((carData, index) => (
                            <Paper key={carData.id} sx={{ p: 2, borderRadius: 2, boxShadow: 2 }}>
                                <Box display="flex" alignItems="center" gap={2} flexDirection="column">
                                    <img src={carData.carImageFront} alt="car" style={{ width: "250px", height: "180px", borderRadius: 8, }} />
                                    <Box flexGrow={1}>
                                        <Typography variant="h6" fontWeight="bold">{carData.brand} {carData.model}</Typography>
                                        <Box
                                            sx={{
                                                display: "inline-block",
                                                backgroundColor: "rgba(16, 185, 129, 0.2)",
                                                color: "#065f46",
                                                fontSize: "0.75rem",
                                                fontWeight: "medium",
                                                textTransform: "uppercase",
                                                letterSpacing: "0.05em",
                                                borderRadius: "8px",
                                                padding: "4px 10px",
                                            }}
                                        >
                                            {carData.status}
                                        </Box>
                                        <Typography color="textSecondary">{carData.address}</Typography>
                                        <Typography fontWeight="bold" color="primary">
                                            {new Intl.NumberFormat("vi-VN").format(carData.basePrice)}đ/day
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box display="flex" flexDirection="column" alignItems="start" mt={1}>
                                    <Typography
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 0.5,
                                            color: "gray",
                                            fontSize: { xs: "0.875rem", md: "1rem" },
                                            fontWeight: 500
                                        }}
                                    >
                                        ⭐ {carData.averageRatingByCar ? `${carData.averageRatingByCar}/5 • ${carData.noOfRides} rides` : "No ratings"}
                                    </Typography>
                                    <Box display="flex" justifyContent="space-between" width="100%">
                                        {["View details", "Rent Now"].map((text, index) => (
                                            <Button
                                                key={index}
                                                variant="contained"
                                                onClick={index === 0 ? () => navigate(`/car-detail/${carData.id}`) : () => navigate(`/booking-infor/${carData.id}`)}
                                                sx={{
                                                    backgroundColor: index === 0 ? "#1976d2" : "#05ce80",
                                                    "&:hover": { backgroundColor: index === 0 ? "#1565c0" : "#04d16b" },
                                                    width: { xs: "40%" },
                                                    height: "auto",
                                                    color: "white",
                                                    fontSize: { xs: "0.75rem", md: "1rem" },
                                                    py: 0.5,
                                                    px: 2,
                                                    mt: 1,
                                                }}
                                            >
                                                {text}
                                            </Button>
                                        ))}
                                    </Box>
                                </Box>
                            </Paper>
                        ))}
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default CarListView;
