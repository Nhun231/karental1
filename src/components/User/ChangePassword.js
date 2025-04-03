import { useState, useEffect } from "react";
import { Box, Button, Typography, Grid } from "@mui/material";
import PasswordInput from "../common/PasswordInput";
import ConfirmationDialog from "../common/ConfirmationDialog";
import NotificationSnackbar from "../common/NotificationSnackbar";
import { updateUserPassword } from "../../services/UserServices";

export default function SecurityChangePassword() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openChangeConfirm, setOpenChangeConfirm] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: "", severity: "success" });
  const [formValid, setFormValid] = useState({
    currentPassword: true,
    newPassword: true,
    confirmPassword: true,
  });
  const [formErrors, setFormErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [touched, setTouched] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const handleBlur = (e) => {
    setTouched({ ...touched, [e.target.name]: true });
    validateField(e.target.name, formData[e.target.name]);
  };



  const validateField = (name, value) => {
    let error = "";

    if (value.trim() === "") {
      error = `* ${name === "currentPassword" ? "Current" : name === "newPassword" ? "New" : "Confirm"} password is required.`;
    } else {
      const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{9,}$/;
    if (name === "currentPassword" || name === "newPassword") {
      if (!passwordRegex.test(value)) {
          error = `* ${name === "currentPassword" ? "Current" : "New"} password must be at least 9 characters long and include at least one number.`;
      }
    }

    if (name === "confirmPassword" && value !== formData.newPassword) {
        error = "* New password and confirm password must match.";
      }
    }

    setFormValid((prevState) => ({
      ...prevState,
      [name]: !error,
    }));

    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setTouched((prevTouched) => ({ ...prevTouched, [name]: true }));
    validateField(name, value);
  };

  useEffect(() => {
    Object.keys(formData).forEach((field) => {
      validateField(field, formData[field]);
    });
  }, [formData]);

  const handleSubmit = () => {
    if (Object.values(formValid).every((valid) => valid)) {
      setOpenChangeConfirm(true);
    } else {
      console.log('Form validation errors:', formErrors);
      setAlert({ open: true, message: "Password validation failed. Please check your inputs.", severity: "error" });
    }
  };

  const handleChangePasswordConfirm = async () => {
    try {
      const response = await updateUserPassword(formData);
      setAlert({ open: true, message: "Password changed successfully!", severity: "success" });
      // Reset form data, errors, and touched states
      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setFormValid({
        currentPassword: true,
        newPassword: true,
        confirmPassword: true,
      });
      setFormErrors({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTouched({
        currentPassword: false,
        newPassword: false,
        confirmPassword: false,
      });

      setOpenChangeConfirm(false);

      console.log("Password successfully changed", response);
    } catch (error) {
      setAlert({ open: true, message: error.response?.data?.message || "Password update failed. Please check your inputs.", severity: "error" });
      setOpenChangeConfirm(false);
    }
  };

  const handleDiscard = () => {
    setOpenConfirm(true);
  };

  const confirmDiscard = () => {
    setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setOpenConfirm(false);
  };

  const cancelDiscard = () => {
    setOpenConfirm(false);
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prevState) => ({ ...prevState, [field]: !prevState[field] }));
  };

  return (
    <Box sx={{ p: 4, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>
        Change Password
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Grid item xs={12}>
            <PasswordInput
              label="Old Password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              showPassword={showPassword.currentPassword}
              onTogglePassword={togglePasswordVisibility}
              error={touched.currentPassword && !formValid.currentPassword}
              helperText={touched.currentPassword ? formErrors.currentPassword : ""}
            />
          </Grid>
          <Grid item xs={12}>
            <PasswordInput
              label="New Password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              showPassword={showPassword.newPassword}
              onTogglePassword={togglePasswordVisibility}
              error={touched.newPassword && !formValid.newPassword}
              helperText={touched.newPassword ? formErrors.newPassword : ""}
            />
          </Grid>
          <Grid item xs={12}>
            <PasswordInput
              label="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              showPassword={showPassword.confirmPassword}
              onTogglePassword={togglePasswordVisibility}
              error={touched.confirmPassword && !formValid.confirmPassword}
              helperText={touched.confirmPassword ? formErrors.confirmPassword : ""}
            />
          </Grid>
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
        <Button variant="outlined" onClick={handleDiscard}>Discard</Button>
        <Button id="change-password" onClick={handleSubmit} variant="contained" sx={{ backgroundColor: "#05ce80", color: "white", "&:hover": { backgroundColor: "#04b16d" } }}>
          Save
        </Button>
      </Box>

      <ConfirmationDialog open={openConfirm} onClose={cancelDiscard} onConfirm={confirmDiscard} title="Confirm Discard" content="Are you sure you want to discard the changes?" />
      <ConfirmationDialog open={openChangeConfirm} onClose={() => setOpenChangeConfirm(false)} onConfirm={handleChangePasswordConfirm} title="Confirm Change" content="Are you sure you want to change your password?" />
      <NotificationSnackbar alert={alert} onClose={() => setAlert({ ...alert, open: false })} />
    </Box>
  );
}
