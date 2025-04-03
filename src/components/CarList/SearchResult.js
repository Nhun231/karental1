import { useState } from "react";
import {
    Typography,
    IconButton,
    FormControl,
    MenuItem,
    Box,
    Divider,
    Select,
    Grid
} from "@mui/material";
import { GridView, List as ListViewIcon } from "@mui/icons-material";
import CarCard from "../common/CarCard";
import CarListView from "./CarListView";
import { useNavigate } from "react-router-dom";
import emptydata from "../../assets/emptydata.png"
import { Button } from "@mui/joy";
/**
 *
 * Search Result Component
 * Display list of result when user search car
 * User can interactions with UI to choose thumbnail view/ grid view
 */
const SearchResults = ({ CarData, totalElement, sortOption, setSortOption, setPage }) => {
    const navigate = useNavigate();

    // State to handle switch view
    const [isListView, setIsListView] = useState(false);
    return (
        <Box sx={{
            mt: 4,
        }}>
            {/* Title */}
            <Typography variant="h4" fontWeight="bold" sx={{ textAlign: "center" }}>Search Result</Typography>
            {/* Content */}
            <Box
                sx={{
                    maxWidth: "1200px",
                    mx: "auto",
                    mt: 4,
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <Typography variant="subtitle1" >
                    There're <span style={{ color: "#05ce80", fontWeight: "bold" }}>{totalElement} cars</span> that are available for you!
                </Typography>

                {/* Icon and Filter */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    {/* List View Icon */}
                    <IconButton
                        onClick={() => setIsListView(true)}
                        sx={{
                            color: isListView ? "#05ce80" : "inherit",
                        }}
                    >
                        <ListViewIcon />
                    </IconButton>
                    {/* Grid View Icon */}
                    <IconButton
                        onClick={() => setIsListView(false)}
                        sx={{
                            color: !isListView ? "#05ce80" : "inherit",
                        }}
                    >
                        <GridView />
                    </IconButton>
                    {/* Filter */}
                    <FormControl sx={{ minWidth: "200px" }}>
                        <Select
                            value={sortOption}
                            onChange={(e) => {
                                setSortOption(e.target.value);
                                setPage(1);
                            }}
                        >
                            <MenuItem value="newest">Newest to Oldest</MenuItem>
                            <MenuItem value="oldest">Oldest to Newest</MenuItem>
                            <MenuItem value="priceHigh">Price: High to Low</MenuItem>
                            <MenuItem value="priceLow">Price: Low to High</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </Box>
            {/* Display Search Result */}
            {isListView ? (
                <Box
                    className="border-box"
                    sx={{
                        maxWidth: "1200px",
                        mx: "auto",
                        mt: 4,

                    }}>
                    {Array.isArray(CarData) && CarData.length === 0 ? (
                        <img src={emptydata} style={{ display: "block", margin: "32px auto", padding: "0px 24px", backgroundColor: "white" }} alt="empty" />
                    ) : (<CarListView ListCar={CarData}></CarListView>)}

                </Box>
            ) : (
                <Box
                    className="border-box"
                    sx={{
                        maxWidth: "1200px",
                        mx: "auto",
                        mt: 4,
                        py: 4,
                    }}>
                    {Array.isArray(CarData) && CarData.length === 0 && (
                        <img src={emptydata} style={{ display: "block", margin: "0 auto", bgcolor: "white" }} alt="empty" />
                    )}

                    <Grid container direction="column" spacing={1}>
                        {CarData.map((car) => (
                            <Grid item xs={12} md={12} key={car.id} id="card-c">
                                <Grid container spacing={1}>
                                    {/* CarCard */}
                                    <Grid
                                        item xs={12} sm={10}
                                        sx={{
                                            height: "100%",
                                            display: "flex",
                                            justifyContent: "center"
                                        }}
                                    >
                                        <CarCard carData={car} />
                                    </Grid>
                                    {/* Buttons */}
                                    <Grid
                                        item
                                        xs={12}
                                        sm={2}
                                        container
                                        direction={{ xs: "row", sm: "column" }}
                                        spacing={1}
                                        alignItems="center"
                                        justifyContent={{ xs: "center", sm: "flex-start" }}
                                        sx={{ mt: { xs: 0, sm: 2 }, gap: 1 }}
                                    >
                                        {["View details", "Rent Now"].map((text, index) => (
                                            <Button
                                                key={index}
                                                variant="contained"
                                                onClick={index === 0 ? () => navigate(`/car-detail/${car.id}`, { replace: true }) : () => navigate(`/booking-infor/${car.id}`, { replace: true })}
                                                sx={{
                                                    backgroundColor: index === 0 ? "#1976d2" : "#05ce80",
                                                    "&:hover": { backgroundColor: index === 0 ? "#1565c0" : "#04d16b" },
                                                    width: { xs: "30%", sm: "60%" },
                                                    height: "auto",
                                                    color: "white",
                                                    fontSize: { xs: "0.75rem", md: "1rem" },
                                                    py: 0.5,
                                                    px: 2,
                                                }}
                                            >
                                                {text}
                                            </Button>
                                        ))}
                                    </Grid>
                                </Grid>
                                <Divider sx={{ mt: 2, width: "100%", boxSizing: "border-box" }} />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}
        </Box >
    )
}
export default SearchResults;