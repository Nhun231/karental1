import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { data, useNavigate } from "react-router-dom";
import { store } from "../../redux/store";
import Header from "../common/Header";
import Footer from "../common/Footer";
// import { BookingDescript } from "./BookingDescript";
import {
  Typography,
  Box,
  TextField,
  Grid,
  Divider,
  Skeleton,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  Button,
  FormControl,
  Autocomplete,
  IconButton,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { useState, useEffect, useMemo } from "react";
import {
  setInfor,
  setErrorsBooking,
  handleSaveBooking,
  saveBooking,
} from "../../reducers/rentCarReducer";
import { fetchInforProfile, setCarData } from "../../reducers/carReducer";
import axios from "axios";
import { saveFileToDB } from "../../Helper/indexedDBHelper";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function EditBookingInfor() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false); // manage open modal
  const [loading, setLoading] = useState(false);

  const { carData = {} } = useSelector((state) => state.cars);
  const {
    infor = {},
    statusBooking,
    errorsBooking,
  } = useSelector((state) => state.rentCar);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const data = await dispatch(fetchInforProfile()).unwrap();

        if (!data?.data) return;

        dispatch(
          setCarData({
            ...data,
            data: {
              ...data?.data,
              driverFullName: data?.data?.fullName,
              driverDob: data?.data?.dob,
              driverEmail: data?.data?.email,
              driverPhoneNumber: data?.data?.phoneNumber,
              driverNationalId: data?.data?.nationalId,
              driverDrivingLicenseUrl: data?.data?.drivingLicenseUrl,
              driverCityProvince: data?.data?.cityProvince,
              driverDistrict: data?.data?.district,
              driverWard: data?.data?.ward,
              driverHouseNumberStreet: data?.data?.houseNumberStreet,
            },
          })
        );
      } catch (error) {
        console.log("get profile failed", error);
      }
    };
    getProfile();
  }, []);

  useEffect(() => {
    const updatedData = infor?.data?.driver === true
      ? {
        ...infor.data,
        driverFullName: infor.data.driverFullName,
        driverDob: infor.data.driverDob,
        driverEmail: infor.data.driverEmail,
        driverPhoneNumber: infor.data.driverPhoneNumber,
        driverNationalId: infor.data.driverNationalId,
        driverDrivingLicenseUrl: infor.data.driverDrivingLicenseUrl,
        driverCityProvince: infor.data.driverCityProvince,
        driverDistrict: infor.data.driverDistrict,
        driverWard: infor.data.driverWard,
        driverHouseNumberStreet: infor.data.driverHouseNumberStreet,
      }
      : {
        ...infor.data,
        driverFullName: "",
        driverDob: "",
        driverEmail: "",
        driverPhoneNumber: "",
        driverNationalId: "",
        driverDrivingLicenseUrl: "",
        driverCityProvince: "",
        driverDistrict: "",
        driverWard: "",
        driverHouseNumberStreet: "",
      };

    dispatch(
      setInfor({
        ...infor,
        data: updatedData,
      })
    );
  }, [infor?.data?.driver]);

  const [selectedDate, setSelectedDate] = useState(null); // default value today
  const [selectedDateReturn, setSelectedDateReturn] = useState(null);

  const [address, setAddress] = useState([]);
  const [cityProvince, setCityProvince] = useState([]);

  useEffect(() => {
    axios.get("/database.json").then((res) => {
      const data = res.data.Address_list;
      setAddress(data);

      const uniqueCityProvince = Array.from(
        new Set(data.map((item) => item.City_Province))
      ).map((city) => ({ label: city, value: city }));

      setCityProvince(uniqueCityProvince);
    });
  }, [infor.data]);

  const filteredDistrict = useMemo(() => {
    if (!infor?.data?.driverCityProvince || !Array.isArray(address)) return [];

    const tmp = address.filter(
      (item) => item.City_Province === infor.data.driverCityProvince
    );
    return Array.from(new Set(tmp.map((item) => item.Disctrict))).map(
      (dsc) => ({
        label: dsc,
        value: dsc,
      })
    );
  }, [address, infor?.data?.driverCityProvince]);

  const filteredWard = useMemo(() => {
    if (
      !infor?.data?.driverCityProvince ||
      !infor?.data?.driverDistrict ||
      !Array.isArray(address)
    )
      return [];

    const tmp = address.filter(
      (item) => item.City_Province === infor.data.driverCityProvince
    );

    const tmp2 = tmp.filter(
      (item) => item.Disctrict === infor.data.driverDistrict
    );
    return Array.from(new Set(tmp2.map((item) => item.Ward))).map((dsc) => ({
      label: dsc,
      value: dsc,
    }));
  }, [address, infor?.data?.driverCityProvince, infor?.data?.driverDistrict]);

  // check file
  const allowedExtensions = [".doc", ".docx", ".pdf", ".jpg", ".jpeg", ".png"];

  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState("");

  // handle file
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const fileExt = file.name
      .substring(file.name.lastIndexOf("."))
      .toLowerCase();

    if (!allowedExtensions.includes(fileExt)) {
      dispatch(
        setErrorsBooking({
          ...errorsBooking,
          drivingLicenseUrl:
            "Invalid file type! Only .doc, .docx, .pdf, .jpg, .jpeg, .png are allowed.",
        })
      );
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      dispatch(
        setErrorsBooking({
          ...errorsBooking,
          drivingLicenseUrl: "File size must be less than 5MB.",
        })
      );
      return;
    }

    try {
      // save file to IndexedDB
      await saveFileToDB("driverDrivingLicense", file);

      // update state with the selected file
      setSelectedFile(file);
      setFileError(""); // delete error message
      dispatch(
        setInfor({
          ...infor,
          data: {
            ...infor.data,
            driverDrivingLicenseUrl: URL.createObjectURL(file),
          },
        })
      );
      dispatch(setErrorsBooking({ ...errorsBooking, drivingLicenseUrl: "" }));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Box sx={{ mx: "auto", maxWidth: "1400px", width: "100%" }}>
        <Box
          sx={{
            maxWidth: "1400px",
            margin: "auto",
            p: 3,
            mt: 2,
            width: "100%",
            mb: 3,
            border: "1px solid #ddd",
            borderRadius: 2,
            boxShadow: 2,
            bgcolor: "white",
          }}
        >
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Renter's information
          </Typography>

          <Grid container spacing={3}>
            {/* column 1 */}
            <Grid item xs={12} sm={6}>
              {statusBooking === "loading" ? (
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={20}
                  animation="wave"
                />
              ) : (
                <TextField
                  label="Full Name"
                  required
                  variant="standard"
                  fullWidth
                  sx={{
                    mb: 2,
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "primary.main", // blue color when focused
                    },
                    "& .MuiInputLabel-root.MuiInputLabel-shrink": {
                      color: "primary.main", // blue color when shrink
                    },
                  }}
                  size="small"
                  value={carData?.data?.fullName || ""}
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                />
              )}

              {statusBooking === "loading" ? (
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={20}
                  animation="wave"
                />
              ) : (
                <TextField
                  label="Phone number"
                  required
                  variant="standard"
                  fullWidth
                  sx={{
                    mb: 2,
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "primary.main", // blue color when focused
                    },
                    "& .MuiInputLabel-root.MuiInputLabel-shrink": {
                      color: "primary.main", // blue color when shrink
                    },
                  }}
                  value={carData?.data?.phoneNumber || ""}
                  size="small"
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                />
              )}

              {statusBooking === "loading" ? (
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={20}
                  animation="wave"
                />
              ) : (
                <TextField
                  label="National ID No."
                  required
                  variant="standard"
                  fullWidth
                  sx={{
                    mb: 2,
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "primary.main", // blue color when focused
                    },
                    "& .MuiInputLabel-root.MuiInputLabel-shrink": {
                      color: "primary.main", // blue color when shrink
                    },
                  }}
                  size="small"
                  value={carData?.data?.nationalId || ""}
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                />
              )}
            </Grid>

            {/* column 2 */}
            <Grid item xs={12} sm={6}>
              {statusBooking === "loading" ? (
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={20}
                  animation="wave"
                />
              ) : (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Date of birth"
                    fullWidth
                    sx={{
                      mb: 2,
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "primary.main", // blue color when focused
                      },
                      "& .MuiInputLabel-root.MuiInputLabel-shrink": {
                        color: "primary.main", // blue color when shrink
                      },
                    }}
                    value={dayjs(carData?.data?.dob) || ""}
                    format="DD/MM/YYYY"
                    slotProps={{
                      textField: {
                        size: "small",
                        variant: "standard",
                        fullWidth: true,
                        InputProps: {
                          endAdornment: (
                            <InputAdornment position="end">
                              <CalendarMonthIcon />
                            </InputAdornment>
                          ),
                        },
                      },
                    }}
                  />
                </LocalizationProvider>
              )}
              {/* </FormControl> */}

              {statusBooking === "loading" ? (
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={20}
                  animation="wave"
                />
              ) : (
                <TextField
                  label="Email address"
                  fullWidth
                  variant="standard"
                  sx={{
                    mb: 2,
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "primary.main", // blue color when focused
                    },
                    "& .MuiInputLabel-root.MuiInputLabel-shrink": {
                      color: "primary.main", // blue color when shrink
                    },
                  }}
                  size="small"
                  value={carData?.data?.email || ""}
                  required
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                />
              )}
              {statusBooking === "loading" ? (
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={20}
                  animation="wave"
                />
              ) : (
                <TextField
                  label="Driving License"
                  fullWidth
                  variant="standard"
                  sx={{
                    mb: 2,
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "primary.main", // blue color when focused
                    },
                    "& .MuiInputLabel-root.MuiInputLabel-shrink": {
                      color: "primary.main", // blue color when shrink
                    },
                  }}
                  size="small"
                  value={
                    carData?.data?.drivingLicenseUrl
                      ? "Click to Download"
                      : "No file available"
                  }
                  InputProps={{
                    endAdornment: carData?.data?.drivingLicenseUrl && (
                      <InputAdornment position="end">
                        <IconButton
                          component="a"
                          href={carData.data.drivingLicenseUrl}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <DownloadIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            </Grid>
          </Grid>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, mt: 2 }}>
            Address: <span style={{ color: "red" }}>*</span>
          </Typography>

          {/* City / Province */}
          {statusBooking === "loading" ? (
            <Skeleton
              variant="rectangular"
              width="100%"
              height={20}
              animation="wave"
            />
          ) : (
            <TextField
              fullWidth
              sx={{
                mb: 2,
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "primary.main", // blue color when focused
                },
                "& .MuiInputLabel-root.MuiInputLabel-shrink": {
                  color: "primary.main", // blue color when shrink
                },
              }}
              required
              variant="standard"
              label="City / Province"
              value={carData?.data?.cityProvince || ""}
              size="small"
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />
          )}

          {/* District */}
          {statusBooking === "loading" ? (
            <Skeleton
              variant="rectangular"
              width="100%"
              height={20}
              animation="wave"
            />
          ) : (
            <TextField
              label="District"
              fullWidth
              variant="standard"
              sx={{
                mb: 2,
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "primary.main", // blue color when focused
                },
                "& .MuiInputLabel-root.MuiInputLabel-shrink": {
                  color: "primary.main", // blue color when shrink
                },
              }}
              required
              size="small"
              value={carData?.data?.district || ""}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />
          )}

          {/* Ward */}
          {statusBooking === "loading" ? (
            <Skeleton
              variant="rectangular"
              width="100%"
              height={20}
              animation="wave"
            />
          ) : (
            <TextField
              label="Ward"
              fullWidth
              variant="standard"
              sx={{
                mb: 2,
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "primary.main", // blue color when focused
                },
                "& .MuiInputLabel-root.MuiInputLabel-shrink": {
                  color: "primary.main", // blue color when shrink
                },
              }}
              required
              value={carData?.data?.ward || ""}
              size="small"
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />
          )}

          {/* House number, Street */}
          {statusBooking === "loading" ? (
            <Skeleton
              variant="rectangular"
              width="100%"
              height={20}
              animation="wave"
            />
          ) : (
            <TextField
              label="House number, Street"
              fullWidth
              variant="standard"
              sx={{
                mb: 2,
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "primary.main", // blue color when focused
                },
                "& .MuiInputLabel-root.MuiInputLabel-shrink": {
                  color: "primary.main", // blue color when shrink
                },
              }}
              required
              value={carData?.data?.houseNumberStreet || ""}
              size="small"
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />
          )}
        </Box>

        <FormControlLabel
          control={<Checkbox checked={infor?.data?.driver ?? false} />}
          id="differentRent"
          label="Different than Renter's information"
          onChange={(e) => {
            if (
              infor?.data?.status !== "PENDING_DEPOSIT" &&
              infor?.data?.status !== "CONFIRMED" &&
              infor?.data?.status !== "WAITING_CONFIRMED"
            ) {
              return; // Không thực hiện gì nếu điều kiện đúng
            }
            dispatch(
              setInfor({
                ...infor,
                data: { ...infor?.data, driver: !infor?.data?.driver },
              })
            );
          }}
        />

        <Box
          sx={{
            maxWidth: "1400px",
            width: "100%",
            margin: "auto",
            p: 3,
            mt: 3,
            border: "1px solid #ddd",
            borderRadius: 2,
            boxShadow: 2,
            bgcolor: "white",
          }}
        >
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Driver's information
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <TextField
                  label="Full Name"
                  required
                  variant="standard"
                  id="name"
                  disabled={!infor?.data?.driver}
                  size="small"
                  sx={{
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "primary.main", // blue color when focused
                    },
                    "& .MuiInputLabel-root.MuiInputLabel-shrink": {
                      color: "primary.main", // blue color when shrink
                    },
                  }}
                  value={infor?.data?.driverFullName || ""}
                  error={
                    !infor?.data?.driver && !!errorsBooking?.fullName
                      ? false
                      : !!errorsBooking?.fullName
                  }
                  onChange={(e) => {
                    if (
                      infor?.data?.status !== "PENDING_DEPOSIT" &&
                      infor?.data?.status !== "CONFIRMED" &&
                      infor?.data?.status !== "WAITING_CONFIRMED"
                    ) {
                      return; // Không thực hiện gì nếu điều kiện đúng
                    }
                    const newValue = e.target.value;

                    if (infor?.renter?.driverFullName !== newValue) {
                      dispatch(
                        setInfor({
                          ...infor,
                          data: {
                            ...infor?.data,
                            driverFullName: newValue,
                          },
                        })
                      );
                    }
                    // Clear error message
                    dispatch(
                      setErrorsBooking({
                        ...errorsBooking,
                        fullName: newValue ? "" : "This field is required",
                      })
                    );
                  }}
                />
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <TextField
                  label="Phone number"
                  required
                  variant="standard"
                  id="number"
                  type="number"
                  disabled={!infor?.data?.driver}
                  value={infor?.data?.driverPhoneNumber || ""}
                  error={
                    !infor?.data?.driver && !!errorsBooking?.phoneNumber
                      ? false
                      : !!errorsBooking?.phoneNumber
                  }
                  InputLabelProps={{
                    shrink: !!infor?.data?.driverPhoneNumber, // shrink label when value is not empty
                  }}
                  onKeyDown={(e) => {
                    if (["e", "E", "+", "-", "."].includes(e.key)) {
                      e.preventDefault(); // Prevent default behavior for e, E, +, -
                    }
                  }}
                  sx={{
                    "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                    {
                      WebkitAppearance: "none", // Hide the default arrow buttons
                      margin: 0,
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "primary.main", // blue color when focused
                    },
                    "& .MuiInputLabel-root.MuiInputLabel-shrink": {
                      color: "primary.main", // blue color when shrink
                    },
                  }}
                  onChange={(e) => {
                    if (
                      infor?.data?.status !== "PENDING_DEPOSIT" &&
                      infor?.data?.status !== "CONFIRMED" &&
                      infor?.data?.status !== "WAITING_CONFIRMED"
                    ) {
                      return; // Không thực hiện gì nếu điều kiện đúng
                    }
                    const newValue = e.target.value;
                    if (infor?.data?.driverPhoneNumber !== newValue) {
                      dispatch(
                        setInfor({
                          ...infor,
                          data: {
                            ...infor?.data,
                            driverPhoneNumber: e.target.value,
                          },
                        })
                      );
                    }

                    dispatch(
                      setErrorsBooking({
                        ...errorsBooking,
                        phoneNumber: newValue ? "" : "Phone number is required",
                      })
                    );
                  }}
                  size="small"
                  placeholder="Ex: 0123 456 789"
                />
              </FormControl>

              <FormControl fullWidth>
                <TextField
                  label="National ID No."
                  size="small"
                  variant="standard"
                  required
                  id="idNo"
                  type="number"
                  error={
                    !infor?.data?.driver && !!errorsBooking?.nationalId
                      ? false
                      : !!errorsBooking?.nationalId
                  }
                  value={infor?.data?.driverNationalId || ""}
                  InputLabelProps={{
                    shrink: !!infor?.data?.driverNationalId, // shrink label when value is not empty
                  }}
                  onKeyDown={(e) => {
                    if (["e", "E", "+", "-", "."].includes(e.key)) {
                      e.preventDefault(); // Prevent default behavior for e, E, +, -
                    }
                  }}
                  onChange={(e) => {
                    if (
                      infor?.data?.status !== "PENDING_DEPOSIT" &&
                      infor?.data?.status !== "CONFIRMED" &&
                      infor?.data?.status !== "WAITING_CONFIRMED"
                    ) {
                      return; // Không thực hiện gì nếu điều kiện đúng
                    }
                    const newValue = e.target.value;
                    if (infor?.data?.driverNationalId !== newValue) {
                      dispatch(
                        setInfor({
                          ...infor,
                          data: {
                            ...infor?.data,
                            driverNationalId: e.target.value,
                          },
                        })
                      ); // Cập nhật state}
                    }
                    // Chỉ xóa lỗi nếu có giá trị, đặt lại lỗi nếu rongyang
                    dispatch(
                      setErrorsBooking({
                        ...errorsBooking,
                        nationalId: newValue ? "" : "This field is required",
                      })
                    );
                  }}
                  disabled={!infor?.data?.driver}
                  sx={{
                    "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                    {
                      WebkitAppearance: "none", // Loại bỏ spinner trên Chrome, Safari, Edge
                      margin: 0,
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "primary.main", // blue color when focused
                    },
                    "& .MuiInputLabel-root.MuiInputLabel-shrink": {
                      color: "primary.main", // blue color when shrink
                    },
                  }}
                  placeholder="Ex: 0123 456 789 10"
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                {errorsBooking?.dob && infor?.data?.driver && (
                  <Typography color="error" sx={{ mb: 0.5 }}>
                    {errorsBooking.dob}
                  </Typography>
                )}

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Date of birth."
                    required
                    id="dob"
                    open={open} // Điều khiển trạng thái mở
                    onOpen={() => setOpen(true)} // Khi mở
                    onClose={() => setOpen(false)} // Khi đóng
                    value={
                      infor?.data?.driverDob
                        ? dayjs(infor?.data?.driverDob)
                        : dayjs() 
                    }
                    error={
                      !infor?.data?.driver && !!errorsBooking?.dob
                        ? false
                        : !!errorsBooking?.dob
                    }
                    sx={{
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "primary.main", // blue color when focused
                      },
                      "& .MuiInputLabel-root.MuiInputLabel-shrink": {
                        color: "primary.main", // blue color when shrink
                      },
                    }}
                    disabled={
                      !infor?.data?.driver ||
                      (infor?.data?.status !== "PENDING_DEPOSIT" &&
                        infor?.data?.status !== "CONFIRMED" &&
                        infor?.data?.status !== "WAITING_CONFIRMED")
                    }
                    onChange={(date) => {
                      if (
                        infor?.data?.status !== "PENDING_DEPOSIT" &&
                        infor?.data?.status !== "CONFIRMED" &&
                        infor?.data?.status !== "WAITING_CONFIRMED"
                      ) {
                        return; // Không thực hiện gì nếu điều kiện đúng
                      }
                      const formattedDate = date
                        ? dayjs(date).format("YYYY-MM-DD")
                        : null;

                      dispatch(
                        setInfor({
                          ...infor,
                          data: {
                            ...infor?.data,
                            driverDob: formattedDate,
                          },
                        })
                      );

                      dispatch(
                        setErrorsBooking({
                          ...errorsBooking,
                          dob: date ? "" : "This field is required",
                        })
                      );
                    }}
                    format="DD/MM/YYYY"
                    slotProps={{
                      textField: {
                        variant: "standard",
                        size: "small",
                        fullWidth: true,
                        InputProps: {
                          endAdornment: (
                            <InputAdornment position="end">
                              <CalendarMonthIcon
                                style={{ cursor: "pointer" }}
                                onClick={() => setOpen(true)} // Khi click vào icon, mở DatePicker
                              />
                            </InputAdornment>
                          ),
                        },
                      },
                    }}
                  />
                </LocalizationProvider>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <TextField
                  label="Email address"
                  size="small"
                  variant="standard"
                  id="email"
                  type="email" 
                  placeholder="example@gmail.com" 
                  error={
                    !infor?.data?.driver && !!errorsBooking?.email
                      ? false
                      : !!errorsBooking?.email
                  }
                  value={infor?.data?.driverEmail || ""}
                  sx={{
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "primary.main", // blue color when focused
                    },
                    "& .MuiInputLabel-root.MuiInputLabel-shrink": {
                      color: "primary.main", // blue color when shrink
                    },
                  }}
                  InputLabelProps={{
                    shrink: !!infor?.data?.driverEmail,
                  }}
                  onChange={(e) => {
                    if (
                      infor?.data?.status !== "PENDING_DEPOSIT" &&
                      infor?.data?.status !== "CONFIRMED" &&
                      infor?.data?.status !== "WAITING_CONFIRMED"
                    ) {
                      return; // Không thực hiện gì nếu điều kiện đúng
                    }
                    const newValue = e.target.value;
                    if (infor?.data?.driverEmail !== newValue) {
                      dispatch(
                        setInfor({
                          ...infor,
                          data: {
                            ...infor?.data,
                            driverEmail: e.target.value,
                          },
                        })
                      );
                    }
                    dispatch(
                      setErrorsBooking({
                        ...errorsBooking,
                        email: newValue ? "" : "This field is required",
                      })
                    );
                  }}
                  required
                  disabled={!infor?.data?.driver}
                />
              </FormControl>

              <Grid container spacing={1}>
                {/* input display file */}
                <Grid item xs={8}>
                  <FormControl fullWidth>
                    <TextField
                      label="Driving license"
                      size="small"
                      variant="standard"
                      sx={{
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: "primary.main", // blue color when focused
                        },
                        "& .MuiInputLabel-root.MuiInputLabel-shrink": {
                          color: "primary.main", // blue color when shrink
                        },
                      }}
                      error={
                        !infor?.data?.driver &&
                          !!errorsBooking?.drivingLicenseUrl
                          ? false
                          : !!errorsBooking?.drivingLicenseUrl
                      }
                      helperText={
                        fileError || errorsBooking?.drivingLicenseUrl || ""
                      }
                      value={
                        selectedFile
                          ? selectedFile.name
                          : infor?.data?.driverDrivingLicenseUrl
                            ? "Download available"
                            : ""
                      }
                      disabled={
                        !infor?.data?.driver ||
                        (infor?.data?.status !== "PENDING_DEPOSIT" &&
                          infor?.data?.status !== "CONFIRMED" &&
                          infor?.data?.status !== "WAITING_CONFIRMED")
                      }
                      InputProps={{
                        endAdornment: (infor?.data?.driver || infor?.data?.driverDrivingLicenseUrl) && (
                          <IconButton
                            edge="end"
                            href={infor?.data?.driverDrivingLicenseUrl} // Link to dowload file
                            target="_blank"
                            rel="noopener noreferrer"
                            size="small" // size small
                            sx={{ p: 0 }} // padding 0
                          >
                            <DownloadIcon />
                          </IconButton>
                        ),
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <input
                    type="file"
                    accept=".doc,.docx,.pdf,.jpg,.jpeg,.png"
                    style={{ display: "none" }} // hidden input
                    id="upload-driving-license"
                    onChange={(e) => {
                      if (
                        infor?.data?.status !== "PENDING_DEPOSIT" &&
                        infor?.data?.status !== "CONFIRMED" &&
                        infor?.data?.status !== "WAITING_CONFIRMED"
                      ) {
                        return; // Không thực hiện gì nếu điều kiện đúng
                      }
                      handleFileChange(e);
                      setFileError("");
                      dispatch(
                        setErrorsBooking({
                          ...errorsBooking,
                          drivingLicenseUrl: "",
                        })
                      );
                    }}
                    disabled={
                      !infor?.data?.driver ||
                      (infor?.data?.status !== "PENDING_DEPOSIT" &&
                        infor?.data?.status !== "CONFIRMED" &&
                        infor?.data?.status !== "WAITING_CONFIRMED")
                    }
                  />
                  <label htmlFor="upload-driving-license">
                    <Button
                      variant="contained"
                      fullWidth
                      component="span"
                      sx={{ marginTop: "8px" }}
                    >
                      {selectedFile ? "Replace" : "Upload"}
                    </Button>
                  </label>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, mt: 2 }}>
            Address: <span style={{ color: "red" }}>*</span>
          </Typography>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <Autocomplete
              options={cityProvince}
              size="small"
              disabled={!infor?.data?.driver}
              sx={{
                "& .MuiInputLabel-root": {
                  fontSize: "14px", //
                },
              }}
              getOptionLabel={(option) => option.label} // display label
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="City/Province."
                  variant="standard"
                  name="addressCityProvince"
                  id="city"
                  sx={{
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "primary.main", // blue color when focused
                    },
                    "& .MuiInputLabel-root.MuiInputLabel-shrink": {
                      color: "primary.main", // blue color when shrink
                    },
                  }}
                  error={
                    !infor?.data?.driver && !!errorsBooking?.addressCityProvince
                      ? false
                      : !!errorsBooking?.addressCityProvince
                  }
                  required
                  slotProps={{
                    ...params.InputProps,
                    style: { color: "gray" },
                    shrink: !!infor?.data?.driverCityProvince,
                  }}
                />
              )}
              value={
                cityProvince?.length > 0 && infor?.data?.driverCityProvince
                  ? cityProvince.find(
                    (option) => option.value === infor.data.driverCityProvince
                  ) || null
                  : null
              }
              onChange={(event, newValue) => {
                if (
                  infor?.data?.status !== "PENDING_DEPOSIT" &&
                  infor?.data?.status !== "CONFIRMED" &&
                  infor?.data?.status !== "WAITING_CONFIRMED"
                ) {
                  return; // Không thực hiện gì nếu điều kiện đúng
                }
                dispatch(
                  setInfor({
                    ...infor,
                    data: {
                      ...infor?.data,
                      driverCityProvince: newValue?.value || "",
                      driverDistrict: "",
                      driverWard: "",
                      driverHouseNumberStreet: "",
                    },
                    selectedCityProvince: newValue?.label || "",
                  })
                );

                dispatch(
                  setErrorsBooking({
                    ...errorsBooking,
                    addressCityProvince: newValue
                      ? ""
                      : "City/Province is required.",
                    addressHouseNumberStreet: "please full fill.",
                    addressDistrict: "please full fill.",
                    addressWard: "please full fill.",
                  })
                );
              }}
            />
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <Autocomplete
              options={filteredDistrict}
              sx={{
                "& .MuiInputLabel-root": {
                  fontSize: "14px",
                },
              }}
              getOptionLabel={(option) => option.label}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="District."
                  variant="standard"
                  name="addressDistrict"
                  id="district"
                  size="small"
                  required
                  sx={{
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "primary.main", // blue color when focused
                    },
                    "& .MuiInputLabel-root.MuiInputLabel-shrink": {
                      color: "primary.main", // blue color when shrink
                    },
                  }}
                  error={
                    !infor?.data?.driver && !!errorsBooking?.addressDistrict
                      ? false
                      : !!errorsBooking?.addressDistrict
                  }
                  slotProps={{
                    ...params.InputProps,
                    style: { color: "gray" },
                  }}
                />
              )}
              value={
                filteredDistrict?.length > 0 && infor.data.driverDistrict
                  ? filteredDistrict.find(
                    (option) => option.value === infor.data.driverDistrict
                  ) || null
                  : null
              }
              onChange={(event, newValue) => {
                if (
                  infor?.data?.status !== "PENDING_DEPOSIT" &&
                  infor?.data?.status !== "CONFIRMED" &&
                  infor?.data?.status !== "WAITING_CONFIRMED"
                ) {
                  return; // Không thực hiện gì nếu điều kiện đúng
                }
                dispatch(
                  setInfor({
                    ...infor,
                    data: {
                      ...infor?.data,
                      driverDistrict: newValue?.value || "",
                      driverWard: "",
                      driverHouseNumberStreet: "",
                    },
                    selectedDistrict: newValue?.label || "",
                  })
                );

                dispatch(
                  setErrorsBooking({
                    ...errorsBooking,
                    addressDistrict: newValue ? "" : "District is required.",
                  })
                );
              }}
              disabled={
                !infor?.data?.driverCityProvince || !infor?.data?.driver
              }
            />
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <Autocomplete
              options={filteredWard}
              sx={{
                "& .MuiInputLabel-root": {
                  fontSize: "14px",
                },
              }}
              getOptionLabel={(option) => option.label}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Ward."
                  variant="standard"
                  name="addressWard"
                  id="ward"
                  size="small"
                  sx={{
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "primary.main", // blue color when focused
                    },
                    "& .MuiInputLabel-root.MuiInputLabel-shrink": {
                      color: "primary.main", // blue color when shrink
                    },
                  }}
                  required
                  error={
                    !infor?.data?.driver && !!errorsBooking?.addressWard
                      ? false
                      : !!errorsBooking?.addressWard
                  }
                  slotProps={{
                    ...params.InputProps,
                    style: { color: "gray" },
                  }}
                />
              )}
              value={
                filteredWard.find((c) => c.value === infor.data.driverWard) ||
                null
              }
              onChange={(event, newValue) => {
                if (
                  infor?.data?.status !== "PENDING_DEPOSIT" &&
                  infor?.data?.status !== "CONFIRMED" &&
                  infor?.data?.status !== "WAITING_CONFIRMED"
                ) {
                  return; // Không thực hiện gì nếu điều kiện đúng
                }
                dispatch(
                  setInfor({
                    ...infor,
                    data: {
                      ...infor?.data,
                      driverWard: newValue?.value || "",
                      driverHouseNumberStreet: "",
                    },
                  })
                );

                dispatch(
                  setErrorsBooking({
                    ...errorsBooking,
                    addressWard: newValue ? "" : "Ward is required.",
                  })
                );
              }}
              disabled={!infor?.data?.driverDistrict || !infor?.data?.driver}
            />
          </FormControl>

          <FormControl fullWidth>
            <TextField
              label="House number, Street."
              size="small"
              variant="standard"
              disabled={!infor?.data?.driver}
              name="addressHouseNumberStreet"
              id="numberStreet"
              error={
                !infor?.data?.driver &&
                  !!errorsBooking?.addressHouseNumberStreet
                  ? false
                  : !!errorsBooking?.addressHouseNumberStreet
              }
              value={infor?.data?.driverHouseNumberStreet || ""}
              InputLabelProps={{
                shrink: !!infor?.data?.driverHouseNumberStreet,
              }}
              sx={{
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "primary.main", // blue color when focused
                },
                "& .MuiInputLabel-root.MuiInputLabel-shrink": {
                  color: "primary.main", // blue color when shrink
                },
              }}
              onChange={(event) => {
                if (
                  infor?.data?.status !== "PENDING_DEPOSIT" &&
                  infor?.data?.status !== "CONFIRMED" &&
                  infor?.data?.status !== "WAITING_CONFIRMED"
                ) {
                  return; // Không thực hiện gì nếu điều kiện đúng
                }
                dispatch(
                  setInfor({
                    ...infor,
                    data: {
                      ...infor?.data,
                      driverHouseNumberStreet: event.target.value,
                    },
                  })
                );

                dispatch(
                  setErrorsBooking({
                    ...errorsBooking,
                    addressHouseNumberStreet: event.target.value
                      ? ""
                      : "House number, Street is required.",
                  })
                );
              }}
            />
          </FormControl>
        </Box>
      </Box>
      <Box m={2} style={{ textAlign: "center" }}>
        <Button
          variant="contained"
          id="nextButton"
          disabled={
            infor?.data?.status !== "PENDING_DEPOSIT" &&
            infor?.data?.status !== "CONFIRMED" &&
            infor?.data?.status !== "WAITING_CONFIRMED"
          }
          sx={{ ml: 2 }}
          onClick={async () => {
            try {
              await dispatch(handleSaveBooking());

              const errorsBooking = store.getState().rentCar.errorsBooking;

              if (Object.keys(errorsBooking).length === 0) {
                setLoading(true);
                if (infor?.data?.driver === false) {
                  const carInfo = carData?.data || {}; // avoid undefined

                  await dispatch(
                    setInfor({
                      ...infor,
                      data: {
                        ...infor?.data,
                        driverFullName: carInfo.fullName || "",
                        driverDob: carInfo.dob || "",
                        driverEmail: carInfo.email || "",
                        driverPhoneNumber: carInfo.phoneNumber || "",
                        driverNationalId: carInfo.nationalId || "",
                        driverCityProvince: carInfo.cityProvince || "",
                        driverDrivingLicenseUrl:
                          carInfo.drivingLicenseUrl || "",
                        driverDistrict: carInfo.district || "",
                        driverWard: carInfo.ward || "",
                        driverHouseNumberStreet:
                          carInfo.houseNumberStreet || "",
                      },
                    })
                  );
                }
                await dispatch(saveBooking());
              }
            } catch (error) {
              console.error("Error:", error);
            } finally {
              setLoading(false);
            }
          }}
          style={{ backgroundColor: "#00bfa5" }}
        >
          {loading ? "Saving..." : "Save"}
        </Button>
      </Box>
    </>
  );
}
