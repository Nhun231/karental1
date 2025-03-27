import React, { useEffect, useRef, useState } from "react";
import Layout from "../components/common/Layout";
import * as Mui from "@mui/material";
import * as Icons from "@mui/icons-material";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  forgotPasswordChange,
  forgotPasswordVerify,
} from "../services/UserServices";

const SetNewPassword = () => {
  const [newPass, setNewPass] = useState([]);
  const [confirmNewPass, setConfirmNewPass] = useState([]);
  // state for showing password or not
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseUp = (event) => {
    event.preventDefault();
  };
  const handleMouseDown = (event) => {
    event.preventDefault();
  };
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState("");
  useEffect(() => {
    const tokenFromParams = searchParams.get("t");
    if (!tokenFromParams) {
      return;
    }
    setToken(tokenFromParams);
    const verifyPasswordToken = async () => {
      try {
        const response = await forgotPasswordVerify(tokenFromParams);
        if (response) {
          console.log("Verify OK");
        } else return;
      } catch (error) {
        alert(error);
      }
    };
    verifyPasswordToken();
    // nav("/auth/forgot-password/verify")
  }, []);
  const nav = useNavigate();
  const validatePassword = (password) => {
    return !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{9,}$/.test(password)
      ? "Invalid password format"
      : "";
  };
  const [errors, setErrors] = useState({});
  const [errorMatch, setErrorMatch] = useState("");



  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setNewPass(value);
  
    const error = validatePassword(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      password: error || "",
    }));

  };
  
  const handleConfPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmNewPass(value);
  
    const error = validatePassword(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      confirmPassword: error || "",
    }));
  
    
  };
  // run except first render
  const firstRender = useRef(true)
  useEffect(()=>{
    if(firstRender.current){
      firstRender.current=false;
      return;
    }
    setErrorMatch(newPass !== confirmNewPass ? "Password and Confirm Password must match" : "");
  },[newPass, confirmNewPass])
    const handleChangePassword = () => {
    if (newPass !== confirmNewPass) {
      alert("Password and Confirm Password must match");
      return;
    }
    if (!newPass || !confirmNewPass) {
      alert("All fields are required");
      return;
    }
    const formChangePassword = {
      forgotPasswordToken: token,
      newPassword: newPass,
    };
    const changePassword = async (formChangePassword) => {
      try {
        const response = await forgotPasswordChange(formChangePassword);
        if (response) {
          alert(response.data.message);
          nav("/login-register");
        }
      } catch (error) {
        alert(error);
        return;
      }
    };
    changePassword(formChangePassword);
  };
  return (
    <Layout>
      <Mui.Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        <Mui.Box width={"30%"} textAlign={"center"}>
          <Mui.Typography variant="h5">Set Your New Password</Mui.Typography>
          <Mui.TextField
            id="register-password"
            name="password"
            variant="standard"
            label="Pick a password"
            error={!!errors.password}
            helperText={errors.password}
            value={newPass}
            onChange={handlePasswordChange}
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
            value={confirmNewPass}
            onChange={handleConfPasswordChange}
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
          {errorMatch && <Mui.Typography color="red">{errorMatch}</Mui.Typography>}
          <Mui.Button
          
                sx={{
                  marginTop:"30px",
                  width: 150,
                  height: 50,
                  borderRadius: 2,
                  border: "solid ",
                  borderColor: "#05ce80",
                  backgroundColor: "white",
                  marginInline: 2,
                  color: "#05ce80",
                  "&:hover": {
                    backgroundColor: "#05ce80",
                    borderColor: "#05ce80",
                    color: "white",
                  },
                }}
               // onClick={nav("/login-register")}
              >
                Cancel
              </Mui.Button>
          <Mui.Button
            sx={{
              marginTop:"30px",
              width: 150,
              height: 50,
              borderRadius: 2,

              backgroundColor: "#05ce80",
              marginInline: 2,
              color: "white",
              transition: " 0.3s",
              "&:hover": {
                border: "solid ",
                backgroundColor: "white",
                borderRadius: 2,
                borderColor: "#05ce80",
                color: "#05ce80",
              },
            }}
            onClick={handleChangePassword}
          >
            Change Password
          </Mui.Button>

          
        </Mui.Box>
      </Mui.Box>
    </Layout>
  );
};

export default SetNewPassword;
