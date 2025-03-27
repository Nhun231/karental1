import { useState } from "react";
import { TextField, Button, Box } from "@mui/material";

export default function FileUpload({ label, onFileChange, preview, disabled }) {
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      onFileChange(file);
    }
  };

  return (
    <>
      <TextField
        fullWidth
        variant="standard"
        label={label}
        value={fileName}
        disabled={disabled}
        InputProps={{
          endAdornment: (
            <Button component="label" variant="contained" sx={{ height: "32px", backgroundColor: "#05ce80", color: "white", '&:hover': { backgroundColor: "#04b16d" } }}>
              Upload
              <input
                type="file"
                hidden
                accept="image/*"
                disabled={disabled}
                onChange={handleFileChange}
              />
            </Button>
          ),
        }}
      />
      {preview && (
        <Box
          component="img"
          src={preview}
          alt="Preview"
          sx={{
            width: "100%",
            maxWidth: 300,
            height: 160,
            objectFit: "contain",
            borderRadius: 2,
            mt: 6,
          }}
        />
      )}
    </>
  );
}
