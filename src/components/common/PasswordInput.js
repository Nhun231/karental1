import React from "react";
import { TextField, IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const PasswordInput = ({ label, name, value, onChange, showPassword, onTogglePassword, error, helperText }) => (
    <TextField
        fullWidth
        label={label}
        name={name}
        variant="standard"
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        required
        error={error}
        helperText={helperText}
        InputProps={{
            endAdornment: (
                <IconButton onClick={() => onTogglePassword(name)}>
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
            ),
        }}
    />
);

export default PasswordInput;
