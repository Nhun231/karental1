import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import { useSearchParams } from "react-router-dom";
import BookingCard from "../components/common/BookingCard";
import { useEffect, useState } from "react";
import { getMyBookings } from "../services/BookingServices";
import {
    Breadcrumbs,
    Link,
    Typography,
    Box,
    FormControl,
    MenuItem,
    Select,
    TextField,
    CircularProgress,
} from "@mui/material";
import Swal from "sweetalert2";
import { Grid, Divider, Button } from "@mui/joy";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Pagination from "../components/common/Pagination";
import {
    getBookingDetail,
    getWallet,
    cancelBooking,
    confirmPickup,
    returnCar,
    payDepositAgain,
    payTotalFee,
} from "../reducers/rentCarReducer";

const MyBooking = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const [totalElement, setTotalElement] = useState(0);
    const [bookingData, setBookingData] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();

    const [page, setPage] = useState(parseInt(searchParams.get("page")) || 1);
    const [statusFilter, setStatusFilter] = useState(
        searchParams.get("status") || "ALL"
    );
    const [pageSize, setPageSize] = useState(
        parseInt(searchParams.get("size")) || 10
    );
    const [totalPages, setTotalPages] = useState(1);

    const sortMapping = {
        "updatedAt,DESC": "newest",
        "updatedAt,ASC": "oldest",
        "basePrice,DESC": "priceHigh",
        "basePrice,ASC": "priceLow",
    };
    const statusOptions = [
        "ALL",
        "CANCELLED",
        "CONFIRMED",
        "PENDING_PAYMENT",
        "PENDING_DEPOSIT",
        "WAITING_CONFIRMED",
        "IN_PROGRESS",
        "COMPLETED",
        "WAITING_CONFIRMED_RETURN_CAR",
    ];
    const validStatuses = new Set(statusOptions.slice(1));
    const [sortOption, setSortOption] = useState(
        sortMapping[searchParams.get("sort")] || "newest"
    );

    const getSortQuery = (option) =>
        ({
            newest: "updatedAt,DESC",
            oldest: "updatedAt,ASC",
            priceHigh: "basePrice,DESC",
            priceLow: "basePrice,ASC",
        }[option] || "updatedAt,DESC");

    useEffect(() => {
        const params = {
            page,
            size: pageSize,
            sort: getSortQuery(sortOption),
        };

        if (validStatuses.has(statusFilter)) {
            params.status = statusFilter;
        }

        document.title = "My Booking";

        setSearchParams(params);
    }, [sortOption, page, pageSize, statusFilter, setSearchParams]);

    const fetchMyBookings = async () => {
        try {
            const params = {
                page: page - 1,
                size: pageSize,
                sort: getSortQuery(sortOption),
            };

            if (validStatuses.has(statusFilter)) {
                params.status = statusFilter;
            }
            const response = await getMyBookings(params);

            setBookingData(response.data.bookings.content || []);
            setTotalElement(response.data.totalOnGoingBookings || 0);
            setTotalPages(response.data.bookings.totalPages);
        } catch (error) {
            console.error("Failed to fetch booking data:", error);
        }
    };

    useEffect(() => {
        fetchMyBookings();
    }, [page, pageSize, sortOption, statusFilter]);

    return (
        <div>
            <Header />
            <Breadcrumbs sx={{ mx: "auto", maxWidth: "1200px", py: 1, px: 2 }}>
                <Link underline="hover" color="inherit" href="/">
                    Home
                </Link>
                <Typography color="text.primary">My Booking</Typography>
            </Breadcrumbs>
            <Box
                sx={{
                    maxWidth: "1200px",
                    mx: "auto",
                    mt: 4,
                }}
            >
                <Typography variant="h4" fontWeight="bold" sx={{ textAlign: "center" }}>
                    My Booking
                </Typography>
            </Box>
            <Box
                sx={{
                    maxWidth: "1200px",
                    mx: "auto",
                    my: 4,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <Typography variant="subtitle1">
                    You have{" "}
                    <span style={{ color: "#05ce80", fontWeight: "bold" }}>
            {totalElement} on-going
          </span>{" "}
                    bookings!
                </Typography>
                <Box>
                    <FormControl sx={{ minWidth: "200px" }} variant="outlined">
                        <TextField
                            select
                            id="sort-select"
                            label="Sort By"
                            value={sortOption}
                            onChange={(e) => {
                                setSortOption(e.target.value);
                                setPage(1);
                            }}
                            fullWidth
                        >
                            <MenuItem value="newest">Newest to Oldest</MenuItem>
                            <MenuItem value="oldest">Oldest to Newest</MenuItem>
                            <MenuItem value="priceHigh">Price: High to Low</MenuItem>
                            <MenuItem value="priceLow">Price: Low to High</MenuItem>
                        </TextField>
                    </FormControl>
                    <FormControl sx={{ minWidth: "200px", ml: 2 }} variant="outlined">
                        <TextField
                            select
                            label="Status Filter"
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setPage(1);
                            }}
                            fullWidth
                        >
                            {statusOptions.map((status) => (
                                <MenuItem key={status} value={status}>
                                    {status}
                                </MenuItem>
                            ))}
                        </TextField>
                    </FormControl>
                </Box>
            </Box>
            <Grid
                container
                direction="column"
                spacing={3}
                sx={{
                    maxWidth: "1200px",
                    mx: "auto",
                    my: 2,
                    border: "1px solid #ccc",
                    borderRadius: "6px",
                    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.3)",
                }}
            >
                {bookingData &&
                    bookingData.map((booking) => (
                        <Grid
                            className="booking-item"
                            data-booking-id={booking.bookingNumber || ""}
                            data-status={booking.status || ""}
                            data-basePrice={booking.basePrice || ""}
                            item
                            xs={12}
                            md={12}
                            key={booking.bookingNumber}
                            sx={{
                                maxWidth: "1200px",
                                mx: "auto",
                                mt: 4,
                            }}
                        >
                            <Grid container spacing={10} alignItems="stretch">
                                <Grid item xs={8.5}>
                                    <BookingCard BookingData={booking} />
                                </Grid>
                                <Grid
                                    item
                                    xs={3.5}
                                    container
                                    direction="column"
                                    spacing={2}
                                    gap={2}
                                    alignItems="flex-end"
                                    sx={{
                                        height: "100%",
                                        justifyContent: "space-between",
                                        marginTop: "40px",
                                    }}
                                >
                                    <Button
                                        variant="contained"
                                        onClick={() =>
                                            navigate(`/edit-booking/${booking.bookingNumber}`)
                                        }
                                        sx={{
                                            backgroundColor: "#1976d2",
                                            color: "white",
                                            "&:hover": { backgroundColor: "#1565c0" },
                                            width: "100%",
                                            paddingY: 1.2,
                                            paddingX: 2,
                                            height: "auto",
                                        }}
                                    >
                                        View Details
                                    </Button>

                                    {/* Show Confirm Pick-Up and Cancel if status is CONFIRMED */}
                                    {booking.status === "CONFIRMED" && (
                                        <>
                                            <Button
                                                variant="contained"
                                                sx={{
                                                    backgroundColor: "#555", // Dark Gray
                                                    color: "white",
                                                    "&:hover": { backgroundColor: "#444" },
                                                    width: "100%",
                                                    paddingY: 1.2,
                                                    paddingX: 2,
                                                    height: "auto",
                                                }}
                                                onClick={async () => {
                                                    const result = await Swal.fire({
                                                        title: "Pick-up this car?",
                                                        text: "Please confirm to pick up the car.",
                                                        icon: "warning",
                                                        showCancelButton: true,
                                                        confirmButtonText: "Yes",
                                                        cancelButtonText: "No",
                                                    });

                                                    if (result.isConfirmed) {
                                                        try {
                                                            setLoading(true);
                                                            await dispatch(
                                                                confirmPickup(booking.bookingNumber)
                                                            ).unwrap();
                                                            fetchMyBookings();
                                                        } catch (error) {
                                                            console.log(error);
                                                        } finally {
                                                            setLoading(false);
                                                        }
                                                    }
                                                }}
                                            >
                                                {loading ? (
                                                    <CircularProgress size={20} color="inherit" />
                                                ) : (
                                                    "Pick-up"
                                                )}
                                            </Button>
                                            <Button
                                                variant="contained"
                                                sx={{
                                                    backgroundColor: "#d32f2f", // Red
                                                    color: "white",
                                                    "&:hover": { backgroundColor: "#b71c1c" },
                                                    width: "100%",
                                                    paddingY: 1.2,
                                                    paddingX: 2,
                                                    height: "auto",
                                                }}
                                                onClick={async () => {
                                                    const result = await Swal.fire({
                                                        title: "Cancel this booking?",
                                                        text: "Do you really want to cancel this booking?",
                                                        icon: "warning",
                                                        showCancelButton: true,
                                                        confirmButtonText: "Yes",
                                                        cancelButtonText: "No",
                                                    });

                                                    if (result.isConfirmed) {
                                                        try {
                                                            setLoading(true);
                                                            await dispatch(
                                                                cancelBooking(booking.bookingNumber)
                                                            ).unwrap();
                                                            fetchMyBookings();
                                                        } catch (error) {
                                                            console.log(error);
                                                        } finally {
                                                            setLoading(false);
                                                        }
                                                    }
                                                }}
                                            >
                                                {loading ? (
                                                    <CircularProgress size={20} color="inherit" />
                                                ) : (
                                                    "Cancel"
                                                )}
                                            </Button>
                                        </>
                                    )}

                                    {/* Show Cancel if status is PENDING_DEPOSIT */}
                                    {booking.status === "PENDING_DEPOSIT" && (
                                        <>
                                            <Button
                                                variant="contained"
                                                sx={{
                                                    backgroundColor: "#d32f2f", // Red
                                                    color: "white",
                                                    "&:hover": { backgroundColor: "#b71c1c" },
                                                    width: "100%",
                                                    paddingY: 1.2,
                                                    paddingX: 2,
                                                    height: "auto",
                                                }}
                                                onClick={async () => {
                                                    const result = await Swal.fire({
                                                        title: "Cancel this booking?",
                                                        text: "Do you really want to cancel this booking?",
                                                        icon: "warning",
                                                        showCancelButton: true,
                                                        confirmButtonText: "Yes",
                                                        cancelButtonText: "No",
                                                    });

                                                    if (result.isConfirmed) {
                                                        try {
                                                            setLoading(true);
                                                            await dispatch(
                                                                cancelBooking(booking.bookingNumber)
                                                            ).unwrap();
                                                            fetchMyBookings();
                                                        } catch (error) {
                                                            console.log(error);
                                                        } finally {
                                                            setLoading(false);
                                                        }
                                                    }
                                                }}
                                            >
                                                {loading ? (
                                                    <CircularProgress size={20} color="inherit" />
                                                ) : (
                                                    "Cancel"
                                                )}
                                            </Button>

                                            <Button
                                                variant="contained"
                                                sx={{
                                                    backgroundColor: "gray", // Red
                                                    color: "white",
                                                    "&:hover": { backgroundColor: "#05ce80" },
                                                    width: "100%",
                                                    paddingY: 1.2,
                                                    paddingX: 2,
                                                    height: "auto",
                                                }}
                                                onClick={(e) => {
                                                    Swal.fire({
                                                        title: "Pay deposit car?",
                                                        text: "Please confirm to pay deposit .",
                                                        icon: "warning",
                                                        showCancelButton: true,
                                                        confirmButtonText: "Yes",
                                                        cancelButtonText: "No",
                                                    }).then((result) => {
                                                        if (result.isConfirmed) {
                                                            setLoading(true);
                                                            dispatch(
                                                                payDepositAgain(booking.bookingNumber)
                                                            ).finally(() => {
                                                                setLoading(false);
                                                            });
                                                        }
                                                    });
                                                }}
                                            >
                                                {loading ? (
                                                    <CircularProgress size={20} color="inherit" />
                                                ) : (
                                                    "Pay Deposit"
                                                )}
                                            </Button>
                                        </>
                                    )}

                                    {/* Show Return Cars if status is IN_PROGRESS */}
                                    {booking.status === "IN_PROGRESS" && (
                                        <Button
                                            variant="contained"
                                            sx={{
                                                backgroundColor: "#05ce80", // Red
                                                color: "white",
                                                "&:hover": { backgroundColor: "#05ce55" },
                                                width: "100%",
                                                paddingY: 1.2,
                                                paddingX: 2,
                                                height: "auto",
                                            }}
                                            onClick={(e) => {
                                                if (booking.totalPrice <= booking.deposit) {
                                                    Swal.fire({
                                                        title: "Return car?",
                                                        text: `Please confirm to return the car. The remaining amount of ${new Intl.NumberFormat(
                                                            "en-US"
                                                        ).format(
                                                            booking.deposit - booking.totalPrice
                                                        )} VND will be return to your wallet.The car owner must confirm your early return request. If declined, you must keep the car until the original return time.`,
                                                        icon: "warning",
                                                        showCancelButton: true,
                                                        confirmButtonText: "Yes",
                                                        cancelButtonText: "No",
                                                    }).then((result) => {
                                                        if (result.isConfirmed) {
                                                            setLoading(true);
                                                            dispatch(
                                                                confirmPickup(booking.bookingNumber)
                                                            ).finally(() => {
                                                                setLoading(false);
                                                                fetchMyBookings();
                                                            });
                                                        }
                                                    });
                                                } else {
                                                    Swal.fire({
                                                        title: "Return car?",
                                                        text: `Please confirm to return the car. The exceeding amount of ${new Intl.NumberFormat(
                                                            "en-US"
                                                        ).format(
                                                            booking.totalPrice - booking.deposit
                                                        )} VND will be deducted from your wallet.The car owner must confirm your early return request. If declined, you must keep the car until the original return time.`,
                                                        icon: "warning",
                                                        showCancelButton: true,
                                                        confirmButtonText: "Yes",
                                                        cancelButtonText: "No",
                                                    }).then((result) => {
                                                        if (result.isConfirmed) {
                                                            setLoading(true);
                                                            dispatch(
                                                                returnCar(booking.bookingNumber)
                                                            ).finally(() => {
                                                                setLoading(false);
                                                                fetchMyBookings();
                                                            });
                                                        }
                                                    });
                                                }
                                            }}
                                        >
                                            {loading ? (
                                                <CircularProgress size={20} color="inherit" />
                                            ) : (
                                                "Return Car"
                                            )}
                                        </Button>
                                    )}

                                    {/* Show Cancel if status is PENDING_PAYMENT */}
                                    {booking.status === "PENDING_PAYMENT" && (
                                        <Button
                                            variant="contained"
                                            sx={{
                                                backgroundColor: "green", // Red
                                                color: "white",
                                                "&:hover": { backgroundColor: "#05ce10" },
                                                width: "100%",
                                                paddingY: 1.2,
                                                paddingX: 2,
                                                height: "auto",
                                            }}
                                            onClick={async () => {
                                                const result = await Swal.fire({
                                                    title: "Pay total fee car?",
                                                    text: "Please confirm to pay total fee.",
                                                    icon: "warning",
                                                    showCancelButton: true,
                                                    confirmButtonText: "Yes",
                                                    cancelButtonText: "No",
                                                });

                                                if (result.isConfirmed) {
                                                    try {
                                                        setLoading(true);
                                                        await dispatch(
                                                            payTotalFee({ bookingNumber: booking.bookingNumber, status: booking.status })
                                                        ).unwrap();
                                                        fetchMyBookings();
                                                    } catch (error) {
                                                        console.log(error);
                                                    } finally {
                                                        setLoading(false);
                                                    }
                                                }
                                            }}
                                        >
                                            {loading ? (
                                                <CircularProgress size={20} color="inherit" />
                                            ) : (
                                                "Complete Payment"
                                            )}
                                        </Button>
                                    )}
                                </Grid>
                            </Grid>
                            <Divider sx={{ mt: 2 }} />
                        </Grid>
                    ))}
            </Grid>
            {/* Pagination */}
            <Pagination
                page={page - 1}
                totalPages={totalPages}
                onPageChange={(newPage) => setPage(newPage + 1)}
                pageSize={pageSize}
                onPageSizeChange={(size) => {
                    setPageSize(size);
                    setPage(1);
                }}
            />
            <Box sx={{ mt: 4 }}>
                <Footer />
            </Box>
        </div>
    );
};
export default MyBooking;
