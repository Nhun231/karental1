import * as React from "react";
import TextField from "@mui/material/TextField";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Box,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import {
  setCarData,
  setErrors,
  setStep,
  handleNext,
  toggleUse,
} from "../../reducers/carReducer";
import { store } from "../../redux/store";
import CarStepper from "./CarStepper";
import { useEffect } from "react";
import Header from "../common/Header";
import Footer from "../common/Footer";
import NavigateBreadcrumb from "../common/NavigateBreadcrumb";

export default function AddCarFinish() {
  const dispatch = useDispatch(); // Retrieves the Redux dispatch function to send actions to the store
  const navigate = useNavigate(); // Gets the navigation function from React Router for programmatic navigation

  const {
    carData = {},
    errors = {},
    step,
  } = useSelector((state) => state.cars); // Extracts carData and errors from the Redux store, defaulting to empty objects if undefined

  // Function to handle checkbox changes
  const handleChange = (event) => {
    dispatch(toggleUse(event.target.name));
  };

  useEffect(() => {
    // Get selected terms of use as a comma-separated string
    const selectedTerm = Object.keys(carData.termsOfUses) // Filter out unchecked terms
      .filter((key) => carData.termsOfUses[key])
      .join(", "); // Join selected terms into a single string

    let updatedTerm = selectedTerm;

    if (carData.termsOfOther && carData.specify) {
      // If "termsOfOther" is selected and "specify" has a value,
      // append "specify" to the selected terms (if any)
      updatedTerm = selectedTerm
        ? `${selectedTerm}, ${carData.specify}`
        : carData.specify;
    }

    dispatch(setCarData({ termOfUse: updatedTerm })); // Update Redux store with the final terms of use
  }, [carData.termsOfUses, carData.specify, carData.termsOfOther, dispatch]);
  // Re-run effect when termsOfUses, specify, termsOfOther, or dispatch changes

  return (
    <>
      <Header />
      <Box sx={{ mx: "auto", maxWidth: "1200px" }}>
        <NavigateBreadcrumb />
      </Box>
      <Box sx={{ mx: "auto", maxWidth: "1200px" }}>
        <CarStepper />
        <Box
          component="form"
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
          <div style={{ display: "flex", gap: "100px" }}>
            <div>
              <Typography
                variant="h6"
                style={{
                  paddingTop: "30px",
                  color: "rgba(0, 0, 0, 0.6)",
                  fontWeight: "bold",
                }}
              >
                Set base price for your car:{" "}
              </Typography>

              <Typography
                variant="h6"
                style={{
                  paddingTop: "70px",
                  color: "rgba(0, 0, 0, 0.6)",
                  fontWeight: "bold",
                }}
              >
                Required deposit:{" "}
              </Typography>
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              {/* filed input base price */}
              <TextField
                required
                sx={{
                  "& .MuiInputLabel-root": {
                    fontSize: "18px",
                    fontWeight: "bold",
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "primary.main", // Blue when focus
                  },
                  "& .MuiInputLabel-root.MuiInputLabel-shrink": {
                    color: "primary.main", // Blue when have value
                  },
                }}
                type="text"
                error={!!errors.basePrice}
                helperText={
                  errors.basePrice || "Please enter your basePrice (VND/Day)"
                }
                id="basePrice"
                label="VND/Day "
                variant="standard"
                name="basePrice"
                value={
                  carData.basePrice
                    ? new Intl.NumberFormat("en-US").format(carData.basePrice)
                    : ""
                }
                onKeyDown={(e) => {
                  if (["e", "E", "+", "-"].includes(e.key)) {
                    e.preventDefault(); // Prevent default behavior for e, E, +, -
                  }
                }}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, ""); // just numbers
                  const rawValue = value.replace(/\,/g, ""); // remove dots
                  if (/^\d*$/.test(rawValue)) {
                    // just numbers
                    dispatch(setCarData({ basePrice: rawValue }));
                  }
                  if (e.target.value === "" || e.target.value > 0) {
                    dispatch(setErrors({ ...errors, basePrice: "" }));
                  }
                }}
                slotProps={{
                  input: {
                    style: { color: "red" },
                  },
                }}
              />

              {/* filed input deposit */}
              <TextField
                required
                sx={{
                  "& .MuiInputLabel-root": {
                    fontSize: "18px",
                    fontWeight: "bold",
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "primary.main", // Blue when focus
                  },
                  "& .MuiInputLabel-root.MuiInputLabel-shrink": {
                    color: "primary.main", // Blue when have value
                  },
                }}
                error={!!errors.deposit}
                helperText={
                  errors.deposit || "Please enter your requiredDeposit (VND)"
                }
                id="deposit"
                label="VND "
                variant="standard"
                name="deposit"
                value={
                  carData.deposit
                    ? new Intl.NumberFormat("en-US").format(carData.deposit)
                    : ""
                }
                onKeyDown={(e) => {
                  if (["e", "E", "+", "-"].includes(e.key)) {
                    e.preventDefault(); // Prevent default behavior for e, E, +, -
                  }
                }}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, ""); // just numbers
                  const rawValue = value.replace(/\,/g, ""); // remove dots
                  if (/^\d*$/.test(rawValue)) {
                    // just numbers
                    dispatch(setCarData({ deposit: rawValue }));
                  }
                  if (e.target.value === "" || e.target.value > 0) {
                    dispatch(setErrors({ ...errors, deposit: "" }));
                  }
                }}
                slotProps={{
                  input: {
                    style: { color: "red" }, // grey
                  },
                }}
              />
            </div>
          </div>

          <div
            style={{
              position: "relative",
              right: "340px",
              color: "rgba(0, 0, 0, 0.6)",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Terms of use:
            </Typography>
          </div>

          <Box display="flex" gap={15}>
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
                    checked={carData.termsOfUses.noSmoking}
                    onChange={handleChange}
                    name="noSmoking"
                  />
                }
                label={<>No smoking</>}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={carData.termsOfUses.noPet}
                    onChange={handleChange}
                    name="noPet"
                  />
                }
                label={<>No pet</>}
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
                    checked={carData.termsOfUses.noFoodInCar}
                    onChange={handleChange}
                    name="noFoodInCar"
                  />
                }
                label={<>No food in car</>}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    id="other"
                    checked={carData.termsOfOther}
                    onChange={(e) => {
                      dispatch(
                        setCarData({ termsOfOther: !carData.termsOfOther })
                      );
                    }}
                    name="other"
                  />
                }
                label={<>Other</>}
              />
            </FormGroup>
          </Box>

          <TextField
            id="specify"
            placeholder="Description of your vehicle"
            label="Please specify:"
            multiline
            required
            name="description"
            disabled={!carData.termsOfOther}
            value={carData.specify}
            error={!!errors.specify}
            helperText={errors.specify || "Please enter your terms you want"}
            onChange={(e) => {
              dispatch(setCarData({ specify: e.target.value }));
              dispatch(setErrors({ ...errors, specify: "" }));
            }}
            rows={4}
            sx={{
              "& .MuiInputLabel-root": {
                fontSize: "18px",
                fontWeight: "bold",
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "primary.main", // Blue when focus
              },
              "& .MuiInputLabel-root.MuiInputLabel-shrink": {
                color: "primary.main", // Blue when have value
              },
            }}
            variant="standard"
            style={{ backgroundColor: "white" }}
          />

          <Box mt={2} style={{ textAlign: "center" }}>
            {/* Button Back */}
            {step >= 1 && (
              <Button
                variant="contained"
                onClick={() => {
                  if (step !== 1) {
                    dispatch(setStep(step - 1));
                  }
                  navigate("/add-car-details");
                }}
                sx={{ mr: 2 }}
                style={{ backgroundColor: "#05ce80" }}
              >
                Back
              </Button>
            )}

            {/* Button Next */}
            {step >= 3 && (
              <Button
                variant="contained"
                id="nextButton"
                onClick={() => {
                  dispatch(handleNext());

                  setTimeout(() => {
                    if (
                      Object.keys(store.getState().cars.errors).length === 0
                    ) {
                      navigate("/add-car-finish");
                    }
                  }, 0); // wait Redux finish
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
