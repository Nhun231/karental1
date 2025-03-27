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
  FormGroup,
  FormControlLabel,
  Checkbox,
  Link,
  Autocomplete,
} from "@mui/material";
import {
  setFetchedCarData,
  setErrors,
  setCar,
  toggleUse,
  checkErrors,
} from "../../reducers/carFetchReducer";
import { store } from "../../redux/store";
import { useEffect, useRef, useState } from "react";
import { Skeleton } from "@mui/material";
import { updateCar } from "../../reducers/carFetchReducer";

export default function EditCarPricing() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const hasUpdatedTerms = useRef(false);
  const [loading, setLoading] = useState(false);

  //get data from repository
  const { carData = {}, errors = {} } = useSelector((state) => state.carFetch);

  //function edit name error
  const handleError = (errorType, message) => {
    dispatch(setErrors({ ...errors, [errorType]: message }));
  };

  //function edit value in repository
  const handleChange = (event) => {
    dispatch(toggleUse(event.target.name));
  };

  //function post data into repository
  useEffect(() => {
    if (!carData?.data || hasUpdatedTerms.current) return; // just run when have data

    hasUpdatedTerms.current = true; // signal ran

    const additionalTerms = carData.data.termOfUse || "";
    const termsArray = additionalTerms.split(",").map((term) => term.trim());

    // filter key valid in `carData.termsOfUses`
    const validTerms = termsArray.filter(
      (term) => term in (carData.termsOfUses || {})
    );
    const invalidTerms = termsArray.filter(
      (term) => !(term in (carData.termsOfUses || {}))
    );

    // update state `carData.termsOfUses`
    dispatch(
      setFetchedCarData({
        ...carData,
        termsOfUses: {
          ...(carData.termsOfUses || {}),
          ...Object.fromEntries(validTerms.map((term) => [term, true])),
        },
        ...(invalidTerms.length > 0 && {
          specify: invalidTerms[0],
          termsOfOther: true,
        }),
      })
    );
  }, [carData?.data]);

  //function update terms Of Uses in repository
  useEffect(() => {
    if (!carData?.termsOfUses) return; // avoid error if `termsOfUses` not yet have data
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

    // avoid update Redux if `termOfUse` not change
    if (carData.data?.termOfUse !== updatedTerm) {
      dispatch(setCar({ ...carData.data, termOfUse: updatedTerm }));
    }
  }, [carData.termsOfUses, carData.specify, carData.termsOfOther, dispatch]);

  return (
    <>
      {carData.data ? (
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
                  paddingTop: "50px",
                  color: "rgba(0, 0, 0, 0.6)",
                  fontWeight: "bold",
                }}
              >
                Required deposit:{" "}
              </Typography>
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
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
                  carData?.data?.basePrice
                    ? new Intl.NumberFormat("de-DE").format(
                        carData.data.basePrice
                      )
                    : ""
                }
                onKeyDown={(e) => {
                  if (["e", "E", "+", "-"].includes(e.key)) {
                    e.preventDefault(); // Chặn nhập e, E, +, -
                  }
                }}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, ""); // Chỉ cho phép số
                  const rawValue = value.replace(/\./g, ""); // Xóa dấu chấm khi nhập
                  if (/^\d*$/.test(rawValue)) {
                    if (errors.basePrice) {
                      handleError("basePrice", ""); // Xóa lỗi nếu có
                    }
                  }
                  if (e.target.value === "" && !errors.basePrice) {
                    handleError("basePrice", "Please enter basePrice");
                    dispatch(
                      setErrors({
                        ...errors,
                        basePrice: "Please enter basePrice",
                      })
                    );
                  }
                  if (carData.data.basePrice !== rawValue) {
                    dispatch(setCar({ ...carData.data, basePrice: rawValue }));
                  }
                }}
                slotProps={{
                  input: {
                    style: { color: "red" }, // Màu xám nhạt cho giá trị mặc định
                  },
                }}
              />

              <TextField
                required
                sx={{
                  "& .MuiInputLabel-root": {
                    fontSize: "18px", // edit font size
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
                  carData?.data?.deposit
                    ? new Intl.NumberFormat("de-DE").format(
                        carData.data.deposit
                      )
                    : ""
                }
                onKeyDown={(e) => {
                  if (["e", "E", "+", "-"].includes(e.key)) {
                    e.preventDefault(); // Chặn nhập e, E, +, -
                  }
                }}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, ""); // Chỉ cho phép số
                  const rawValue = value.replace(/\./g, ""); // Xóa dấu chấm khi nhập
                  if (/^\d*$/.test(rawValue)) {
                    // Chỉ cho phép nhập số
                    if (errors.deposit) {
                      handleError("deposit", ""); // Xóa lỗi nếu có
                    }
                  }
                  if (e.target.value === "" && !errors.deposit) {
                    handleError("deposit", "Please enter deposit");
                    dispatch(
                      setErrors({ ...errors, deposit: "Please enter deposit" })
                    );
                  }
                  if (carData.data.deposit !== rawValue) {
                    dispatch(setCar({ ...carData.data, deposit: rawValue }));
                  }
                }}
                slotProps={{
                  input: {
                    style: { color: "red" }, // Màu xám nhạt cho giá trị mặc định
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
                    checked={carData?.termsOfUses?.noSmoking}
                    onChange={handleChange}
                    name="noSmoking"
                  />
                }
                label={<>No smoking</>}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={carData?.termsOfUses?.noPet}
                    onChange={handleChange}
                    name="noPet"
                  />
                }
                label={<>No pet</>}
              />
            </FormGroup>

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
                    checked={carData?.termsOfUses?.noFoodInCar}
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
                    checked={carData?.termsOfOther}
                    onChange={(e) => {
                      dispatch(
                        setFetchedCarData({
                          termsOfOther: !carData.termsOfOther,
                        })
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
            disabled={!carData?.termsOfOther}
            value={carData?.specify || ""}
            error={!!errors.specify}
            helperText={errors.specify || "Please enter your terms you want"}
            onChange={(e) => {
              const newValue = e.target.value;
              if (carData.data.specify !== newValue) {
                dispatch(setFetchedCarData({ ...carData, specify: newValue }));
              }
              if (errors.specify) {
                dispatch(setErrors({ ...errors, specify: "" }));
              }
              if (e.target.value === "" && !errors.specify) {
                handleError("specify", "Please enter specify");
                dispatch(
                  setErrors({ ...errors, specify: "Please enter specify" })
                );
              }
            }}
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
            rows={4}
            sx={{
              "& .MuiInputLabel-root": {
                fontSize: "18px", // edit font size
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
          <Button
            variant="contained"
            id="nextButton1"
            sx={{ ml: 2 }}
            style={{ backgroundColor: "#00bfa5" }}
            onClick={async () => {
              dispatch(checkErrors());
              setTimeout(async () => {
                if (
                  Object.keys(store.getState().carFetch.errors).length === 0
                ) {
                  setLoading(true); // turn pn loading

                  try {
                    await dispatch(updateCar()).unwrap(); // 🟢 Đợi API hoàn thành
                  } finally {
                    setLoading(false); // 🔥 Tắt loading dù thành công hay thất bại
                  }
                }
              }, 0);
            }}
          >
            {loading ? "Saving..." : "Save"} {/* 🔥 Thay đổi nội dung nút */}
          </Button>
        </Box>
      ) : (
        <Skeleton variant="rectangular" width={400} height={300} />
      )}
    </>
  );
}
