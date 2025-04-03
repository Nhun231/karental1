import * as React from "react";
import * as Mui from "@mui/material";
import normalForm from "../../styles/FormStyles.js";
import { forgotPasswordEmailFunction, login } from '../../services/UserServices.js';
import * as Icons from "@mui/icons-material";
import { useState } from "react";
import { ModalClose, ModalDialog } from '@mui/joy';
import { useNavigate } from "react-router-dom";
import NotificationSnackbar from "../common/NotificationSnackbar.js";
const Login = () => {
    const [alert, setAlert] = useState({ open: false, message: "", severity: "success" });

  const [formLogin, setFormLogin] = useState({
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    setFormLogin({
      ...formLogin,
      [e.target.name]: e.target.value
    })
  }
    // state for showing password or not
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const nav = useNavigate();
　const handleSubmit = async (event) =>{
  event.preventDefault();
  try {
    const response = await login(formLogin); // Await the login call
    console.log("Login Response:", response);
    //set role into localStorage
    if(response.code===1000){
      localStorage.setItem("role", response.data.userRole);
        localStorage.setItem("name", response.data.fullName);
        localStorage.setItem("csrfToken", response.data.csrfToken);
        setAlert({ open: true, message: "Welcome to Our Community", severity: "success" });
    setTimeout(() => {
      nav("/", { replace: true });
    }, 1000);
    }else{
      setAlert({ open: true, message: response.message, severity: "error" });
    }
  } catch (error) {
    console.log(error)
  }
}
const handleMouseUp = (event) => {
  event.preventDefault();
};
const handleMouseDown = (event) => {
  event.preventDefault();
};
const [openModalForgot, setOpenModalForgot] = useState(false)
const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
const handleForgotPassword = async() => {
    setForgotPasswordEmail(forgotPasswordEmail);
    try{
      const response =  await forgotPasswordEmailFunction(forgotPasswordEmail);
      if(response){
        setAlert({ open: true, message: response.data.message, severity: "error" });
      }

    }catch(error){
      setAlert({ open: true, message: error, severity: "error" });
    }
  }
  return (
    <>
      <Mui.Box component="form" sx={normalForm}>
        <Mui.Typography
          variant="h5"
          textAlign={"center"}
          sx={{ color: "#05ce80" }}
        >
          LOG IN USING YOUR ACCOUNT
        </Mui.Typography>
        <Mui.Box sx={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "start" }}>
          <Mui.TextField
            id="login-email"
            name="email"
            variant="standard"
            label="Your email address"
            //error={!!errors.name}
            //helperText={errors.name}
            value={formLogin.email}
            onChange={handleChange}
            fullWidth
          />
          <Mui.TextField
            id="login-password"
            name="password"
            variant="standard"
            label="Password"
            //error={!!errors.password}
            //helperText={errors.password}
            value={formLogin.password}
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
          <Mui.Link id="login-forgotPassword" href="#"
            onClick={(e) => {
              setOpenModalForgot(true);
              e.preventDefault();
            }}>
            Forgot your password?</Mui.Link>
          <Mui.Modal open={openModalForgot} >
            <ModalDialog>
              <ModalClose onClick={() => setOpenModalForgot(false)} />
              <Mui.Box textAlign={"center"}>
                <Mui.Typography variant={"h6"}>Forgot your password?</Mui.Typography>
                <Mui.TextField variant='standard' onChange={(e) => (setForgotPasswordEmail(e.target.value))} label="Your email" value={forgotPasswordEmail}></Mui.TextField>
                <br />
                <Mui.Button
                  sx={{
                    width: 150,
                    height: 50,
                    borderRadius: 2,
                    border: "solid white",
                    backgroundColor: "#05ce80",
                    marginInline: 2,
                    color: "white",
                    transition: " 0.3s",
                    "&:hover": {
                      backgroundColor: "white",
                      borderRadius: 2,
                      borderColor: "#05ce80",
                      color: "#05ce80",
                    },
                  }}
                  onClick={handleForgotPassword}
                >
                  Send Email
                </Mui.Button>
              </Mui.Box>
            </ModalDialog>
          </Mui.Modal>
          <Mui.Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
            <Mui.Button
              id="login"
              variant="outlined"
              onClick={handleSubmit}
              sx={{
                width: '150px',
                borderRadius: 2,
                borderColor: "black",
                color: "black",
                fontWeight: 500,
                textTransform: "none",
                transition: " 0.3s",
                "&:hover": {
                  borderColor: "#05ce80",
                  color: "#05ce80",
                },
              }}
            >
              LOGIN
            </Mui.Button>
          </Mui.Box>
        </Mui.Box>
      </Mui.Box>
       <NotificationSnackbar  alert={alert} onClose={() => setAlert({ ...alert, open: false })} />
    </>
  );
};

export default Login;
