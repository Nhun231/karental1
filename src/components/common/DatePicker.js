import { DatePicker } from "@mui/x-date-pickers/DatePicker";
/**
 * 
 * Date Picker Component
 * Provide input date for 'User Profile' page 
 */
export default function DatePickerInput({ label, value, onChange, disabled }) {
  return (
    <DatePicker
      label={label}
      value={value}
      onChange={onChange}
      disabled={disabled}
      slotProps={{
        textField: {
          fullWidth: true,
          variant: "standard",
          required: true,
          sx: {
            "& .MuiOutlinedInput-notchedOutline": { border: "none" },
          },
        },
      }}
    />
  );
}
