import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { getRentalsDetail, confirmBooking } from "../services/BookingServices";
import { getCarDetailbyCarOwner } from "../services/CarServices";
import {
  Breadcrumbs,
  Link,
  Typography,
  Grid,
  Tabs,
  Tab,
  Box,
  CircularProgress,
} from "@mui/material";
import { Button, Divider } from "@mui/joy";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import BookingCard from "../components/common/BookingCard";
import PersonalInformation from "../components/User/PersonalInfomation";
import { BasicInformation } from "../components/CarDetails/BasicInformation";
import { DetailsComponent } from "../components/CarDetails/DetailsComponent";
import { TermofUse } from "../components/CarDetails/TermofUse";
import ConfirmationDialog from "../components/common/ConfirmationDialog";
import NotificationSnackbar from "../components/common/NotificationSnackbar";
import { useDispatch } from "react-redux";
import {
  confirmEarlyReturn,
  rejectEarlyReturn,
  rejectRentCar,
} from "../reducers/rentCarReducer";
import Swal from "sweetalert2";

const RentalDetails = () => {
  const dispatch = useDispatch();
  // Get id from URL
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  // State to store bookingData
  const [bookingData, setBookingData] = useState(null);
  const [CarData, setCarData] = useState(null);
  // State to manage selected tab
  const [tabIndex, setTabIndex] = useState(0);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const getData = useCallback(async () => {
    try {
      const bookingResponse = await getRentalsDetail(id);
      const booking = bookingResponse.data;
      console.log("Booking Data:", booking);

      let carDetails = {};
      if (booking.carId) {
        const carResponse = await getCarDetailbyCarOwner(booking.carId);
        const carData = carResponse.data;
        setCarData(carData);
        carDetails = {
          brand: carData.brand,
          model: carData.model,
          carImageFrontUrl: carData.carImageFrontUrl,
          carImageBackUrl: carData.carImageBackUrl,
          carImageLeftUrl: carData.carImageLeftUrl,
          carImageRightUrl: carData.carImageRightUrl,
        };
        console.log("Car Data:", carDetails);
      }

      // Gộp dữ liệu booking + car
      setBookingData({ ...booking, ...carDetails });
    } catch (error) {
      console.error("Failed to fetch car data:", error);
    }
    document.title = "Rental Details";
  }, [id]);

  useEffect(() => {
    getData();
  }, [getData]);
  const [initialData, setInitialData] = useState({});

    useEffect(() => {
        if (bookingData && Object.keys(bookingData).length > 0) {
            setInitialData({
                fullName: bookingData.driverFullName || "",
                phoneNumber: bookingData.driverPhoneNumber || "",
                email: bookingData.driverEmail || "",
                nationalId: bookingData.driverNationalId || "",
                dob: bookingData.driverDob || "",
                cityProvince: bookingData.driverCityProvince || "",
                district: bookingData.driverDistrict || "",
                ward: bookingData.driverWard || "",
                houseNumberStreet: bookingData.driverHouseNumberStreet || "",
                drivingLicenseUrl: bookingData.driverDrivingLicenseUrl || null,
                drivingLicensePreview: bookingData.driverDrivingLicenseUrl || null,
            });
        }
    }, [bookingData]);
    const handleConfirm = () => {
        setConfirmAction(() => async () => {
            try {
                const data = await confirmBooking(id);
                setAlert({ open: true, message: "Booking confirmed successfully!", severity: "success" });
                getData();
            } catch (error) {
                setAlert({ open: true, message: error.response?.data?.message || "Failed to confirm booking", severity: "error" });
            }
            setOpenConfirm(false);
        });
        setOpenConfirm(true);
    };
    useEffect(() => {
        document.title = 'Rental Details';
    }, []);
    return (
        <div>
            {/* Header */}
            <Header />
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mx: "auto", maxWidth: "1200px", py: 1, px: 2 }}>
        <Link underline="hover" color="inherit" href="/">
          Home
        </Link>
        <Link underline="hover" color="inherit" href="#/my-rentals">
          My Rentals
        </Link>
        <Typography color="text.primary">Rental Detail</Typography>
      </Breadcrumbs>
      {/* Card Overview */}
      <Box sx={{ p: 1, maxWidth: "1200px", mx: "auto", mt: 2 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: "bold", mb: 2 }}
        >
          Rental Details
        </Typography>
        <Box sx={{ border: "1px solid #d6d6d6", p: 3, borderRadius: 2 }}>
          <Grid container spacing={2} alignItems="stretch">
            <Grid item xs={8.5}>
              <BookingCard BookingData={bookingData} />
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
                marginTop: "20px",
              }}
            >
              {bookingData && bookingData.status === "WAITING_CONFIRMED" && (
                <>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "#05ce80",
                      color: "white",
                      "&:hover": { backgroundColor: "#04b16d" },
                      width: "50%",
                      paddingY: 1.2,
                      paddingX: 2,
                      height: "auto",
                    }}
                    onClick={handleConfirm}
                  >
                    Approve Request
                  </Button>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "red",
                      color: "white",
                      "&:hover": { backgroundColor: "#04b16d" },
                      width: "50%",
                      paddingY: 1.2,
                      paddingX: 2,
                      height: "auto",
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
                        await dispatch(rejectRentCar(id)).unwrap(); // Đợi action hoàn tất
                        getData();
                      } catch (error) {
                          console.error("Error confirming return:", error);
                        } finally {
                          setLoading(false); // Đảm bảo loading được reset
                        }
                      }
                    }}
                  >
                    Reject Request
                  </Button>
                </>
              )}
              {bookingData &&
                bookingData.status === "WAITING_CONFIRMED_RETURN_CAR" && (
                  <>
                    <Button
                      variant="contained"
                      disabled={loading}
                      sx={{
                        backgroundColor: "#05ce80",
                        color: "white",
                        "&:hover": { backgroundColor: "#04b16d" },
                        width: "50%",
                        paddingY: 1.2,
                        paddingX: 2,
                        height: "auto",
                      }}
                      onClick={async () => {
                        const result = await Swal.fire({
                          title: "Are you sure?",
                          text: "Do you really want to approve return early this booking?",
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonText: "Yes, approve it!",
                          cancelButtonText: "No, keep it",
                        });
                        if (result.isConfirmed) {
                        try {
                          setLoading(true);
                          await dispatch(confirmEarlyReturn(id)).unwrap(); // Đợi action hoàn tất
                          getData();
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
                        width: "50%",
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
                            await dispatch(rejectEarlyReturn(id)).unwrap(); // Đợi action hoàn tất
                            getData();
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
        </Box>
      </Box>

            {/* Tabs */}
            <Box sx={{ maxWidth: "1200px", mx: "auto", mt: 4, mb: 4 }}>
                <Tabs value={tabIndex} onChange={(event, newValue) => setTabIndex(newValue)}>
                    <Tab label="Rental Information" />
                    <Tab label="Car Information" />
                </Tabs>

                {/* Tab Content */}
                <Box sx={{
                    border: "1px solid #ccc",
                    padding: 2,
                    textAlign: "left",
                    borderRadius: 1,
                    m: 0
                }}>
                    {tabIndex === 0 && initialData && (
                        <PersonalInformation key={JSON.stringify(initialData)} initialData={initialData} onlyView={true} />
                    )}

                    {tabIndex === 1 && <div>
                        <BasicInformation CarData={CarData} />
                        <Divider sx={{ my: 2 }} />
                        <DetailsComponent CarData={CarData} />
                        <Divider sx={{ my: 2 }} />
                        <TermofUse CarData={CarData} />
                    </div>}
                </Box>
            </Box>
            {/* Footer */}
            <Footer />
        </div>
    )
}
export default RentalDetails;