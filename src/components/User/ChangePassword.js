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
  const [generalError, setGeneralError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateField = (name, value) => {
    if (value.trim() === "") {
      setFormValid((prevState) => ({ ...prevState, [name]: false }));
      setGeneralError(`* ${name === "currentPassword" ? "Current" : name === "newPassword" ? "New" : "Confirm"} password is required.`);
      return;
    }

    const passwordRegex = /^(?=.*\d).{9,}$/;

    if (name === "currentPassword" || name === "newPassword") {
      if (!passwordRegex.test(value)) {
        setFormValid((prevState) => ({ ...prevState, [name]: false }));
        setGeneralError(`* ${name === "currentPassword" ? "Current" : "New"} password must be at least 9 characters long and include at least one number.`);
        return;
      }
    }

    if (name === "confirmPassword" && value !== formData.newPassword) {
      setFormValid((prevState) => ({ ...prevState, confirmPassword: false }));
      setGeneralError("* New password and confirm password must match.");
      return;
    }

    setFormValid((prevState) => ({ ...prevState, [name]: true }));
    setGeneralError("");
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
      setAlert({ open: true, message: "Password validation failed. Please check your inputs.", severity: "error" });
    }
  };

  const handleChangePasswordConfirm = async () => {
    try {
      const response = await updateUserPassword(formData);
      setAlert({ open: true, message: "Password changed successfully!", severity: "success" });
      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      try {
        window.alert("Password changed successfully!");
      } catch (error) {
        console.error("Update failed:", error);
      }
      setOpenChangeConfirm(false);
      console.log("Password successfully changed", response);
    } catch (error) {
      setAlert({ open: true, message: "Password update failed. Please check your inputs.", severity: "error" });
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
        <Grid item xs={6}>
          <Grid item xs={12}>
            <PasswordInput
              label="Old Password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              showPassword={showPassword.currentPassword}
              onTogglePassword={togglePasswordVisibility}
              error={!formValid.currentPassword && formData.currentPassword !== ""}
              helperText={!formValid.currentPassword && formData.currentPassword !== "" && generalError}
            />
          </Grid>
          <Grid item xs={12}>
            <PasswordInput
              label="New Password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              showPassword={showPassword.newPassword}
              onTogglePassword={togglePasswordVisibility}
              error={!formValid.newPassword && formData.newPassword !== ""}
              helperText={!formValid.newPassword && formData.newPassword !== "" && generalError}
            />
          </Grid>
          <Grid item xs={12}>
            <PasswordInput
              label="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              showPassword={showPassword.confirmPassword}
              onTogglePassword={togglePasswordVisibility}
              error={!formValid.confirmPassword && formData.confirmPassword !== ""}
              helperText={!formValid.confirmPassword && formData.confirmPassword !== "" && generalError}
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
