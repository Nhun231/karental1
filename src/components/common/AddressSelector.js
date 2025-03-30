import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  Grid,
  TextField,
  Typography,
  Autocomplete
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { setAddress } from "../../reducers/RentalTimeReducer";
/**
 * 
 * Address Selector Component
 * Provided an UI for choose address
 */


// Remove Tones
const removeVietnameseTones = (str) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
};
// Dropdow display address infomation for user choose
const Dropdown = ({ label, name, value, onChange, options, disabled, error }) => (
  <div>
    <Autocomplete
      options={options}
      value={value || null}
      onChange={(event, newValue) => {
        onChange({ target: { name, value: newValue || "" } });
      }}
      disableClearable
      disabled={disabled}
      filterOptions={(options, { inputValue }) => {
        const normalizedInput = removeVietnameseTones(inputValue.toLowerCase().trim());
        const hasTone = inputValue !== normalizedInput; // Check if input has tones

        return options.filter((option) => {
          const normalizedOption = removeVietnameseTones(option.toLowerCase());

          if (hasTone) {
            return option.toLowerCase().includes(inputValue.toLowerCase()); // Search with tones
          }
          return normalizedOption.includes(normalizedInput); // Search with no tones, result include text has tones
        });
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          error={!!error}
          helperText={error}
          fullWidth
          sx={{ bgcolor: "white", borderRadius: "4px" }}
        />
      )}
    />
  </div>
);

// TextField Component for House Number Street input
const HouseNumberInput = ({ value, onChange, disabled, error }) => (
  <TextField
    fullWidth
    label="House Number & Street"
    name="houseNumberStreet"
    value={value || ""}
    onChange={onChange}
    disabled={disabled}
    required
    error={!!error}
    helperText={error}
    sx={{ bgcolor: "white" }}
  />
);

export default function AddressSelector({ formData, setFormData, errorMsg, setErrorMsg, handleChange, isSearch, useRedux = false, onlyView = false }) {
  const dispatch = useDispatch();

  // Get address from redux store
  const reduxAddress = useSelector((state) => state.rental.address);

  // If the main component not use redux, get address by formData
  const address = useRedux ? reduxAddress : formData;

  // State to store addressData
  const [addressData, setAddressData] = useState([]);

  // Get addressData from database.json
  useEffect(() => {
    axios
      .get(`${process.env.PUBLIC_URL}/database.json`)
      .then((res) => setAddressData(res.data.Address_list))
      .catch((err) => console.error("Error loading address data:", err));
  }, []);


  // Get city/Province
  const cities = useMemo(
    () => [...new Set(addressData.map((item) => item.City_Province))],
    [addressData]
  );

  // Get district depend on selected city/Province
  const districts = useMemo(
    () =>
      address.cityProvince
        ? [...new Set(addressData.filter((item) => item.City_Province === address.cityProvince).map((item) => item.Disctrict))]
        : [],
    [address.cityProvince, addressData]
  );

  // Get ward depend on selected district
  const wards = useMemo(
    () =>
      address.district
        ? addressData.filter((item) => item.Disctrict === address.district).map((item) => item.Ward)
        : [],
    [address.district, addressData]
  );

  // Validate input
  const validateField = (name, value) => {
    if (!value || !value.trim()) {
      if (name === "cityProvince") return "Please select a city/province";
      if (name === "district") return "";
      if (name === "ward") return "";
      if (name === "houseNumberStreet") return "";
      return "";
    }
    return "";
  };

  // Function handle address change
  const handleLocalChange = (e) => {
    const { name, value } = e.target;

    // If parent component use redux, update the address to redux store, else, update to formData
    if (useRedux) {
      let updatedAddress = { ...reduxAddress, [name]: value };

      if (name === "cityProvince") {
        updatedAddress = { ...updatedAddress, district: "", ward: "", houseNumberStreet: "" };
      } else if (name === "district") {
        updatedAddress = { ...updatedAddress, ward: "", houseNumberStreet: "" };
      } else if (name === "ward") {
        updatedAddress = { ...updatedAddress, houseNumberStreet: "" };
      }
      dispatch(setAddress(updatedAddress));
    } else {
      handleChange(e);
      setFormData((prev) => {
        let updatedForm = { ...prev, [name]: value };

        if (name === "cityProvince") {
          updatedForm = { ...updatedForm, district: "", ward: "", houseNumberStreet: "" };
        } else if (name === "district") {
          updatedForm = { ...updatedForm, ward: "", houseNumberStreet: "" };
        } else if (name === "ward") {
          updatedForm = { ...updatedForm, houseNumberStreet: "" };
        }

        return updatedForm;
      });
    }
    setErrorMsg((prevErrors) => {
      const validKeys = ["cityProvince", "district", "ward", "houseNumberStreet"];
      if (!validKeys.includes(name)) return prevErrors;

      const error = validateField(name, value);
      if (error) {
        return { ...prevErrors, [name]: error }; // If error is not null, update to error message
      } else {
        const { [name]: _, ...newErrors } = prevErrors; // If not have error, delete
        return newErrors;
      }
    })

  };
  return (
    <Grid container spacing={2}>
      {isSearch ? <></> : (<Grid item xs={12}>
        <Typography variant="h6">Address</Typography>
      </Grid>)}
      <Grid item xs={12} md={6}>
        <Dropdown label="City/Province" name="cityProvince" value={address.cityProvince} onChange={handleLocalChange} disabled={onlyView} options={cities} error={errorMsg.cityProvince} />
      </Grid>
      <Grid item xs={12} md={6}>
        <Dropdown label="District" name="district" value={address.district} onChange={handleLocalChange} options={districts} disabled={!address.cityProvince || onlyView} error={errorMsg.district} />
      </Grid>
      <Grid item xs={12} md={6}>
        <Dropdown label="Ward" name="ward" value={address.ward} onChange={handleLocalChange} options={wards} disabled={!address.district || onlyView} error={errorMsg.ward} />
      </Grid>
      <Grid item xs={12} md={6}>
        {isSearch ? <></> : (<HouseNumberInput value={address.houseNumberStreet} onChange={handleLocalChange} disabled={!address.ward || onlyView} error={errorMsg.houseNumberStreet} />
        )}
      </Grid>
    </Grid>
  );
}
