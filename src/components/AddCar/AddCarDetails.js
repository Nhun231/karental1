import * as React from "react";
import TextField from "@mui/material/TextField";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Typography,
  Box,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Link,
  Autocomplete,
  Breadcrumbs,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useDropzone } from "react-dropzone";
import {
  setCarData,
  setErrors,
  setStep,
  handleNext,
  toggleFunction,
} from "../../reducers/carReducer";
import { useState, useEffect, useMemo } from "react";
import {
  Bluetooth,
  GpsFixed,
  CameraAlt,
  WbSunny,
  Lock,
  ChildCare,
  Dvr,
  Usb,
} from "@mui/icons-material";
import IconButton from "@mui/material/IconButton"; // Import từ @mui/material
import CloseIcon from "@mui/icons-material/Close";
import {
  saveFileToDB,
  deleteFileFromDB,
  getFileFromDB,
} from "../../Helper/indexedDBHelper";
import { store } from "../../redux/store";
import CarStepper from "./CarStepper";
import axios from "axios";
import Header from "../common/Header";
import Footer from "../common/Footer";
import NavigateBreadcrumb from "../common/NavigateBreadcrumb";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB file allow to input

export default function AddCarDetails() {
  //style for box input image
  const styles = {
    border: "2px dashed #999",
    borderRadius: "8px",
    p: 3,
    textAlign: "center",
    cursor: "pointer",
    width: "250px",
    height: "200px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    "&:hover": { borderColor: "blue" },
  };

  const dispatch = useDispatch(); // Retrieves the Redux dispatch function to send actions to the store
  const navigate = useNavigate(); // Gets the navigation function from React Router for programmatic navigation

  //repository to pick data
  const {
    carData = {},
    errors = {},
    step,
  } = useSelector((state) => state.cars); // Extracts carData and errors from the Redux store, defaulting to empty objects if undefined

  //function edit error
  const handleError = (errorType, message) => {
    // Updates the Redux store with a new error message for the specified error type
    dispatch(setErrors({ ...errors, [errorType]: message }));
  };

  //function to change and store value into repository
  const handleChange = (event) => {
    dispatch(toggleFunction(event.target.name));
  };

  // use useEffect to update the Redux store when `additionalFunctions` changes
  useEffect(() => {
    const selectedFunction = Object.keys(carData.additionalFunctions)
      .filter((key) => carData.additionalFunctions[key])
      .join(", ");
    dispatch(setCarData({ additionalFunction: selectedFunction }));
  }, [carData.additionalFunctions, dispatch]); // Dependencies include `carData.additionalFunctions` and `dispatch`

  // Function to handle file deletion
  const handleDeleteImage = async (fileType) => {
    await deleteFileFromDB(fileType); // Delete file from IndexedDB

    setFiles((prev) => ({
      ...prev,
      [fileType]: null, // delete file from state
    }));

    dispatch(setCarData({ [fileType]: "" })); // delete file from Redux

    setImagePreviews((prev) => ({
      ...prev,
      [fileType]: null, // delete preview from state
    }));
  };

  // State variables to store file and image previews
  const [files, setFiles] = useState({
    carImageFront: null,
    carImageBack: null,
    carImageLeft: null,
    carImageRight: null,
  });

  // State variables to store file and image previews
  const [imagePreviews, setImagePreviews] = useState({
    carImageFront: null,
    carImageBack: null,
    carImageLeft: null,
    carImageRight: null,
  });

  // validation extensions file
  const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif"];

  // Function to handle file upload
  const handleDrop = (fileType, errorType) => async (acceptedFiles) => {
    handleError(errorType, ""); // Clears any previous error message

    const validFile = acceptedFiles.find((file) => {
      const fileExt = file.name
        .substring(file.name.lastIndexOf("."))
        .toLowerCase();
      return allowedExtensions.includes(fileExt);
    });

    if (validFile) {
      await saveFileToDB(fileType, validFile); // Save file to IndexedDB

      setFiles((prev) => ({
        ...prev,
        [fileType]: validFile,
      })); // save file to state

      setImagePreviews((prev) => ({
        ...prev,
        [fileType]: URL.createObjectURL(validFile),
      })); //update image preview
      dispatch(setCarData({ [fileType]: validFile.name }));
    } else {
      const errorMessage = acceptedFiles.some(
        (file) => file.size > MAX_FILE_SIZE
      )
        ? "File size must be less than 5MB."
        : "Invalid file type! Only .doc, .docx, .pdf, .jpg, .jpeg, .png are allowed.";
      handleError(errorType, errorMessage);
      setFiles((prev) => ({ ...prev, [fileType]: null })); // delete file from state
      setImagePreviews((prev) => ({ ...prev, [fileType]: null })); // delete preview from state
      dispatch(setCarData({ [fileType]: "" })); // delete file from Redux
    }
  };

  // useDropzone hooks
  const dropzoneImageFront = useDropzone({
    onDrop: handleDrop("carImageFront", "carImageFront"),
    multiple: false,
  });

  //function to call function input image file and control multiple
  const dropzoneImageBack = useDropzone({
    onDrop: handleDrop("carImageBack", "carImageBack"),
    multiple: false,
  });

  //function to call function input image file and control multiple
  const dropzoneImageLeft = useDropzone({
    onDrop: handleDrop("carImageLeft", "carImageLeft"),
    multiple: false,
  });

  //function to call function input image file and control multiple
  const dropzoneImageRight = useDropzone({
    onDrop: handleDrop("carImageRight", "carImageRight"),
    multiple: false,
  });

  const [address, setAddress] = useState([]);
  const [cityProvince, setCityProvince] = useState([]);

  // Load address data
  useEffect(() => {
    axios.get("/database.json").then((res) => {
      const data = res.data.Address_list;
      setAddress(data);

      const uniqueCityProvince = Array.from(
        new Set(data.map((item) => item.City_Province))
      ).map((city) => ({ label: city, value: city }));

      // Set cityProvince state
      setCityProvince(uniqueCityProvince);
    });
  }, []);

  // Filtered data to filter district
  const filteredDistrict = useMemo(() => {
    const tmp = address.filter(
      (item) => item.City_Province === carData.selectedCityProvince
    );
    return Array.from(new Set(tmp.map((item) => item.Disctrict))).map(
      (dsc) => ({
        label: dsc,
        value: dsc,
      })
    );
  }, [address, carData.selectedCityProvince]);

  // Filtered data to filter wards
  const filteredWard = useMemo(() => {
    const tmp = address.filter(
      (item) => item.City_Province === carData.selectedCityProvince
    );

    const tmp2 = tmp.filter(
      (item) => item.Disctrict === carData.selectedDistrict
    );
    return Array.from(new Set(tmp2.map((item) => item.Ward))).map((dsc) => ({
      label: dsc,
      value: dsc,
    }));
  }, [address, carData.selectedCityProvince, carData.selectedDistrict]);

  // Load files from IndexedDB
  useEffect(() => {
    const loadFiles = async () => {
      // Retrieve stored files from IndexedDB
      const storedFiles = {
        carImageFront: await getFileFromDB("carImageFront"),
        carImageBack: await getFileFromDB("carImageBack"),
        carImageLeft: await getFileFromDB("carImageLeft"),
        carImageRight: await getFileFromDB("carImageRight"),
      };

      // Update the files state
      setFiles({
        carImageFront: storedFiles.carImageFront || null,
        carImageBack: storedFiles.carImageBack || null,
        carImageLeft: storedFiles.carImageLeft || null,
        carImageRight: storedFiles.carImageRight || null,
      });

      // Update the imagePreviews state
      setImagePreviews({
        carImageFront: storedFiles.carImageFront
          ? URL.createObjectURL(storedFiles.carImageFront)
          : null,
        carImageBack: storedFiles.carImageBack
          ? URL.createObjectURL(storedFiles.carImageBack)
          : null,
        carImageLeft: storedFiles.carImageLeft
          ? URL.createObjectURL(storedFiles.carImageLeft)
          : null,
        carImageRight: storedFiles.carImageRight
          ? URL.createObjectURL(storedFiles.carImageRight)
          : null,
      });
      document.title = "Add Car Details";
    };

    loadFiles();
  }, []);

  return (
    <>
      <Header />
      <Breadcrumbs sx={{ mx: "auto", maxWidth: "1200px", py: 1, px: 2 }}>
        <Link underline="hover" color="inherit" href="/">
          Home
        </Link>
        <Link underline="hover" color="inherit" href="#/my-cars">
          My Cars
        </Link>
        <Typography color="text.primary">Add Car Details</Typography>
      </Breadcrumbs>

      <Box sx={{ mx: "auto", maxWidth: "1200px" }}>
        <CarStepper />
        <Box
          component="form"
          onSubmit={(e) => e.preventDefault()}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "30px",
            marginTop: "30px",
            "& .MuiTextField-root": { m: 2, width: "50ch" },
          }}
          noValidate
          autoComplete="off"
        >
          {/* Mileage vs fuelConsumption */}
          <div className="flex-container">
            {/* filed input mileage */}
            <TextField
              required
              sx={{
                "& .MuiInputLabel-root": {
                  fontSize: "18px",
                  fontWeight: "bold",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "primary.main", // green color when focused
                },
                "& .MuiInputLabel-root.MuiInputLabel-shrink": {
                  color: "primary.main", // green color when shrink
                },
              }}
              error={!!errors.mileage}
              helperText={errors.mileage || "Please enter your mileage (km)"}
              id="mileage"
              label="Mileage: "
              variant="standard"
              name="mileage"
              type="number"
              value={carData.mileage}
              onKeyDown={(e) => {
                if (["e", "E", "+", "-", "."].includes(e.key)) {
                  e.preventDefault(); // Prevent e, E, +, -
                }
              }}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, ""); // Chỉ giữ số

                if (carData.mileage !== value) {
                  dispatch(setCarData({ mileage: value }));
                }

                if (value === "" || parseInt(value, 10) <= 0) {
                  dispatch(
                    setErrors({
                      ...errors,
                      mileage: "Mileage must be greater than 0",
                    })
                  );
                } else {
                  dispatch(setErrors({ ...errors, mileage: "" }));
                }
              }}
              slotProps={{
                input: {
                  style: { color: "black" }, // Grey
                },
              }}
            />

            {/* filed input fuel consumtion */}
            <TextField
              required
              error={!!errors.fuelConsumption}
              helperText={errors.fuelConsumption || "Liter/100 km"}
              id="fuelConsumption"
              label="Fuel Consumption: "
              variant="standard"
              name="fuelConsumption"
              type="number"
              value={carData.fuelConsumption}
              sx={{
                "& .MuiInputLabel-root": {
                  fontSize: "18px", // edit size
                  fontWeight: "bold",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "primary.main", // green color when focused
                },
                "& .MuiInputLabel-root.MuiInputLabel-shrink": {
                  color: "primary.main", // green color when shrink
                },
              }}
              onKeyDown={(e) => {
                if (["e", "E", "+", "-"].includes(e.key)) {
                  e.preventDefault(); // Prevent e, E, +, -
                }
              }}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9.]/g, ""); // Chỉ cho phép số và dấu chấm (phần thập phân)
                const number = parseFloat(value); // Chuyển thành số

                if (carData.fuelConsumption !== value) {
                  dispatch(setCarData({ fuelConsumption: value }));
                }

                if (value === "" || (number > 0 && !isNaN(number))) {
                  dispatch(setErrors({ ...errors, fuelConsumption: "" })); // Xóa lỗi nếu hợp lệ
                } else {
                  dispatch(
                    setErrors({
                      ...errors,
                      fuelConsumption:
                        "Fuel consumption must be greater than 0",
                    })
                  );
                }
              }}
              slotProps={{
                input: {
                  style: { color: "black" }, // Grey
                },
              }}
            />
          </div>

          {/* Address */}
          <div className="flex-container">
            <div>
              <Typography variant="h6">Address</Typography>

              {/* filed input city, province */}
              <Autocomplete
                options={cityProvince} // List city
                sx={{
                  "& .MuiInputLabel-root": {
                    fontSize: "18px",
                    fontWeight: "bold",
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "primary.main", // green color when focused
                  },
                  "& .MuiInputLabel-root.MuiInputLabel-shrink": {
                    color: "primary.main", // green color when shrink
                  },
                }}
                getOptionLabel={(option) => option.label} // display name
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="City/Province"
                    name="addressCityProvince"
                    id="addressCityProvince"
                    variant="standard"
                    required
                    error={!!errors.addressCityProvince} // display error
                    helperText={
                      errors.addressCityProvince ||
                      "Please select your City/Province"
                    } //
                    slotProps={{
                      ...params.InputProps,
                      style: { color: "black" }, // Grey
                    }}
                  />
                )}
                value={
                  // Select city
                  cityProvince.find(
                    (option) => option.value === carData.addressCityProvince
                  ) || null
                }
                onChange={(event, newValue) => {
                  dispatch(
                    setCarData({
                      ...carData,
                      addressCityProvince: newValue?.value || "",
                      selectedCityProvince: newValue?.label || "",
                      address: (
                        (carData?.addressCityProvince || "") +
                        ", " +
                        (carData?.addressDistrict || "") +
                        ", " +
                        (carData?.addressWard || "") +
                        ", " +
                        (carData?.addressHouseNumberStreet || "")
                      ).replace(/^, /, ""), // Remove leading comma
                      addressDistrict: "",
                      addressWard: "",
                      addressHouseNumberStreet: "",
                    })
                  );
                  if (newValue) {
                    dispatch(setErrors({ ...errors, addressCityProvince: "" })); // delete error
                  }
                }}
              />

              {/* filed input district */}
              <Autocomplete
                options={filteredDistrict} // list district
                sx={{
                  "& .MuiInputLabel-root": {
                    fontSize: "18px", // edit size
                    fontWeight: "bold",
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "primary.main", // green color when focused
                  },
                  "& .MuiInputLabel-root.MuiInputLabel-shrink": {
                    color: "primary.main", // green color when shrink
                  },
                }}
                getOptionLabel={(option) => option.label} // display name
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="District"
                    name="addressDistrict"
                    id="addressDistrict"
                    variant="standard"
                    required
                    error={!!errors.addressDistrict} // if error
                    helperText={
                      errors.addressDistrict || "Please select your District"
                    } // display error
                    slotProps={{
                      ...params.InputProps,
                      style: { color: "black" }, // grey
                    }}
                  />
                )}
                value={
                  filteredDistrict.find(
                    (c) => c.value === carData.addressDistrict
                  ) || null
                } // select district
                onChange={(event, newValue) => {
                  dispatch(
                    setCarData({
                      ...carData,
                      addressDistrict: newValue?.value || "",
                      selectedDistrict: newValue?.label || "",
                      address: (
                        (carData?.addressCityProvince || "") +
                        ", " +
                        (carData?.addressDistrict || "") +
                        ", " +
                        (carData?.addressWard || "") +
                        ", " +
                        (carData?.addressHouseNumberStreet || "")
                      ).replace(/^, /, ""), // Remove leading comma
                      addressWard: "",
                      addressHouseNumberStreet: "",
                    })
                  );
                  if (newValue) {
                    dispatch(setErrors({ ...errors, addressDistrict: "" })); // delete error
                  }
                }}
                disabled={!carData.selectedCityProvince}
              />

              {/* filed input ward */}
              <Autocomplete
                options={filteredWard} // list ward
                sx={{
                  "& .MuiInputLabel-root": {
                    fontSize: "18px",
                    fontWeight: "bold",
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "primary.main", // green color when focused
                  },
                  "& .MuiInputLabel-root.MuiInputLabel-shrink": {
                    color: "primary.main", // green color when shrink
                  },
                }}
                getOptionLabel={(option) => option.label} // display name
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Ward"
                    name="addressWard"
                    id="addressWard"
                    variant="standard"
                    required
                    error={!!errors.addressWard} // display error
                    helperText={errors.addressWard || "Please select your Ward"} // display error
                    slotProps={{
                      ...params.InputProps,
                      style: { color: "black" }, // grey
                    }}
                  />
                )}
                value={
                  filteredWard.find((c) => c.value === carData.addressWard) ||
                  null
                } // select ward
                onChange={(event, newValue) => {
                  dispatch(
                    setCarData({
                      ...carData,
                      addressWard: newValue?.value || "",
                      address: (
                        (carData?.addressCityProvince || "") +
                        ", " +
                        (carData?.addressDistrict || "") +
                        ", " +
                        (carData?.addressWard || "") +
                        ", " +
                        (carData?.addressHouseNumberStreet || "")
                      ).replace(/^, /, ""), // Remove leading comma
                      addressHouseNumberStreet: "",
                    })
                  );
                  if (newValue) {
                    dispatch(setErrors({ ...errors, addressWard: "" })); // delete error
                  }
                }}
                disabled={!carData.selectedDistrict}
              />

              {/* filed input house address and number street */}
              <TextField
                required
                error={!!errors.addressHouseNumberStreet}
                helperText={
                  errors.addressHouseNumberStreet ||
                  "Please enter your house number and street"
                }
                id="street"
                label="House number, Street: "
                variant="standard"
                name="addressHouseNumberStreet"
                value={carData.addressHouseNumberStreet}
                sx={{
                  "& .MuiInputLabel-root": {
                    fontSize: "18px", // edit size
                    fontWeight: "bold",
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "primary.main", // green color when focused
                  },
                  "& .MuiInputLabel-root.MuiInputLabel-shrink": {
                    color: "primary.main", // green color when shrink
                  },
                }}
                onChange={(e) => {
                  const newAddressHouseNumberStreet = e.target.value.trim();
                  if (newAddressHouseNumberStreet === "") return;
                  const addressParts = [
                    carData?.addressCityProvince || "",
                    carData?.addressDistrict || "",
                    carData?.addressWard || "",
                    newAddressHouseNumberStreet || "",
                  ];

                  const formattedAddress = addressParts
                    .filter((part) => part.trim() !== "") // delete empty string
                    .join(", "); // combine address

                  dispatch(
                    setCarData({
                      addressHouseNumberStreet: e.target.value,
                      address: formattedAddress,
                    })
                  );

                  if (newAddressHouseNumberStreet) {
                    dispatch(
                      setErrors({ ...errors, addressHouseNumberStreet: "" })
                    ); // Xóa lỗi
                  }
                }}
                slotProps={{
                  input: {
                    style: { color: "black" },
                  },
                }}
              />
              <Typography
                variant="h6"
                style={{
                  marginTop: "15px",
                  color: "rgba(0, 0, 0, 0.6)",
                  fontWeight: "bold",
                }}
              >
                Additional functions:
              </Typography>
            </div>

            <div>
              {/* filed input description */}
              <TextField
                id="description"
                required
                placeholder="Description of your vehicle"
                label="Description"
                multiline
                name="description"
                error={!!errors.description}
                helperText={errors.description}
                value={carData.description}
                onChange={(e) => {
                  dispatch(setCarData({ description: e.target.value }));
                  dispatch(setErrors({ ...errors, description: "" }));
                }}
                rows={4}
                sx={{
                  "& .MuiInputLabel-root": {
                    fontSize: "18px", // Chỉnh cỡ chữ
                    fontWeight: "bold",
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "primary.main", // green color when focused
                  },
                  "& .MuiInputLabel-root.MuiInputLabel-shrink": {
                    color: "primary.main", // green color when shrink
                  },
                }}
                variant="standard"
                style={{ marginTop: "50px", backgroundColor: "white" }}
              />
            </div>
          </div>

          {/* Additional functions */}
          <Box display="flex" gap={2} flexWrap="wrap" justifyContent="center">
            {/* column 1 */}
            <FormGroup
              style={{
                backgroundColor: "white",
                padding: "20px",
                width: "220px",
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={carData?.additionalFunctions?.Bluetooth || false}
                    onChange={handleChange}
                    name="Bluetooth"
                  />
                }
                id="bluetooth"
                label={
                  <Box display={"flex"} gap={1}>
                    <Bluetooth />
                    <Typography>Bluetooth</Typography>
                  </Box>
                }
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={carData?.additionalFunctions?.GPS || false}
                    onChange={handleChange}
                    name="GPS"
                  />
                }
                id="gps"
                label={
                  <Box display={"flex"} gap={1}>
                    <GpsFixed />
                    <Typography>GPS</Typography>
                  </Box>
                }
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={carData?.additionalFunctions?.Camera || false}
                    onChange={handleChange}
                    name="Camera"
                  />
                }
                id="camera"
                label={
                  <Box display={"flex"} gap={1}>
                    <CameraAlt />
                    <Typography>Camera</Typography>
                  </Box>
                }
              />
            </FormGroup>

            {/* column 2 */}
            <FormGroup
              style={{
                backgroundColor: "white",
                padding: "20px",
                width: "220px",
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={carData?.additionalFunctions?.SunRoof || false}
                    onChange={handleChange}
                    name="SunRoof"
                  />
                }
                id="sunroof"
                label={
                  <Box display={"flex"} gap={1}>
                    <WbSunny />
                    <Typography>Sun roof</Typography>
                  </Box>
                }
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={carData?.additionalFunctions?.ChildLock || false}
                    onChange={handleChange}
                    name="ChildLock"
                  />
                }
                id="childlock"
                label={
                  <Box display={"flex"} gap={1}>
                    <Lock />
                    <Typography>Child lock</Typography>
                  </Box>
                }
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={carData?.additionalFunctions?.ChildSeat || false}
                    onChange={handleChange}
                    name="ChildSeat"
                  />
                }
                id="childseat"
                label={
                  <Box display={"flex"} gap={1}>
                    <ChildCare />
                    <Typography>Child lock</Typography>
                  </Box>
                }
              />
            </FormGroup>

            {/* column 3 */}
            <FormGroup
              style={{
                backgroundColor: "white",
                padding: "20px",
                width: "220px",
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={carData?.additionalFunctions?.DVD || false}
                    onChange={handleChange}
                    name="DVD"
                  />
                }
                id="dvd"
                label={
                  <Box display={"flex"} gap={1}>
                    <Dvr />
                    <Typography>DVD</Typography>
                  </Box>
                }
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={carData?.additionalFunctions?.USB || false}
                    onChange={handleChange}
                    name="USB"
                  />
                }
                id="usb"
                label={
                  <Box display={"flex"} gap={1}>
                    <Usb />
                    <Typography>USB</Typography>
                  </Box>
                }
              />
            </FormGroup>
          </Box>

          <div style={{ position: "relative", right: "390px", margin: "30px" }}>
            <Typography variant="h6">
              Images: <span style={{ color: "red" }}>*</span>
            </Typography>
          </div>

          {/* images */}
          <div style={{ display: "flex", gap: "100px", marginBottom: "30px" }}>
            <div>
              {/* Label */}
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "18px",
                    color: imagePreviews.carImageFront
                      ? "rgb(25, 118, 210)"
                      : "rgba(0, 0, 0, 0.6)",
                  }}
                >
                  Front:
                </Typography>
                <Typography variant="subtitle1" sx={{ color: "red", ml: 0.5 }}>
                  *
                </Typography>
              </Box>
              {imagePreviews.carImageFront ? (
                <div style={{ position: "relative" }}>
                  <img
                    src={imagePreviews.carImageFront}
                    alt="Car Front Preview"
                    style={{
                      width: "300px",
                      height: "250px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />

                  <IconButton
                    onClick={() => handleDeleteImage("carImageFront")}
                    sx={{
                      position: "absolute",
                      top: 5,
                      right: 5,
                      background: "rgba(0,0,0,0.5)",
                      color: "white",
                      "&:hover": { background: "rgba(0,0,0,0.8)" },
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </div>
              ) : (
                <Box {...dropzoneImageFront.getRootProps()} sx={styles}>
                  <input
                    {...dropzoneImageFront.getInputProps()}
                    id="carImageFront"
                  />
                  <CloudUploadIcon sx={{ fontSize: 40, color: "#555" }} />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Drag and drop OR
                  </Typography>
                  <Link
                    component="button"
                    variant="body2"
                    sx={{ color: "blue" }}
                  >
                    Select file
                  </Link>
                </Box>
              )}

              {errors.carImageFront && (
                <Alert severity="error" id="carImageFrontError">
                  {errors.carImageFront}
                </Alert>
              )}
              {files.carImageFront && (
                <Typography sx={{ fontWeight: "bold" }}>
                  Selected file: {files.carImageFront?.name}
                </Typography>
              )}
            </div>

            <div>
              {/* Label */}
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "18px",
                    color: imagePreviews.carImageBack
                      ? "rgb(25, 118, 210)"
                      : "rgba(0, 0, 0, 0.6)",
                  }}
                >
                  Back:
                </Typography>
                <Typography variant="subtitle1" sx={{ color: "red", ml: 0.5 }}>
                  *
                </Typography>
              </Box>
              {imagePreviews.carImageBack ? (
                <div style={{ position: "relative" }}>
                  <img
                    src={imagePreviews.carImageBack}
                    alt="Car Front Preview"
                    style={{
                      width: "300px",
                      height: "250px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />

                  <IconButton
                    onClick={() => handleDeleteImage("carImageBack")}
                    sx={{
                      position: "absolute",
                      top: 5,
                      right: 5,
                      background: "rgba(0,0,0,0.5)",
                      color: "white",
                      "&:hover": { background: "rgba(0,0,0,0.8)" },
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </div>
              ) : (
                <Box {...dropzoneImageBack.getRootProps()} sx={styles}>
                  <input
                    {...dropzoneImageBack.getInputProps()}
                    id="carImageBack"
                  />
                  <CloudUploadIcon sx={{ fontSize: 40, color: "#555" }} />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Drag and drop OR
                  </Typography>
                  <Link
                    component="button"
                    variant="body2"
                    sx={{ color: "blue" }}
                  >
                    Select file
                  </Link>
                </Box>
              )}
              {errors.carImageBack && (
                <Alert severity="error" id="carImageBackError">
                  {errors.carImageBack}
                </Alert>
              )}
              {files.carImageBack && (
                <Typography sx={{ fontWeight: "bold" }}>
                  Selected file: {files.carImageBack?.name}
                </Typography>
              )}
            </div>
          </div>

          <div style={{ display: "flex", gap: "100px" }}>
            <div>
              {/* Label */}
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "18px",
                    color: imagePreviews.carImageLeft
                      ? "rgb(25, 118, 210)"
                      : "rgba(0, 0, 0, 0.6)",
                  }}
                >
                  Left:
                </Typography>
                <Typography variant="subtitle1" sx={{ color: "red", ml: 0.5 }}>
                  *
                </Typography>
              </Box>
              {imagePreviews.carImageLeft ? (
                <div style={{ position: "relative" }}>
                  <img
                    src={imagePreviews.carImageLeft}
                    alt="Car Front Preview"
                    style={{
                      width: "300px",
                      height: "250px",
                      objectFit: "cover", // keep image aspect ratio
                      borderRadius: "8px",
                    }}
                  />

                  <IconButton
                    onClick={() => handleDeleteImage("carImageLeft")}
                    sx={{
                      position: "absolute",
                      top: 5,
                      right: 5,
                      background: "rgba(0,0,0,0.5)",
                      color: "white",
                      "&:hover": { background: "rgba(0,0,0,0.8)" },
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </div>
              ) : (
                <Box {...dropzoneImageLeft.getRootProps()} sx={styles}>
                  <input
                    {...dropzoneImageLeft.getInputProps()}
                    id="carImageLeft"
                  />
                  <CloudUploadIcon sx={{ fontSize: 40, color: "#555" }} />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Drag and drop OR
                  </Typography>
                  <Link
                    component="button"
                    variant="body2"
                    sx={{ color: "blue" }}
                  >
                    Select file
                  </Link>
                </Box>
              )}
              {errors.carImageLeft && (
                <Alert severity="error" id="carImageLeftError">
                  {errors.carImageLeft}
                </Alert>
              )}
              {files.carImageLeft && (
                <Typography sx={{ fontWeight: "bold" }}>
                  Selected file: {files.carImageLeft?.name}
                </Typography>
              )}
            </div>

            <div>
              {/* Label */}
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "18px",
                    color: imagePreviews.carImageRight
                      ? "rgb(25, 118, 210)"
                      : "rgba(0, 0, 0, 0.6)",
                  }}
                >
                  Right:
                </Typography>
                <Typography variant="subtitle1" sx={{ color: "red", ml: 0.5 }}>
                  *
                </Typography>
              </Box>
              {imagePreviews.carImageRight ? (
                <div style={{ position: "relative" }}>
                  <img
                    src={imagePreviews.carImageRight}
                    alt="Car Front Preview"
                    style={{
                      width: "300px",
                      height: "250px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />

                  <IconButton
                    onClick={() => handleDeleteImage("carImageRight")}
                    sx={{
                      position: "absolute",
                      top: 5,
                      right: 5,
                      background: "rgba(0,0,0,0.5)",
                      color: "white",
                      "&:hover": { background: "rgba(0,0,0,0.8)" },
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </div>
              ) : (
                <Box {...dropzoneImageRight.getRootProps()} sx={styles}>
                  <input
                    {...dropzoneImageRight.getInputProps()}
                    id="carImageRight"
                  />
                  <CloudUploadIcon sx={{ fontSize: 40, color: "#555" }} />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Drag and drop OR
                  </Typography>
                  <Link
                    component="button"
                    variant="body2"
                    sx={{ color: "blue" }}
                  >
                    Select file
                  </Link>
                </Box>
              )}
              {errors.carImageRight && (
                <Alert severity="error" id="carImageRightError">
                  {errors.carImageRight}
                </Alert>
              )}
              {files.carImageRight && (
                <Typography sx={{ fontWeight: "bold" }}>
                  Selected file: {files.carImageRight?.name}
                </Typography>
              )}
            </div>
          </div>

          <p
            style={{ position: "relative", right: "280px", marginTop: "30px" }}
          >
            Please inlude full 4 images of your vehicle <br></br>
            File type: .jpg, .jpeg, .png, .gif
          </p>

          <Box mt={2} style={{ textAlign: "center" }}>
            {/* button back */}
            {step >= 1 && (
              <>
                <Button
                  variant="contained"
                  id="cancel"
                  onClick={() => {
                    navigate("/");
                  }}
                  sx={{ ml: 2, mr: 4 }}
                  style={{ backgroundColor: "red" }}
                >
                  Cancel
                </Button>
              <Button
                variant="contained"
                onClick={() => {
                  if (step !== 1) {
                    dispatch(setStep(step - 1));
                  }
                  navigate("/add-car-basic");
                }}
                sx={{ mr: 2 }}
                style={{ backgroundColor: "#05ce80" }}
              >
                Back
              </Button>
              </>
            )}

            {/* button next */}
            {step >= 2 && (
              <Button
                variant="contained"
                id="nextButton"
                onClick={() => {
                  dispatch(handleNext());

                  setTimeout(() => {
                    if (
                      Object.keys(store.getState().cars.errors).length === 0
                    ) {
                      navigate("/add-car-pricing");
                    }
                  }, 0); //wait for redux store to update
                }}
                sx={{ ml: 2 }}
                style={{ backgroundColor: "#00bfa5" }}
              >
                Next
              </Button>
            )}
          </Box>
        </Box>
      </Box>
      <Footer />
    </>
  );
}
