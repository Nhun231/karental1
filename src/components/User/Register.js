import * as Mui from "@mui/material";
import * as Icons from "@mui/icons-material";
import React, { useState } from "react";
import normalForm from "../../styles/FormStyles.js";
import Checkbox from "@mui/material/Checkbox";
import { checkUniqueEmail, registerUser } from "../../services/UserServices";
import NotificationSnackbar from "../common/NotificationSnackbar";
const Register = ({ isCarOwner }) => {
  const [alert, setAlert] = useState({ open: false, message: "", severity: "success" });
  // Handle form input
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    isCustomer: isCarOwner ? "false" : "",
    terms: "",
  });
  console.log(formData.isCustomer)
  // List of errors
  const [errors, setErrors] = useState({});
  //handle change in inputs, validate after change
  const handleChange = async (e) => {
    const { name, value, type, checked } = e.target;
    // Handle checkbox separately
    const newValue = type === "checkbox" ? checked : value;
    setFormData({
      ...formData,
      [name]: newValue,
    });
    if (name === "email") {
      let errMsg = "";

      // Step 1: Validate Email Format First
      if (!/\S+@\S+\.\S+/.test(value)) {
        errMsg = "Invalid email format";
      } else {
        // Step 2: Check Email Uniqueness from Backend
        try {
          const response = await checkUniqueEmail({ email: value });
          if (response?.code === 2003) {
            errMsg = response.message; // Set error if email is taken
          }
        } catch (error) {
          console.error("Email check failed", error);
        }
      }

      // Step 3: Ensure the Error Persists
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: errMsg,
      }));
      return;
    }

    validateInputs(e.target.name, e.target.value);
  };
  //validate for each field
  const validateInputs = (name, value) => {
    let errMsg = "";
    if (!value) {
      errMsg = "This field is required";
    } else {
      switch (name) {
        case "fullName":
          break;
        case "email":
          //___@___.com format
          errMsg = !/\S+@\S+\.\S+/.test(value) ? "Invalid email format" : "";
          break;
        case "phoneNumber":
          // 10 digits
          errMsg = !/^0\d{9}$/.test(value) ? "Phone must be 10 digits" : "";
          break;
        case "password":
          // 1 letter, 1 digit and 7 character
          errMsg = !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{9,}$/.test(value)
            ? "Invalid password format"
            : "";
          break;
        case "confirmPassword":
          errMsg =
            value !== formData.password
              ? "Password and Confirm password don’t match. Please try again."
              : "";
          break;
        default:
          break;
      }
    }
    setErrors((prevs) => ({
      ...prevs,
      [name]: errMsg,
    }));
  };
  // state for showing password or not
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  //Handle default event (in this situation: "loose focus when click to button")
  const handleMouseUp = (event) => {
    event.preventDefault();
  };
  const handleMouseDown = (event) => {
    event.preventDefault();
  };
  //Handle submit, contact with BE
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate all required fields
    const hasEmptyField = Object.keys(formData).some((key) => {
      if (!formData[key]) {
        setErrors((prevs) => ({
          ...prevs,
          [key]: "This field is required",
        }));
        setAlert({ open: true, message: "All fields are required.", severity: "error" });
        return true; // Stops iteration
      }
      return false;
    });

    if (hasEmptyField) return; // Prevent further execution
  //   // Validate Terms & Conditions checkbox
  // if (!formData.terms) {
  //   setAlert({ open: true, message: "You must accept terms and conditions", severity: "error" });
  //   return;
  // }
    //If there's still error of wrong confirm password(which is not handle in backend"), display alert
    if(formData.password!==formData.confirmPassword){
      setAlert({ open: true, message: "Password not match", severity: "error" });
      return;
    }
    try {
      const response = await registerUser(formData);
      setAlert({ open: true, message: response.message, severity: "error" });
      // Handle email confirmation prompt if (response) {
      //   if (window.confirm(`${response.message}. Do you want us to resend the email?`)) {
      //     // Call resend email function here
      //     console.log("Resend email triggered");
      //   }
    } catch (error) {
      setAlert({ open: true, message:`${error.message || "Registration failed"}`, severity: "error" });
    }
  };
  return (
    <>
      <Mui.Box component="form" sx={normalForm}>
        <Mui.Typography
          variant="h5"
          textAlign={"center"}
          sx={{ color: "#05ce80" }}
        >
          NOT A MEMBER YET?
        </Mui.Typography>
        <Mui.Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            alignItems: "start",
          }}
        >
          <Mui.TextField
            id="register-fullName"
            name="fullName"
            variant="standard"
            label="Your name"
            error={!!errors.fullName}
            helperText={errors.fullName}
            value={formData.fullName}
            onChange={handleChange}
            fullWidth
            required
          />
          <Mui.TextField
            id="register-email"
            name="email"
            variant="standard"
            label="Your email address"
            error={!!errors.email}
            helperText={errors.email}
            value={formData.email}
            onChange={handleChange}
            fullWidth
            required
          />
          <Mui.TextField
            id="register-phoneNumber"
            name="phoneNumber"
            variant="standard"
            label="Your phone number"
            error={!!errors.phoneNumber}
            helperText={errors.phoneNumber}
            value={formData.phoneNumber}
            onChange={handleChange}
            fullWidth
            required
          />
          <Mui.TextField
            id="register-password"
            name="password"
            variant="standard"
            label="Pick a password"
            error={!!errors.password}
            helperText={errors.password}
            value={formData.password}
            onChange={handleChange}
            type={showPassword ? "text" : "password"}
            fullWidth
            required
            InputProps={{
              endAdornment: (
                <Mui.InputAdornment position="end">
                  <Mui.IconButton
                    onClick={handleClickShowPassword}
                    onMouseUp={handleMouseUp}
                    onMouseDown={handleMouseDown}
                  >
                    {showPassword ? (
                      <Icons.VisibilityOff />
                    ) : (
                      <Icons.Visibility />
                    )}
                  </Mui.IconButton>
                </Mui.InputAdornment>
              ),
            }}
          />
          <Mui.FormHelperText id="outlined-weight-helper-text">
            Use at least one letter, one number, and seven characters
          </Mui.FormHelperText>
          <Mui.TextField
            id="register-confirmPassword"
            name="confirmPassword"
            variant="standard"
            label="Confirm password"
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            value={formData.confirmPassword}
            onChange={handleChange}
            fullWidth
            type={showPassword ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <Mui.InputAdornment>
                  <Mui.IconButton
                    onClick={handleClickShowPassword}
                    onMouseUp={handleMouseUp}
                    onMouseDown={handleMouseDown}
                  >
                    {showPassword ? (
                      <Icons.VisibilityOff />
                    ) : (
                      <Icons.Visibility />
                    )}
                  </Mui.IconButton>
                </Mui.InputAdornment>
              ),
            }}
          />
          <Mui.FormControl component="fieldset" error={!!errors.isCustomer}>
            <Mui.RadioGroup
              id="register-isCustomer"
              row
              name="isCustomer"
              value={formData.isCustomer}
              sx={{ display: "flex", justifyContent: "stretch" }}
              onChange={handleChange}
            >
              <Mui.FormControlLabel
                id="register-isCustomer-true"
                value="true"
                label="I want to rent a car"
                control={<Mui.Radio />}
              />
              <Mui.FormControlLabel
                id="register-isCustomer-false"
                value="false"
                label="I am a car owner"
                control={<Mui.Radio />}
                sx={{ ml: 5 }}
              />
            </Mui.RadioGroup>
            {errors.isCustomer && (
              <Mui.FormHelperText>{errors.isCustomer}</Mui.FormHelperText>
            )}
          </Mui.FormControl>

          <Mui.FormControl component="fieldset" error={!!errors.terms}>
            <Mui.FormControlLabel
              id="register-terms"
              control={<Checkbox />}
              name="terms"
              checked={formData.terms}
              onChange={handleChange}
              label={
                <>
                  I have read and agree with the{" "}
                  <Mui.Link href="#">Terms and Conditions</Mui.Link>
                </>
              }
            />
            {errors.terms && (
              <Mui.FormHelperText>{errors.terms}</Mui.FormHelperText>
            )}
          </Mui.FormControl>

          <Mui.Box
            sx={{ display: "flex", justifyContent: "center", width: "100%" }}
          >
            <Mui.Button
              id="register-submit"
              onClick={handleSubmit}
              variant="outlined"
              sx={{
                width: "150px",
                borderRadius: 2,
                borderColor: "black",
                color: "black",
                fontWeight: 500,
                textTransform: "none",
                transition: "all 0.3s",
                "&:hover": {
                  borderColor: "#05ce80",
                  color: "#05ce80",
                },
              }}
            >
              REGISTER
            </Mui.Button>
          </Mui.Box>
        </Mui.Box>
      </Mui.Box>
      <NotificationSnackbar  alert={alert} onClose={() => setAlert({ ...alert, open: false })} />
    </>
  );
};

export default Register;
