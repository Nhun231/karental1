import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Box, Typography } from "@mui/material";
import { Divider, Grid } from "@mui/joy";
import { useSelector, useDispatch } from "react-redux";
import { setRentalTime, setAddress } from "../../reducers/RentalTimeReducer";
import dayjs from "dayjs";
import bannerimg from "../../assets/search-img.jpg";
import AddressSelector from "../common/AddressSelector";
import RentalDatePicker from "../common/RentalDateTimePicker";

const SearchCar = () => {
    const pickUpTime = useSelector((state) => state.rental.pickUpTime);
    const dropOffTime = useSelector((state) => state.rental.dropOffTime);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [errorMsg, setErrorMsg] = useState({});
    const reduxAddress = useSelector((state) => state.rental.address);
    const handleRentalTimeChange = (newPickUpTime, newDropOffTime) => {
        const pickUpTime = dayjs(newPickUpTime);
        const dropOffTime = dayjs(newDropOffTime);
        dispatch(setRentalTime({ pickUpTime, dropOffTime }));
    };

    const validateField = (name, value) => {
        if (!value || !value.trim()) {
            if (name === "cityProvince") return "Please select a city/province";
            if (name === "district") return "Please select a district";
            if (name === "ward") return "Please select a ward";
            if (name === "houseNumberStreet") return "";
            return "This field is required";
        }
        return "";
    };

    const validate = () => {
        let errors = {};
        Object.keys(reduxAddress).forEach((key) => {
            console.log("reduxaddress", reduxAddress)
            const error = validateField(key, reduxAddress[key]);
            console.log("loi", error, "o key", key)
            if (error) errors[key] = error;
        });

        setErrorMsg(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = () => {
        console.log(errorMsg)
        console.log(validate())
        if (!validate()) return;
        const address = `${reduxAddress.cityProvince}, ${reduxAddress.district}, ${reduxAddress.ward}`;
        const queryParams = new URLSearchParams({
            address: address,
            pickUpTime: pickUpTime,
            dropOffTime: dropOffTime,
            page: 0,
            size: 10,
            sort: "productionYear,desc",
        }).toString();
        console.log(queryParams)
        navigate(`/search-result?${queryParams}`);
    };
    return (
        <Box
            sx={{
                maxWidth: "1200px",
                mx: "auto",
                mt: 4,
                minHeight: { xs: "auto", md: "550px" },
                backgroundImage: `url(${bannerimg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                position: "relative",
                borderRadius: "16px",
                overflow: "hidden",
                "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.55)",
                    zIndex: 1,
                },
            }}
        >
            <Grid container sx={{ position: "relative", zIndex: 2, p: 4, color: "white", }}>
                {/* Left Side Text */}
                <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", justifyContent: "center", gap: 2 }}>
                    <Typography variant="h3" fontWeight="bold">
                        Looking for a <span style={{ color: "#05ce80" }}>vehicle</span>?
                    </Typography>
                    <Typography variant="h3" fontWeight="bold">
                        You're at the <span style={{ color: "#05ce80" }}>right</span> place.
                    </Typography>
                    <Typography variant="subtitle1" sx={{ mt: 4, lineHeight: 1.6 }}>
                        We have a <span style={{ color: "#05ce80" }}>large selection</span> of locally owned cars
                        available for you to choose from. Rental plans
                        are <span style={{ color: "#05ce80" }}>customised</span> to suit your needs.
                    </Typography>
                    <Divider sx={{ height: "1px", bgcolor: "rgb(255, 255, 255)", width: "60%", alignSelf: "center" }}></Divider>
                    <Typography variant="subtitle1" sx={{ lineHeight: 1.6, mb: 2 }}>
                        With over <span style={{ color: "#05ce80" }}>300 cars</span> located nationwide we will
                        have something for you.
                    </Typography>
                </Grid>


                {/* Right Side Search Box */}
                <Grid item xs={12} md={6}>
                    <Box
                        sx={{
                            backgroundColor: "rgba(255, 255, 255, 0.3)",
                            padding: 3,
                            borderRadius: "12px",
                            boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.3)",
                        }}
                    >
                        <Typography variant="h5" fontWeight="bold">
                            Find the ideal car rental for your trip
                        </Typography>

                        {/* Pick-up Location */}
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                                Pick-up Location
                            </Typography>
                            <AddressSelector
                                errorMsg={errorMsg}
                                isSearch={true}
                                useRedux={true}
                                setErrorMsg={setErrorMsg}
                            />
                        </Box>

                        {/* Rental Time Picker */}
                        <Grid item xs={12} md={8}>
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                                    Rental Time
                                </Typography>
                                <RentalDatePicker onRentalTimeChange={handleRentalTimeChange} />
                            </Box>
                        </Grid>

                        {/* Search Button */}
                        <Box sx={{ textAlign: "center", mt: 2 }}>
                            <Button
                                variant="contained"
                                onClick={handleSubmit}
                                sx={{
                                    padding: "10px 20px",
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                    borderRadius: "8px",
                                    bgcolor: "#05ce80",
                                    "&:hover": {
                                        bgcolor: "#048c5a",
                                    },
                                }}
                            >
                                Search
                            </Button>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};
export default SearchCar;
