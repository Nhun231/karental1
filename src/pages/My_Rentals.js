import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import { useSearchParams, Link } from "react-router-dom";
import BookingCard from "../components/common/BookingCard";
import { useEffect, useState } from "react";
import {
    Breadcrumbs,
    Typography,
    Box,
    FormControl,
    Link as MUILink,
    MenuItem,
    TextField,
    CircularProgress,
} from "@mui/material";
import { Grid, Divider, Button } from "@mui/joy";
import { getMyRentals, confirmBooking } from "../services/BookingServices";
import Pagination from "../components/common/Pagination";
import ConfirmationDialog from "../components/common/ConfirmationDialog";
import NotificationSnackbar from "../components/common/NotificationSnackbar";
import {
    confirmEarlyReturn,
    rejectEarlyReturn,
    rejectRentCar,
} from "../reducers/rentCarReducer";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";

const MyRentals = () => {
    const dispatch = useDispatch();
    const [totalElement, setTotalElement] = useState(0);
    const [loading, setLoading] = useState(false);
    const [bookingData, setBookingData] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [page, setPage] = useState(parseInt(searchParams.get("page")) || 1);
    const [statusFilter, setStatusFilter] = useState(
        searchParams.get("status") || "ALL"
    );
    const [openConfirm, setOpenConfirm] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [alert, setAlert] = useState({
        open: false,
        message: "",
        severity: "success",
    });
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
    ];
    const validStatuses = new Set(statusOptions.slice(1));
    const [sortOption, setSortOption] = useState(
        sortMapping[searchParams.get("sort")] || "newest"
    );
    useEffect(() => {
        const params = {
            page,
            size: pageSize,
            sort: getSortQuery(sortOption),
        };

        if (validStatuses.has(statusFilter)) {
            params.status = statusFilter;
        }

        setSearchParams(params);
    }, [sortOption, page, pageSize, statusFilter, setSearchParams]);
    const getSortQuery = (option) =>
        ({
            newest: "updatedAt,DESC",
            oldest: "updatedAt,ASC",
            priceHigh: "basePrice,DESC",
            priceLow: "basePrice,ASC",
        }[option] || "updatedAt,DESC");

    const fetchMyBookings = async () => {
        try {
            const params = {
                page: page - 1,
                size: pageSize,
                sort: getSortQuery(sortOption),
            };
            if (validStatuses.has(statusFilter)) params.status = statusFilter;
            const response = await getMyRentals(params);
            setBookingData(response.data.bookings.content || []);
            setTotalElement(response.data.totalWaitingConfirmBooking || 0);
            setTotalPages(response.data.bookings.totalPages);
        } catch (error) {
            console.error("Failed to fetch booking data:", error);
        }
        document.title = "My Rentals";
    };

    useEffect(() => {
        fetchMyBookings();
    }, [page, pageSize, sortOption, statusFilter]);

    const handleConfirm = (id) => {
        setConfirmAction(() => async () => {
            try {
                await confirmBooking(id);
                setAlert({
                    open: true,
                    message: "Booking confirmed successfully!",
                    severity: "success",
                });
                setLoading(true);
                fetchMyBookings();
            } catch (error) {
                setAlert({
                    open: true,
                    message: error.response?.data?.message || "Failed to confirm booking",
                    severity: "error",
                });
            } finally {
                setLoading(false);
            }
            setOpenConfirm(false);
        });
        setOpenConfirm(true);
    };

    return (
        <div>
            <Header></Header>
            <Breadcrumbs sx={{ mx: "auto", maxWidth: "1200px", py: 1, px: 2 }}>
                <MUILink underline="hover" color="inherit" href="/">
                    Home
                </MUILink>
                <Typography color="text.primary">My Rentals</Typography>
            </Breadcrumbs>
            <Box
                sx={{
                    maxWidth: "1200px",
                    mx: "auto",
                    mt: 4,
                }}
            >
                <Typography variant="h4" fontWeight="bold" sx={{ textAlign: "center" }}>
                    My Rentals
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
            {totalElement} waiting-approved
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
                            id="status-filter"
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
                {bookingData && bookingData.length > 0 ? (
                    bookingData.map((booking) => (
                        <Grid
                            className="rental-item"
                            data-rental-id={booking.bookingNumber || ""}
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
                            <Grid container spacing={4} alignItems="stretch">
                                <Grid item xs={9}>
                                    <BookingCard BookingData={booking} />
                                </Grid>
                                <Grid
                                    item
                                    xs={3}
                                    container
                                    direction="column"
                                    spacing={2}
                                    gap={2}
                                    alignItems="flex-end"
                                    sx={{
                                        height: "100%",
                                        justifyContent: "space-between",
                                        marginTop: "20px",
                                    }}
                                >
                                    <Button
                                        component={Link}
                                        to={`/rental-detail/${booking.bookingNumber}`}
                                        variant="contained"
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

                                    {/* Show Approve Request if status is WAITING_CONFIRMED */}
                                    {booking.status === "WAITING_CONFIRMED" && (
                                        <>
                                            <Button
                                                disabled={loading}
                                                variant="contained"
                                                sx={{
                                                    backgroundColor: "#05ce80",
                                                    color: "white",
                                                    "&:hover": { backgroundColor: "#04b16d" },
                                                    width: "100%",
                                                    paddingY: 1.2,
                                                    paddingX: 2,
                                                    height: "auto",
                                                }}
                                                onClick={() => handleConfirm(booking.bookingNumber)}
                                            >
                                                {loading ? (
                                                    <CircularProgress size={20} color="inherit" />
                                                ) : (
                                                    "Approve Request"
                                                )}
                                            </Button>
                                            <Button
                                                variant="contained"
                                                disabled={loading}
                                                sx={{
                                                    backgroundColor: "red",
                                                    color: "white",
                                                    "&:hover": { backgroundColor: "#04b16d" },
                                                    width: "100%",
                                                    paddingY: 1.2,
                                                    paddingX: 2,
                                                    height: "auto",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    gap: 1, // Khoảng cách giữa chữ và icon loading
                                                }}
                                                onClick={async () => {
                                                    const result = await Swal.fire({
                                                        title: "Are you sure?",
                                                        text: "Do you really want to reject this booking?",
                                                        icon: "warning",
                                                        showCancelButton: true,
                                                        confirmButtonText: "Yes, reject it!",
                                                        cancelButtonText: "No, keep it",
                                                    });

                                                    if (result.isConfirmed) {
                                                        try {
                                                            setLoading(true);
                                                            await dispatch(
                                                                rejectRentCar(booking.bookingNumber)
                                                            ).unwrap(); // Đợi action hoàn tất
                                                            fetchMyBookings();
                                                        } catch (error) {
                                                            console.error("Error rejecting booking:", error);
                                                        } finally {
                                                            setLoading(false); // Đảm bảo loading được reset
                                                        }
                                                    }
                                                }}
                                            >
                                                Reject Request
                                                {loading && (
                                                    <CircularProgress size={20} color="inherit" />
                                                )}
                                            </Button>
                                        </>
                                    )}
                                    {booking.status === "WAITING_CONFIRMED_RETURN_CAR" && (
                                        <>
                                            <Button
                                                variant="contained"
                                                disabled={loading}
                                                sx={{
                                                    backgroundColor: "#05ce80",
                                                    color: "white",
                                                    "&:hover": { backgroundColor: "#04b16d" },
                                                    width: "100%",
                                                    paddingY: 1.2,
                                                    paddingX: 2,
                                                    height: "auto",
                                                }}
                                                onClick={async () => {
                                                    const result = await Swal.fire({
                                                        title: "Are you sure?",
                                                        text: "Do you really want to return early this booking?",
                                                        icon: "warning",
                                                        showCancelButton: true,
                                                        confirmButtonText: "Yes, return it!",
                                                        cancelButtonText: "No, keep it",
                                                    });
                                                    if (result.isConfirmed) {
                                                        try {
                                                            setLoading(true);
                                                            await dispatch(
                                                                confirmEarlyReturn(booking.bookingNumber)
                                                            ).unwrap(); // Đợi action hoàn tất
                                                            fetchMyBookings();
                                                        } catch (error) {
                                                            console.error("Error confirming return:", error);
                                                        } finally {
                                                            setLoading(false); // Đảm bảo loading được reset
                                                        }
                                                    }
                                                }}
                                            >
                                                {loading ? (
                                                    <CircularProgress size={20} color="inherit" />
                                                ) : (
                                                    "Approve Return Early"
                                                )}
                                            </Button>
                                            <Button
                                                variant="contained"
                                                disabled={loading}
                                                sx={{
                                                    backgroundColor: "red",
                                                    color: "white",
                                                    "&:hover": { backgroundColor: "#04b16d" },
                                                    width: "100%",
                                                    paddingY: 1.2,
                                                    paddingX: 2,
                                                    height: "auto",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    gap: 1,
                                                }}
                                                onClick={async () => {
                                                    const result = await Swal.fire({
                                                        title: "Are you sure?",
                                                        text: "Do you really want to reject return early this booking?",
                                                        icon: "warning",
                                                        showCancelButton: true,
                                                        confirmButtonText: "Yes, reject it!",
                                                        cancelButtonText: "No, keep it",
                                                    });
                                                    if (result.isConfirmed) {
                                                        try {
                                                            setLoading(true);
                                                            await dispatch(
                                                                rejectEarlyReturn(booking.bookingNumber)
                                                            ).unwrap(); // Đợi action hoàn tất
                                                            fetchMyBookings();
                                                        } catch (error) {
                                                            console.error("Error confirming return:", error);
                                                        } finally {
                                                            setLoading(false); // Đảm bảo loading được reset
                                                        }
                                                    }
                                                }}
                                            >
                                                Reject Return Early
                                                {loading && (
                                                    <CircularProgress size={20} color="inherit" />
                                                )}
                                            </Button>
                                        </>
                                    )}
                                    <ConfirmationDialog
                                        open={openConfirm}
                                        onClose={() => setOpenConfirm(false)}
                                        onConfirm={confirmAction}
                                        title="Confirm Action"
                                        content="Are you sure you want to confirm this booking request?"
                                    />
                                    <NotificationSnackbar
                                        alert={alert}
                                        onClose={() => setAlert({ ...alert, open: false })}
                                    />
                                </Grid>
                            </Grid>
                            <Divider sx={{ mt: 2 }} />
                        </Grid>
                    ))
                ) : (
                    <Box
                        sx={{
                            height: "300px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Typography variant="h6" sx={{ color: "gray" }}>
                            You have no rentals
                        </Typography>
                    </Box>
                )}
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
            <Footer></Footer>
        </div>
    );
};
export default MyRentals;
