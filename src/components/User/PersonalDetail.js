import { Grid, TextField, FormHelperText } from "@mui/material";
import DatePickerInput from "../common/DatePicker";
import FileUpload from "../common/FileUpload";
export default function PersonalDetails({
  formData,
  handleChange,
  handleDateChange,
  handleFileChange,
  errorMsg,
  onlyView = false
}) {
  return (
    <Grid container spacing={2} rowSpacing={3}>
      <Grid item xs={6}>
        <TextField
          fullWidth
          label="Full Name"
          name="fullName"
          variant="standard"
          value={formData.fullName}
          onChange={handleChange}
          error={!!errorMsg.fullName}
          helperText={errorMsg.fullName}
          disabled={onlyView}
          required
        />
      </Grid>
      <Grid item xs={6}>
        <DatePickerInput
          label="Date of Birth"
          name="dob"
          value={formData.dob}
          onChange={handleDateChange}
          disabled={onlyView}
        />
        {errorMsg.dob && <FormHelperText error>{errorMsg.dob}</FormHelperText>}
      </Grid>
      <Grid item xs={6}>
        <TextField
          fullWidth
          label="Phone Number"
          name="phoneNumber"
          variant="standard"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
          error={!!errorMsg.phoneNumber}
          helperText={errorMsg.phoneNumber}
          disabled={onlyView}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          fullWidth
          label="Email"
          name="email"
          variant="standard"
          value={formData.email}
          disabled
        />
      </Grid>
      <Grid item xs={6} height={"80px"}>
        <TextField
          fullWidth
          label="National ID No"
          name="nationalId"
          variant="standard"
          value={formData.nationalId}
          onChange={handleChange}
          error={!!errorMsg.nationalId}
          helperText={errorMsg.nationalId}
          disabled={onlyView}
          required
        />
      </Grid>
      <Grid item xs={6} height={"50px"}>

        <FileUpload
          label="Driving License"
          value={formData.drivingLicensePreview}
          onFileChange={handleFileChange}
          preview={formData.drivingLicensePreview}
          disabled={onlyView}
          sx={{
            height: '32px',
          }}
        />
      </Grid>
    </Grid>
  );
}
