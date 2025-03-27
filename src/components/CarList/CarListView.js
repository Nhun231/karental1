import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const CarListView = ({ ListCar }) => {

    const navigate = useNavigate();
    return (
        <TableContainer component={Paper} sx={{ p: 2 }}>
            <Table >
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
                        <TableRow
                            key={carData.id}
                            sx={{ backgroundColor: index % 2 === 0 ? "#f5f5f5" : "white" }}
                        >
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{carData.brand + " " + carData.model}</TableCell>
                            <TableCell><img src={carData.carImageFront} alt="car-img" style={{ width: "200px", height: "150px" }} /></TableCell>
                            <TableCell>
                                <Box sx={{ display: "flex", alignItems: "center", my: 1 }}>
                                    {carData.averageRatingByCar < 1 ? (
                                        <Typography
                                            sx={{
                                                fontSize: "0.875rem",
                                                fontStyle: "italic",
                                                color: "gray",
                                                ml: 1,
                                            }}
                                        >
                                            No ratings
                                        </Typography>
                                    ) : (carData.averageRatingByCar)}
                                </Box>
                            </TableCell>
                            <TableCell>{carData.noOfRides || 0}</TableCell>
                            <TableCell>
                                <span
                                    style={{ color: "#05ce80", fontSize: "1.1rem", fontWeight: "bold" }}
                                >
                                    <strong>
                                        {new Intl.NumberFormat("vi-VN").format(carData.basePrice)}đ/day
                                    </strong>
                                </span>
                            </TableCell>
                            <TableCell><strong>{carData.address}</strong></TableCell>
                            <TableCell>{carData.status}</TableCell>
                            <TableCell>
                                <Button
                                    variant="contained"
                                    onClick={() => navigate(`/car-detail/${carData.id}`,)}
                                    sx={{
                                        backgroundColor: "#1976d2",
                                        color: "white",
                                        "&:hover": { backgroundColor: "#1565c0" },
                                        width: "100%",
                                        paddingY: 1,
                                        paddingX: 2,
                                        fontSize: "0.7rem",
                                        height: "auto",
                                        mb: 2,
                                    }}
                                >
                                    View details
                                </Button>
                                <Button
                                    variant="contained"
                                    sx={{
                                        backgroundColor: "#05ce80",
                                        color: "white",
                                        "&:hover": { backgroundColor: "#04b16d" },
                                        width: "100%",
                                        paddingY: 1,
                                        paddingX: 2,
                                        fontSize: "0.7rem",
                                        height: "auto",
                                    }}
                                >
                                    Rent Now
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default CarListView;
