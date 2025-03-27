import { useState, useEffect } from "react";
import {
    Typography,
    IconButton,
    FormControl,
    MenuItem,
    Box,
    Divider,
    Button,
    Select
} from "@mui/material";
import { GridView, List as ListViewIcon } from "@mui/icons-material";
import CarCard from "../common/CarCard";
import { Grid } from "@mui/joy";
import CarListView from "./CarListView";
import { useNavigate } from "react-router-dom";
import emptydata from "../../assets/emptydata.png"
const SearchResults = ({ CarData, totalElement, sortOption, setSortOption, setPage }) => {
    const navigate = useNavigate();

    // State to handle switch view
    const [isListView, setIsListView] = useState(false);
    return (
        <Box sx={{
            mt: 4,
        }}>
            <Typography variant="h4" fontWeight="bold" sx={{ textAlign: "center" }}>Search Result</Typography>

            <Box
                sx={{
                    maxWidth: "1200px",
                    mx: "auto",
                    mt: 4,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <Typography variant="subtitle1" >
                    There're <span style={{ color: "#05ce80", fontWeight: "bold" }}>{totalElement} cars</span> that are available for you!
                </Typography>

                {/* Icon and Filter */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <IconButton
                        onClick={() => setIsListView(true)}
                        sx={{
                            color: isListView ? "#05ce80" : "inherit",
                        }}
                    >
                        <ListViewIcon />
                    </IconButton>

                    <IconButton
                        onClick={() => setIsListView(false)}
                        sx={{
                            color: !isListView ? "#05ce80" : "inherit",
                        }}
                    >
                        <GridView />
                    </IconButton>

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
            {isListView ? (
                <Box sx={{
                    maxWidth: "1200px",
                    mx: "auto",
                    mt: 4,
                    border: "1px solid #ccc",
                    borderRadius: "6px",
                    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.3)"
                }}>
                    {Array.isArray(CarData) && CarData.length === 0 ? (
                        <img src={emptydata} style={{ display: "block", margin: "32px auto", padding: "0px 24px" }} alt="empty" />
                    ) : (<CarListView ListCar={CarData}></CarListView>)}

                </Box>
            ) : (
                <Box sx={{
                    maxWidth: "1200px",
                    mx: "auto",
                    mt: 4,
                    py: 4,
                    px: 3,
                    border: "1px solid #ccc",
                    borderRadius: "6px",
                    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.3)"

                }}>
                    {Array.isArray(CarData) && CarData.length === 0 && (
                        <img src={emptydata} style={{ display: "block", margin: "0 auto" }} alt="empty" />
                    )}

                    <Grid container direction="column" spacing={3} >
                        {CarData.map((car) => (
                            <Grid item xs={12} md={12} key={car.id} id="card-c">
                                <Grid container spacing={20} >
                                    {/* Cột chứa CarCard */}
                                    <Grid item xs={12} md={12}>
                                        <CarCard carData={car} />
                                    </Grid>

                                    {/* Cột chứa Buttons */}
                                    <Grid
                                        item
                                        xs={12} md={12}
                                        container
                                        direction="column"
                                        spacing={2}
                                        alignItems="flex-end"
                                        sx={{ height: "100%", justifyContent: "space-between", mt: 4 }}
                                    >
                                        <Button
                                            variant="contained"
                                            onClick={() => navigate(`/car-detail/${car.id}`, { replace: true })}
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
                                    </Grid>
                                </Grid>
                                <Divider sx={{ mt: 2 }} />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )
            }

        </Box >

    )
}
export default SearchResults;