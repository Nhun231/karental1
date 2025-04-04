import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import { useSearchParams } from "react-router-dom";
import BookingCard from "../components/common/BookingCard";
import { useEffect, useState } from "react";
import { getMyBookings } from "../services/BookingServices";
import { Breadcrumbs, Link, Typography, Box, CircularProgress,Grid} from "@mui/material";
import {  Divider, Button } from "@mui/joy";
import { useNavigate } from "react-router-dom";
import Filters from "../components/common/Filter";
import Pagination from "../components/common/Pagination"
import { useDispatch } from "react-redux";
import { getBookingDetail, getWallet, cancelBooking, confirmPickup, returnCar, payDepositAgain, payTotalFee, } from "../reducers/rentCarReducer";
import Swal from "sweetalert2";
import NoFeedbackMessage from "../components/Feedback/NoDataMessage";
import LoadingComponent from "../components/common/LoadingComponent";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
const MyBooking = () => {
  const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    // State store total on-going booking count
  const [totalElement, setTotalElement] = useState(0);
    // State store booking data of customer
  const [bookingData, setBookingData] = useState(null);
    // State handle search params
  const [searchParams, setSearchParams] = useSearchParams();
    // State handle change status filter
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get("status") || "ALL"
  );
    // State to handle pagination
    const [page, setPage] = useState(parseInt(searchParams.get("page")) || 1);
  const [pageSize, setPageSize] = useState(
    parseInt(searchParams.get("size")) || 10
  );
  const [totalPages, setTotalPages] = useState(1);
    // Function to mapping sort query to sort value
  const sortMapping = {
    "updatedAt,DESC": "newest",
    "updatedAt,ASC": "oldest",
    "basePrice,DESC": "priceHigh",
    "basePrice,ASC": "priceLow",
  };
    // Status filter data
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
    // List valid status(except ALL)
  const validStatuses = new Set(statusOptions.slice(1));
    // Initialize sort option, default newest(updatedAt,DESC)
  const [sortOption, setSortOption] = useState(
    sortMapping[searchParams.get("sort")] || "newest"
  );
    // Function get sort query
  const getSortQuery = (option) =>
    ({
      newest: "updatedAt,DESC",
      oldest: "updatedAt,ASC",
      priceHigh: "basePrice,DESC",
      priceLow: "basePrice,ASC",
    }[option] || "updatedAt,DESC");
    // Update search params when dependencies changes
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
        } finally { setLoading(false) }
    };
    useEffect(() => {
        setLoading(true)
        fetchMyBookings();
    }, [page, pageSize, sortOption, statusFilter]);
    useEffect(() => {
        document.title = 'My Booking';
    }, []);
    if (loading) {
        return (
            <LoadingComponent/>
        );
    }
    return (
        <div>
            <Header />
            <Breadcrumbs sx={{ mx: "auto", maxWidth: "1200px", py: 1, px: 2 }}>
                <Link underline="hover" color="inherit" href="/">
                    Home
                </Link>
                <Typography color="text.primary">My Booking</Typography>
            </Breadcrumbs>
            <Box sx={{
                maxWidth: "1200px",
                mx: "auto",
                mt: 4,
            }}>
                <Typography variant="h4" fontWeight="bold" sx={{ textAlign: "center" }}>My Booking</Typography>
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
                <Typography variant="subtitle1" >
                    You have <span style={{ color: "#05ce80", fontWeight: "bold" }}>{totalElement} on-going</span> bookings!
                </Typography>
                <Filters sortOption={sortOption} setSortOption={setSortOption} statusFilter={statusFilter} setStatusFilter={setStatusFilter} statusOptions={statusOptions} />
            </Box>
            <Grid container direction="column" spacing={3} className="border-box" sx={{
                maxWidth: "1200px",
                mx: "auto",
                my: 2,
            }}>
                {(!bookingData || bookingData.length === 0) && <NoFeedbackMessage message="You haven't any booking with this status." />}
                {bookingData && bookingData.map((booking) => (
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
                        <Grid container alignItems="stretch">
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
                                alignItems="center"
                                sx={{
                                    height: "100%",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Button
                                    variant="contained"
                                    onClick={() => navigate(`/edit-booking/${booking.bookingNumber}`)}
                                    sx={{
                                        backgroundColor: "#1976d2",
                                        color: "white",
                                        "&:hover": { backgroundColor: "#1565c0" },
                                        width: "50%",
                                        paddingY: 0.5,
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
                                                width: "50%",
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
                                                width: "50%",
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
                                {booking.status === "WAITING_CONFIRMED" && (
                                    <>

                                        <Button
                                            variant="contained"
                                            sx={{
                                                backgroundColor: "#d32f2f", // Red
                                                color: "white",
                                                "&:hover": { backgroundColor: "#b71c1c" },
                                                width: "50%",
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
                  {booking.status === "PENDING_DEPOSIT" &&
                    booking.paymentType === "WALLET" && (
                                    <>
                                    <Button
                                        variant="contained"
                                        sx={{
                                            backgroundColor: "#d32f2f", // Red
                                            color: "white",
                                            "&:hover": { backgroundColor: "#b71c1c" },
                                            width: "50%",
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
                                                width: "50%",
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

                  {booking.status === "PENDING_DEPOSIT" &&
                    booking.paymentType !== "WALLET" && (
                      <>
                        <Button
                          variant="contained"
                          sx={{
                            backgroundColor: "#d32f2f", // Red
                            color: "white",
                            "&:hover": { backgroundColor: "#b71c1c" },
                            width: "50%",
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

                                {/* Show Return Cars if status is IN_PROGRESS */}
                  {booking.status === "IN_PROGRESS" &&  dayjs.utc(booking.dropOffTime) >= dayjs.utc() && (
                                    <Button
                                        variant="contained"
                                        sx={{
                                            backgroundColor: "#05ce80", // Red
                                            color: "white",
                                            "&:hover": { backgroundColor: "#05ce55" },
                                            width: "50%",
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
                            )} VND will be return to your wallet.`,
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

                  {booking.status === "IN_PROGRESS" && dayjs.utc(booking.dropOffTime) < (dayjs.utc()) && (
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: "#05ce80", // Red
                        color: "white",
                        "&:hover": { backgroundColor: "#05ce55" },
                        width: "50%",
                        paddingY: 1.2,
                        paddingX: 2,
                        height: "auto",
                      }}
                      onClick={(e) => {
                        if (booking.totalPrice <= booking.deposit) {
                          Swal.fire({
                            title: "Return car?",
                            text: `Please confirm to return the car early. The car owner must confirm your early return request. If declined, you must keep the car until the original return time.`,
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
                                            width: "50%",
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
    )
}
export default MyBooking;