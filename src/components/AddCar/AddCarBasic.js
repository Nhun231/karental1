import * as React from "react";
import TextField from "@mui/material/TextField";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  ToggleButton,
  Alert,
  ToggleButtonGroup,
  Typography,
  Box,
  Button,
  Link,
  Autocomplete,
  Breadcrumbs,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useDropzone } from "react-dropzone";
import {
  setCarData,
  setErrors,
  toggleProperty,
  handleNext,
} from "../../reducers/carReducer";
import { useState, useEffect, useMemo } from "react";
import { saveFileToDB, getFileFromDB } from "../../Helper/indexedDBHelper";
import { store } from "../../redux/store";
import CarStepper from "./CarStepper";
import Footer from "../common/Footer";
import axios from "axios";
import Header from "../common/Header";


const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB max to store in IndexedDB
export default function AddCarBasic() {
  //style for dropzone
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

  const { carData = {}, errors = {} } = useSelector((state) => state.cars); // Extracts carData and errors from the Redux store, defaulting to empty objects if undefined
  const [timeoutId, setTimeoutId] = useState(null); // State variable to store a timeout ID, initialized as null

  const handleError = (errorType, message) => {
    // Updates the Redux store with a new error message for the specified error type
    dispatch(setErrors({ ...errors, [errorType]: message }));
  };

  //State variable to store the uploaded files
  const [files, setFiles] = useState({
    registrationPaper: null,
    certificateOfInspection: null,
    insurance: null,
  });

  //valid tail file extensions
  const allowedExtensions = [".doc", ".docx", ".pdf", ".jpg", ".jpeg", ".png"];

  //function to check input file image
  const handleDrop = (fileType, errorType) => async (acceptedFiles) => {
    handleError(errorType, ""); // Clears any previous error message

    const validFile = acceptedFiles.find((file) => {
      const fileExt = file.name
        .substring(file.name.lastIndexOf(".")) // Extract file extension
        .toLowerCase();
      return allowedExtensions.includes(fileExt); // Check if the extension is allowed
    });

    if (validFile) {
      await saveFileToDB(fileType, validFile); // Save the file to IndexedDB

      setFiles((prev) => ({
        ...prev,
        [fileType]: validFile, // Update state with the selected file
      }));

      dispatch(
        setCarData({
          [fileType]: validFile.name, // Update Redux store with file name
        })
      );
    } else {
      const errorMessage = acceptedFiles.some(
        (file) => file.size > MAX_FILE_SIZE // Check if any file exceeds the max size
      )
        ? "File size must be less than 5MB."
        : "Invalid file type! Only .doc, .docx, .pdf, .jpg, .jpeg, .png are allowed.";
      handleError(errorType, errorMessage); // Set error message
      setFiles((prev) => ({ ...prev, [fileType]: null })); // Remove the file from state
      dispatch(setCarData({ [fileType]: "" })); // Clear the file name in Redux
    }
  };

  //Functions to handle file drop
  const dropzoneRegistration = useDropzone({
    onDrop: handleDrop("registrationPaper", "registrationPaper"),
    multiple: false,
  });

  //Functions to handle file drop
  const dropzoneCertificate = useDropzone({
    onDrop: handleDrop("certificateOfInspection", "certificateOfInspection"),
    multiple: false,
  });

  //Functions to handle file drop
  const dropzoneInsurance = useDropzone({
    onDrop: handleDrop("insurance", "insurance"),
    multiple: false,
  });

  const colors = [
    { label: "White", value: "white" },
    { label: "Black", value: "black" },
    { label: "Gray", value: "gray" },
    { label: "Silver", value: "silver" },
    { label: "Red", value: "red" },
    { label: "Blue", value: "blue" },
    { label: "Brown", value: "brown" },
    { label: "Green", value: "green" },
    { label: "Beige", value: "beige" },
    { label: "Gold", value: "gold" },
    { label: "Yellow", value: "yellow" },
    { label: "Purple", value: "purple" },
  ];

  //State variable to store the filtered models
  const [brandModel, setBrandModel] = useState([]);
  const [brands, setBrands] = useState([]);

  //function to pick data from database
  useEffect(() => {
    axios.get("/database.json").then((res) => {
      const data = res.data.Brand_and_Model; // Extracts the "Brand_and_Model" data from the response
      setBrandModel(data); // Updates state with the fetched brand and model data

      const uniqueBrands = Array.from(
        new Set(data.map((item) => item.Brand)) // Extracts unique brand names
      ).map((brand) => ({ label: brand, value: brand })); // Formats the brands into an array of objects

      setBrands(uniqueBrands); // Updates state with the unique brand list
    });
  }, []); // Runs only once when the component mounts

  //Funtion to filter model
  const filteredModel = useMemo(() => {
    // Filters the brandModel array to get models of the selected brand
    const tmp = brandModel.filter(
      (item) => item.Brand === carData.selectedBrand
    );
    // Extracts unique models and formats them into an array of objects
    return Array.from(new Set(tmp.map((item) => item.Model))).map((model) => ({
      label: model,
      value: model,
    }));
  }, [carData.selectedBrand, brandModel]); // Recomputes only when selectedBrand or brandModel changes

  //Function to retrieve files from IndexedDB
  useEffect(() => {
    const loadFiles = async () => {
      // Retrieve stored files from IndexedDB
      const storedFiles = {
        registrationPaper: await getFileFromDB("registrationPaper"),
        certificateOfInspection: await getFileFromDB("certificateOfInspection"),
        insurance: await getFileFromDB("insurance"),
      };
      // Update state with the retrieved files, defaulting to null if not found
      setFiles({
        registrationPaper: storedFiles.registrationPaper || null,
        certificateOfInspection: storedFiles.certificateOfInspection || null,
        insurance: storedFiles.insurance || null,
      });
      document.title = "Add Car Basic";
    };
    loadFiles(); // Call the async function to load files

    // Lắng nghe sự kiện khi IndexedDB thay đổi
    window.addEventListener("indexedDBUpdated", loadFiles);

    return () => {
      window.removeEventListener("indexedDBUpdated", loadFiles);
    };
  }, []); // Runs only once when the component mounts

  return (
    <>
      <Header></Header>
      <Breadcrumbs sx={{ mx: "auto", maxWidth: "1200px", py: 1, px: 2 }}>
        <Link underline="hover" color="inherit" href="/">
          Home
        </Link>
        <Link underline="hover" color="inherit" href="#/my-cars">
          My Cars
        </Link>
        <Typography color="text.primary">Add Car Basic</Typography>
      </Breadcrumbs>
      <Box sx={{ mx: "auto", maxWidth: "1200px" }}>
        <CarStepper />
        <p style={{ color: "red", p: 4, textAlign: "center" }}>
          Note: Please check your information carefully, you'll not be able to
          change the basic details of your car, which is based on the
          registration information
        </p>
        <Box
          component="form"
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "30px",
            "& .MuiTextField-root": { m: 2, width: "50ch" },
          }}
          noValidate
          autoComplete="off"
        >
          <div className="flex-container">
            {/* filed to input lisence */}
            <TextField
              required
              sx={{
                "& .MuiInputLabel-root": {
                  fontSize: "18px", // Edit the font size here
                  fontWeight: "bold",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "primary.main", // green color when focused
                },
                "& .MuiInputLabel-root.MuiInputLabel-shrink": {
                  color: "primary.main", // green color when shrink
                },
                width: "100%",
              }}
              error={!!errors.licensePlate}
              helperText={
                errors.licensePlate ||
                "Please enter your license plate EX: 49F-123.56"
              }
              id="licensePlate"
              label="License Plate: "
              variant="standard"
              name="licensePlate"
              value={carData.licensePlate}
              onChange={(e) => {
                const value = e.target.value.trim();
                //Checks if the entered value is a valid license plate
                const regex = /^\d{2}[A-Z]-\d{3}\.\d{2}$/;

                dispatch(setCarData({ licensePlate: value }));

                // Delete the previous timeout
                if (timeoutId) clearTimeout(timeoutId);

                // create a new timeout to check after 500ms
                const newTimeoutId = setTimeout(() => {
                  if (value === "") {
                    handleError(e.target.name, "");
                  } else if (!regex.test(value) && value !== "") {
                    handleError(e.target.name, "Invalid license plate format");
                  } else {
                    handleError(e.target.name, "");
                  }
                }, 500);

                setTimeoutId(newTimeoutId);
              }}
              slotProps={{
                input: {
                  style: { color: "black" }, // Grey color
                },
              }}
            />

            {/* filed to input color */}
            <Autocomplete
              options={colors} // List color
              sx={{
                "& .MuiInputLabel-root": {
                  fontSize: "18px", // Edit the font size here
                  fontWeight: "bold",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "primary.main", // green color when focused
                },
                "& .MuiInputLabel-root.MuiInputLabel-shrink": {
                  color: "primary.main", // green color when shrink
                },
              }}
              getOptionLabel={(option) => option.label} // Display label
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Color"
                  id="color"
                  variant="standard"
                  required
                  error={!!errors.color} // if there is an error
                  helperText={errors.color || "Please select your color"} // error message
                  slotProps={{
                    ...params.InputProps,
                    style: { color: "gray" }, // Grey color
                  }}
                />
              )}
              value={
                colors.find((color) => color.value === carData.color) || null
              } // Default value
              onChange={(event, newValue) => {
                const selectedColor = newValue ? newValue.value : "";
                if (carData.color !== selectedColor) {
                  dispatch(setCarData({ color: selectedColor }));
                }

                if (newValue && errors.color) {
                  dispatch(setErrors({ ...errors, color: "" }));
                }
              }}
            />
          </div>

          <div className="flex-container">
            {/* filed to input brand */}
            <Autocomplete
              options={brands}
              sx={{
                "& .MuiInputLabel-root": {
                  fontSize: "18px", // Edit the font size here
                  fontWeight: "bold",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "primary.main", // green color when focused
                },
                "& .MuiInputLabel-root.MuiInputLabel-shrink": {
                  color: "primary.main", //  green color when shrink
                },
              }}
              getOptionLabel={(option) => option.label}
              renderInput={(params) => (
                <TextField
                  {...params}
                  id="brand"
                  label="Brand name: "
                  variant="standard"
                  required
                  error={!!errors.brand}
                  helperText={errors.brand || "Please select your brand name"}
                />
              )}
              value={
                brands.find((brand) => brand.value === carData.brand) || null
              }
              onChange={(event, newValue) => {
                const selectedBrand = newValue?.value || "";
                if (carData.brand !== selectedBrand) {
                  dispatch(
                    setCarData({
                      ...carData,
                      brand: selectedBrand,
                      selectedBrand: selectedBrand,
                      model: "", // Reset model when brand changes
                    })
                  );
                }

                if (newValue && errors.brand) {
                  dispatch(setErrors({ ...errors, brand: "" }));
                }
              }}
            />

            {/* filed to input model */}
            <Autocomplete
              options={filteredModel}
              sx={{
                "& .MuiInputLabel-root": {
                  fontSize: "18px", // Edit the font size here
                  fontWeight: "bold",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "primary.main", // green color when focused
                },
                "& .MuiInputLabel-root.MuiInputLabel-shrink": {
                  color: "primary.main", // green color when shrink
                },
              }}
              getOptionLabel={(option) => option.label} // Display label
              renderInput={(params) => (
                <TextField
                  {...params}
                  id="model"
                  label="Model: "
                  variant="standard"
                  required
                  error={!!errors.model} // IF there is an error
                  helperText={
                    errors.model || "Please select your brand name before"
                  } // Display error
                />
              )}
              value={
                filteredModel.find((model) => model.value === carData.model) ||
                null
              } // Default value
              onChange={(event, newValue) => {
                const selectedModel = newValue?.value || "";

                if (carData.model !== selectedModel) {
                  dispatch(setCarData({ ...carData, model: selectedModel }));
                }

                dispatch(
                  setErrors({
                    ...errors,
                    model: newValue ? "" : "Please select your model",
                  })
                );
              }}
              disabled={!carData.brand} // Prevent model selection if no brand is selected
            />
          </div>

          <div className="flex-container">
            {/* filed to input production of year */}
            <TextField
              required
              sx={{
                "& .MuiInputLabel-root": {
                  fontSize: "18px", // Edit the font size here
                  fontWeight: "bold",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "primary.main", // green color when focused
                },
                "& .MuiInputLabel-root.MuiInputLabel-shrink": {
                  color: "primary.main", // green color when shrink
                },
              }}
              error={!!errors.productionYear}
              helperText={
                errors.productionYear ||
                "Please enter production year from 1990 to 2030"
              }
              id="year"
              label="Production Year: "
              variant="standard"
              name="productionYear"
              value={carData.productionYear}
              type="number"
              onKeyDown={(e) => {
                if (["e", "E", "+", "-"].includes(e.key)) {
                  e.preventDefault(); // Prevent e, E, +, -
                }
              }}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, ""); // just numbers
                const number = parseInt(value, 10); // convert to number

                if (value === "") {
                  handleError(e.target.name, ""); //
                } else if (!isNaN(number) && (number < 1990 || number > 2030)) {
                  handleError(e.target.name, "Please input from 1990 to 2030");
                } else {
                  handleError(e.target.name, "");
                }

                dispatch(setCarData({ productionYear: value }));
              }}
              slotProps={{
                input: {
                  style: { color: "black" }, // Black
                },
              }}
            />

            <TextField
              required
              sx={{
                "& .MuiInputLabel-root": {
                  fontSize: "18px", // Edit the font size here
                  fontWeight: "bold",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "primary.main", // green color when focused
                },
                "& .MuiInputLabel-root.MuiInputLabel-shrink": {
                  color: "primary.main", // green color when shrink
                },
              }}
              error={!!errors.numberOfSeats}
              helperText={
                errors.numberOfSeats || "Please enter 4, 5, or 7 seats"
              }
              id="seats"
              label="Number of Seats: "
              variant="standard"
              name="numberOfSeats"
              value={carData.numberOfSeats}
              type="number"
              onKeyDown={(e) => {
                if (["e", "E", "+", "-"].includes(e.key)) {
                  e.preventDefault(); // Prevent e, E, +, -
                }
              }}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, ""); // just numbers
                const number = parseInt(value, 10); // convert to number

                if (value === "") {
                  handleError(e.target.name, ""); // clear error
                } else if (!isNaN(number) && [4, 5, 7].includes(number)) {
                  handleError(e.target.name, ""); // clear error
                } else {
                  handleError(
                    e.target.name,
                    "Only 4, 5, or 7 seats are allowed"
                  );
                }

                if (carData.numberOfSeats !== number) {
                  dispatch(
                    setCarData({ numberOfSeats: isNaN(number) ? "" : number })
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

          <div style={{ display: "flex", gap: "130px", marginTop: "20px" }}>
            <div style={{ position: "relative", left: "-260px" }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "18px",
                    color: "rgb(25, 118, 210)",
                  }}
                >
                  Transmission:
                </Typography>
                <Typography variant="subtitle1" sx={{ color: "red", ml: 0.5 }}>
                  *
                </Typography>
              </Box>
              <ToggleButtonGroup
                sx={{ justifyContent: "center", flexWrap: "wrap" }}
                color="primary"
                exclusive
                aria-label="Transmission"
                value={carData.automatic ? "automatic" : "manual"}
                onChange={() => {
                  dispatch(toggleProperty("automatic")); // Just toggle
                  dispatch(
                    setCarData({ ...carData, automatic: !carData.automatic })
                  );
                }}
              >
                <ToggleButton value="automatic">Automatic</ToggleButton>
                <ToggleButton value="manual">Manual</ToggleButton>
              </ToggleButtonGroup>
            </div>

            <div style={{ position: "relative", left: "-10px" }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "18px",
                    color: "rgb(25, 118, 210)",
                  }}
                >
                  Fuel:
                </Typography>
                <Typography variant="subtitle1" sx={{ color: "red", ml: 0.5 }}>
                  *
                </Typography>
              </Box>
              <ToggleButtonGroup
                sx={{ justifyContent: "center", flexWrap: "wrap" }}
                color="primary"
                value={carData.gasoline ? "gasoline" : "diesel"}
                exclusive
                aria-label="Platform"
                onChange={(event, value) => {
                  dispatch(toggleProperty("gasoline"));
                  dispatch(
                    setCarData({ ...carData, gasoline: !carData.gasoline })
                  );
                }}
              >
                <ToggleButton value="gasoline">Gasoline</ToggleButton>
                <ToggleButton value="diesel">Diesel</ToggleButton>
              </ToggleButtonGroup>
            </div>
          </div>
        </Box>
        <Typography
          variant="h6"
          style={{ marginBottom: "30px", fontWeight: "bold" }}
        >
          Documents
        </Typography>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            {/* Registration paper */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: "bold",
                  fontSize: "18px",
                  color: files.registrationPaper
                    ? "rgb(25, 118, 210)"
                    : "rgba(0, 0, 0, 0.6)",
                }}
              >
                Registration paper:
              </Typography>
              <Typography variant="subtitle1" sx={{ color: "red", ml: 0.5 }}>
                *
              </Typography>
            </Box>

            <Box {...dropzoneRegistration.getRootProps()} sx={styles}>
              <input
                {...dropzoneRegistration.getInputProps()}
                id="registrationPaper"
              />
              {/* Hidden input field for file selection, controlled by Dropzone */}
              <CloudUploadIcon sx={{ fontSize: 40, color: "#555" }} />
              {/* Upload icon with custom size and color */}
              <Typography variant="body2" sx={{ mt: 1 }}>
                Drag and drop OR
              </Typography>
              {/* Instructional text for file upload */}
              <Link component="button" variant="body2" sx={{ color: "blue" }}>
                Select file
              </Link>
              {/* Button-like link to manually select a file */}
            </Box>
            {errors.registrationPaper && (
              <Alert severity="error" id="registrationPaperError">
                {errors.registrationPaper}
              </Alert>
            )}
            {files.registrationPaper && (
              <Typography sx={{ fontWeight: "bold" }}>
                Selected file: {files.registrationPaper?.name}
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
                  color: files.certificateOfInspection
                    ? "rgb(25, 118, 210)"
                    : "rgba(0, 0, 0, 0.6)",
                }}
              >
                Certificate of inspection:
              </Typography>
              <Typography variant="subtitle1" sx={{ color: "red", ml: 0.5 }}>
                *
              </Typography>
            </Box>
            <Box {...dropzoneCertificate.getRootProps()} sx={styles}>
              <input
                {...dropzoneCertificate.getInputProps()}
                id="certificateOfInspection"
              />
              <CloudUploadIcon sx={{ fontSize: 40, color: "#555" }} />
              <Typography variant="body2" sx={{ mt: 1 }}>
                Drag and drop OR
              </Typography>
              <Link component="button" variant="body2" sx={{ color: "blue" }}>
                Select file
              </Link>
            </Box>
            {errors.certificateOfInspection && (
              <Alert severity="error" id="certificateOfInspectionError">
                {errors.certificateOfInspection}
              </Alert>
            )}
            {files.certificateOfInspection && (
              <Typography sx={{ fontWeight: "bold" }}>
                Selected file: {files.certificateOfInspection?.name}
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
                  color: files.insurance
                    ? "rgb(25, 118, 210)"
                    : "rgba(0, 0, 0, 0.6)",
                }}
              >
                Insurance:
              </Typography>
              <Typography variant="subtitle1" sx={{ color: "red", ml: 0.5 }}>
                *
              </Typography>
            </Box>
            <Box {...dropzoneInsurance.getRootProps()} sx={styles}>
              <input {...dropzoneInsurance.getInputProps()} id="insurance" />
              <CloudUploadIcon sx={{ fontSize: 40, color: "#555" }} />
              <Typography variant="body2" sx={{ mt: 1 }}>
                Drag and drop OR
              </Typography>
              <Link component="button" variant="body2" sx={{ color: "blue" }}>
                Select file
              </Link>
            </Box>
            {errors.insurance && (
              <Alert severity="error" id="insuranceError">
                {errors.insurance}
              </Alert>
            )}
            {files.insurance && (
              <Typography sx={{ fontWeight: "bold" }}>
                Selected file: {files.insurance?.name}
              </Typography>
            )}
          </div>
        </div>

        <p style={{ marginTop: "30px" }}>
          File type: doc, .docx, .pdf, .jpg, .jpeg, .png
        </p>

        <Box mt={2} style={{ textAlign: "center" }}>
          <Button
            variant="contained"
            id="cancel"
            onClick={() => {
              navigate("/");
            }}
            sx={{ ml: 2, mt: 5, mb: 2 }}
            style={{ backgroundColor: "red" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            id="nextButton"
            onClick={() => {
              dispatch(handleNext());

              setTimeout(() => {
                if (Object.keys(store.getState().cars.errors).length === 0) {
                  navigate("/add-car-details");
                }
              }, 0); // wait for the dispatch to finish
            }}
            sx={{ ml: 2, mt: 5, mb: 2 }}
            style={{ backgroundColor: "#00bfa5" }}
          >
            Next
          </Button>
        </Box>
      </Box>
      <Footer />
    </>
  );
}
