import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { store } from "../../redux/store";
import Header from "../common/Header";
import Footer from "../common/Footer";
import { BookingDescript } from "./BookingDescript";
import {
  Typography,
  Box,
  TextField,
  Grid,
  FormHelperText,
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
  fetchInforProfile,
  setInfor,
  setErrorsBooking,
  handleNext,
  setStepBooking,
} from "../../reducers/rentCarReducer";
import axios from "axios";
import { saveFileToDB } from "../../Helper/indexedDBHelper";
import { useParams } from "react-router-dom";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB max size

export default function BookingInfor() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { carId } = useParams();
  const [open, setOpen] = useState(false); // manage state DatePicker

  //get data from redux
  const {
    infor = {},
    statusBooking,
    errorsBooking,
    step = 1,
  } = useSelector((state) => state.rentCar);

  //function get profile
  useEffect(() => {
    const getProfile = async () => {
      try {
        const data = await dispatch(fetchInforProfile()).unwrap();

        if (!data?.data) return;

        //if get data success save in temple redux store
        dispatch(
          setInfor({
            ...(infor || {}),
            data: {
              ...data?.data,
              driverFullName: data?.data?.fullName,
              driverDob: data?.data?.dob,
              driverEmail: data?.data?.email,
              driverPhoneNumber: data?.data?.phoneNumber,
              driverNationalId: data?.data?.nationalId,
              driverCityProvince: data?.data?.cityProvince || "",
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

  const [selectedDate, setSelectedDate] = useState(null); // default value today

  const [address, setAddress] = useState([]);
  const [cityProvince, setCityProvince] = useState([]);

  //function get address
  useEffect(() => {
    axios.get("/database.json").then((res) => {
      const data = res.data.Address_list;
      setAddress(data);

      const uniqueCityProvince = Array.from(
        new Set(data.map((item) => item.City_Province))
      ).map((city) => ({ label: city, value: city }));

      setCityProvince(uniqueCityProvince);
    });
  }, []);

  //function get district
  const filteredDistrict = useMemo(() => {
    if (!infor?.renter?.driverCityProvince) return [];

    const tmp = address.filter(
      (item) => item.City_Province === infor?.renter?.driverCityProvince
    );
    return Array.from(new Set(tmp.map((item) => item.Disctrict))).map(
      (dsc) => ({
        label: dsc,
        value: dsc,
      })
    );
  }, [address, infor?.renter?.driverCityProvince]);

  //function get ward
  const filteredWard = useMemo(() => {
    if (!infor?.renter?.driverCityProvince || !infor?.renter?.driverDistrict)
      return [];

    const tmp = address.filter(
      (item) => item.City_Province === infor?.renter?.driverCityProvince
    );

    const tmp2 = tmp.filter(
      (item) => item.Disctrict === infor.renter.driverDistrict
    );
    return Array.from(new Set(tmp2.map((item) => item.Ward))).map((dsc) => ({
      label: dsc,
      value: dsc,
    }));
  }, [
    address,
    infor?.renter?.driverCityProvince,
    infor?.renter?.driverDistrict,
  ]);

  //accept file
  const allowedExtensions = [".doc", ".docx", ".pdf", ".jpg", ".jpeg", ".png"];

  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState("");

  //handle input file
  const handleFileChange = async (event) => {
    //get file
    const file = event.target.files[0];
    if (!file) return;

    //check file
    const fileExt = file.name
      .substring(file.name.lastIndexOf("."))
      .toLowerCase();

    //check file
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

    // if valid file save to IndexedDB
    await saveFileToDB("driverDrivingLicense", file);
    // save to state
    setSelectedFile(file);
    setFileError(""); // clear error
    dispatch(
      setInfor({
        ...infor,
        renter: { ...infor.renter, drivingLicenseName: file.name },
      })
    );
    dispatch(setErrorsBooking({ ...errorsBooking, drivingLicenseUrl: "" }));
  };

  return (
    <>
      <BookingDescript />
      <Box sx={{ mx: "auto", maxWidth: "1200px", p: 2 }}>
        <Box
          sx={{
            maxWidth: "1200px",
            margin: "auto",
            p: 3,
            mb: 3,
            border: "1px solid #ddd",
            borderRadius: 2,
            boxShadow: 1,
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
                  value={infor?.data?.driverFullName || ""}
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
                  value={infor?.data?.driverPhoneNumber}
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
                  value={infor?.data?.driverNationalId}
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                />
              )}
            </Grid>

            {/* Cột 2 */}
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
                    value={dayjs(infor?.data?.dob)}
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
                  value={infor?.data?.driverEmail}
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
                    infor?.data?.drivingLicenseUrl
                      ? "Click to Download"
                      : "No file available"
                  }
                  InputProps={{
                    endAdornment: infor?.data?.drivingLicenseUrl && (
                      <InputAdornment position="end">
                        <IconButton
                          component="a"
                          href={infor.data.drivingLicenseUrl}
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
              value={infor?.data?.driverCityProvince}
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
              value={infor?.data?.driverDistrict}
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
              value={infor?.data?.driverWard}
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
              value={infor?.data?.driverHouseNumberStreet}
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
          control={<Checkbox checked={infor?.driver} />}
          id="differentRent"
          label="Different than Renter's information"
          onChange={(e) => dispatch(setInfor({ driver: !infor?.driver }))}
        />

        <Box
          sx={{
            maxWidth: "1200px",
            margin: "auto",
            p: 3,
            mt: 3,
            border: "1px solid #ddd",
            borderRadius: 2,
            boxShadow: 1,
            bgcolor: "white",
          }}
        >
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Driver's information
          </Typography>

          <Grid container spacing={3}>
            {/* Cột 1 */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <TextField
                  label="Full Name"
                  required
                  variant="standard"
                  id="name"
                  disabled={!infor?.driver}
                  size="small"
                  value={infor?.renter?.driverFullName || ""}
                  error={!!errorsBooking?.fullName}
                  sx={{
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "primary.main", // blue color when focused
                    },
                    "& .MuiInputLabel-root.MuiInputLabel-shrink": {
                      color: "primary.main", // blue color when shrink
                    },
                  }}
                  onChange={(e) => {
                    const newValue = e.target.value;

                    if (infor?.renter?.driverFullName !== newValue) {
                      dispatch(
                        setInfor({
                          ...infor,
                          renter: {
                            ...infor?.renter,
                            driverFullName: newValue,
                          },
                        })
                      );
                    }
                    // Chỉ xóa lỗi nếu có giá trị, đặt lại lỗi nếu rỗng
                    dispatch(
                      setErrorsBooking({
                        ...errorsBooking,
                        fullName: "",
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
                  disabled={!infor?.driver}
                  value={infor?.renter?.driverPhoneNumber}
                  error={!!errorsBooking?.phoneNumber}
                  onKeyDown={(e) => {
                    if (["e", "E", "+", "-", "."].includes(e.key)) {
                      e.preventDefault(); // Prevent default behavior for e, E, +, -
                    }
                  }}
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
                  onChange={(e) => {
                    const newValue = e.target.value;
                    if (infor?.renter?.driverPhoneNumber !== newValue) {
                      dispatch(
                        setInfor({
                          ...infor,
                          renter: {
                            ...infor?.renter,
                            driverPhoneNumber: e.target.value,
                          },
                        })
                      );
                    }
                    // Chỉ xóa lỗi nếu có giá trị, đặt lại lỗi nếu rongyang
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
                  error={!!errorsBooking?.nationalId}
                  value={infor?.renter?.driverNationalId}
                  onKeyDown={(e) => {
                    if (["e", "E", "+", "-", "."].includes(e.key)) {
                      e.preventDefault(); // Prevent default behavior for e, E, +, -
                    }
                  }}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    if (infor?.renter?.driverNationalId !== newValue) {
                      dispatch(
                        setInfor({
                          ...infor,
                          renter: {
                            ...infor?.renter,
                            driverNationalId: e.target.value,
                          },
                        })
                      ); // Cập nhật state}
                    }
                    // Chỉ xóa lỗi nếu có giá trị, đặt lại lỗi nếu rongyang
                    dispatch(
                      setErrorsBooking({
                        ...errorsBooking,
                        nationalId: "",
                      })
                    );
                  }}
                  disabled={!infor?.driver}
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

            {/* Cột 2 */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                {errorsBooking?.dob && (
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
                    value={selectedDate ? dayjs(selectedDate) : null}
                    error={!!errorsBooking?.dob}
                    sx={{
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "primary.main", // blue color when focused
                      },
                      "& .MuiInputLabel-root.MuiInputLabel-shrink": {
                        color: "primary.main", // blue color when shrink
                      },
                    }}
                    disabled={!infor?.driver}
                    onChange={(date) => {
                      const formattedDate = date
                        ? dayjs(date).format("YYYY-MM-DD")
                        : null;

                      dispatch(
                        setInfor({
                          ...infor,
                          renter: {
                            ...infor?.renter,
                            driverDob: formattedDate,
                          },
                        })
                      );

                      // Chỉ xóa lỗi nếu có giá trị, đặt lại lỗi nếu rongyang
                      dispatch(
                        setErrorsBooking({
                          ...errorsBooking,
                          dob: "",
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
                  type="email" // Hỗ trợ kiểm tra định dạng email
                  placeholder="example@gmail.com" // Gợi ý người dùng nhập đúng định dạng
                  error={!!errorsBooking?.email}
                  value={infor?.renter?.driverEmail}
                  sx={{
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "primary.main", // blue color when focused
                    },
                    "& .MuiInputLabel-root.MuiInputLabel-shrink": {
                      color: "primary.main", // blue color when shrink
                    },
                  }}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    if (infor?.renter?.driverEmail !== newValue) {
                      dispatch(
                        setInfor({
                          ...infor,
                          renter: {
                            ...infor?.renter,
                            driverEmail: e.target.value,
                          },
                        })
                      );
                    }
                    dispatch(
                      setErrorsBooking({
                        ...errorsBooking,
                        email: "",
                      })
                    );
                  }}
                  required
                  disabled={!infor?.driver}
                />
              </FormControl>

              {/* Driving license */}
              <Grid container spacing={1}>
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
                      error={!!fileError || !!errorsBooking?.drivingLicenseUrl}
                      helperText={
                        fileError || errorsBooking?.drivingLicenseUrl || ""
                      }
                      value={selectedFile ? selectedFile.name : ""}
                      disabled={!infor?.driver}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <input
                    type="file"
                    accept=".doc,.docx,.pdf,.jpg,.jpeg,.png"
                    style={{ display: "none" }} // Ẩn input file
                    id="upload-driving-license"
                    onChange={handleFileChange}
                    disabled={!infor?.driver}
                  />
                  <label htmlFor="upload-driving-license">
                    <Button variant="contained" fullWidth component="span">
                      Upload
                    </Button>
                  </label>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, mt: 2 }}>
            Address: <span style={{ color: "red" }}>*</span>
          </Typography>

          {/* City / Province */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <Autocomplete
              options={cityProvince}
              size="small"
              disabled={!infor?.driver}
              sx={{
                "& .MuiInputLabel-root": {
                  fontSize: "14px", // Chỉnh cỡ chữ
                },
              }}
              getOptionLabel={(option) => option.label} // Hiển thị label
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="City/Province."
                  variant="standard"
                  name="addressCityProvince"
                  id="city"
                  error={!!errorsBooking?.addressCityProvince}
                  required
                  sx={{
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "primary.main", // blue color when focused
                    },
                    "& .MuiInputLabel-root.MuiInputLabel-shrink": {
                      color: "primary.main", // blue color when shrink
                    },
                  }}
                  slotProps={{
                    ...params.InputProps,
                    style: { color: "gray" }, // Màu xám nhạt
                  }}
                />
              )}
              value={
                cityProvince.length > 0 && infor?.renter?.driverCityProvince
                  ? cityProvince.find(
                      (option) =>
                        option.value === infor?.renter?.driverCityProvince
                    ) || null
                  : null
              }
              onChange={(event, newValue) => {
                dispatch(
                  setInfor({
                    ...infor,
                    renter: {
                      ...infor?.renter,
                      driverCityProvince: newValue?.value || "",
                      driverDistrict: "",
                      driverWard: "",
                      driverHouseNumberStreet: "",
                    },
                    selectedCityProvince: newValue?.label || "",
                  })
                );
                if (newValue) {
                  dispatch(
                    setErrorsBooking({
                      ...errorsBooking,
                      addressCityProvince: "",
                    })
                  ); // Xóa lỗi
                }
              }}
            />
          </FormControl>

          {/* District */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <Autocomplete
              options={filteredDistrict} // Danh sách màu sắc
              sx={{
                "& .MuiInputLabel-root": {
                  fontSize: "14px", // Chỉnh cỡ chữ
                },
              }}
              getOptionLabel={(option) => option.label} // Hiển thị label
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
                  error={!!errorsBooking?.addressDistrict} // Nếu có lỗi thì hiện màu đỏ
                  slotProps={{
                    ...params.InputProps,
                    style: { color: "gray" }, // Màu xám nhạt
                  }}
                />
              )}
              value={
                filteredDistrict.length > 0 && infor.renter.driverDistrict
                  ? filteredDistrict.find(
                      (option) => option.value === infor.renter.driverDistrict
                    ) || null
                  : null
              }
              onChange={(event, newValue) => {
                dispatch(
                  setInfor({
                    ...infor,
                    renter: {
                      ...infor?.renter,
                      driverDistrict: newValue?.value || "",
                      driverWard: "",
                      driverHouseNumberStreet: "",
                    },
                    selectedDistrict: newValue?.label || "",
                  })
                );
                if (newValue) {
                  dispatch(
                    setErrorsBooking({ ...errorsBooking, addressDistrict: "" })
                  ); // Xóa lỗi
                }
              }}
              disabled={!infor?.renter?.driverCityProvince || !infor?.driver}
            />
          </FormControl>

          {/* Ward */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <Autocomplete
              options={filteredWard} // Danh sách màu sắc
              sx={{
                "& .MuiInputLabel-root": {
                  fontSize: "14px", // Chỉnh cỡ chữ
                },
              }}
              getOptionLabel={(option) => option.label} // Hiển thị label
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Ward."
                  variant="standard"
                  name="addressWard"
                  id="ward"
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
                  error={!!errorsBooking?.addressWard} // Nếu có lỗi thì hiện màu đỏ
                  slotProps={{
                    ...params.InputProps,
                    style: { color: "gray" }, // Màu xám nhạt
                  }}
                />
              )}
              value={
                filteredWard.find((c) => c.value === infor?.renter?.driverWard) ||
                null
              } // Liên kết với state
              onChange={(event, newValue) => {
                dispatch(
                  setInfor({
                    ...infor,
                    renter: {
                      ...infor?.renter,
                      driverWard: newValue?.value || "",
                      driverHouseNumberStreet: "",
                    },
                  })
                );
                if (newValue) {
                  dispatch(
                    setErrorsBooking({ ...errorsBooking, addressWard: "" })
                  ); // Xóa lỗi
                }
              }}
              disabled={!infor?.renter?.driverDistrict || !infor?.driver}
            />
          </FormControl>

          {/* House number, Street */}
          <FormControl fullWidth>
            <TextField
              label="House number, Street."
              size="small"
              variant="standard"
              disabled={!infor?.driver}
              name="addressHouseNumberStreet"
              id="numberStreet"
              sx={{
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "primary.main", // blue color when focused
                },
                "& .MuiInputLabel-root.MuiInputLabel-shrink": {
                  color: "primary.main", // blue color when shrink
                },
              }}
              error={!!errorsBooking?.addressHouseNumberStreet} // Nếu có lỗi thì hiện màu đỏ
              value={infor?.renter?.driverHouseNumberStreet}
              onChange={(event) => {
                dispatch(
                  setInfor({
                    ...infor,
                    renter: {
                      ...infor?.renter,
                      driverHouseNumberStreet: event.target.value,
                    },
                  })
                );
                if (event.target.value) {
                  dispatch(
                    setErrorsBooking({
                      ...errorsBooking,
                      addressHouseNumberStreet: "",
                    })
                  ); // Xóa lỗi
                }
              }}
            />
          </FormControl>
        </Box>
      </Box>
      <Box m={2} style={{ textAlign: "center" }}>
        <Button
          variant="contained"
          id="nextButton"
          onClick={() => {
            dispatch(handleNext());

            setTimeout(() => {
              if (
                Object.keys(store.getState().rentCar.errorsBooking).length === 0
              ) {
                dispatch(setStepBooking(step + 1));
                navigate(`/booking-pay/${carId}`);
              }
            }, 0); //wait for redux store to update
          }}
          sx={{ ml: 2 }}
          style={{ backgroundColor: "#00bfa5" }}
        >
          Next
        </Button>
      </Box>
      <Footer />
    </>
  );
}
