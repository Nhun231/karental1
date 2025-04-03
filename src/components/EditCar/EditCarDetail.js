import * as React from "react";
import TextField from "@mui/material/TextField";
import { useDispatch, useSelector } from "react-redux";
import {
  Alert,
  Typography,
  Box,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Link,
  Autocomplete,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useDropzone } from "react-dropzone";
import {
  setFetchedCarData,
  setErrors,
  setCar,
  toggleFunction,
  checkErrors,
} from "../../reducers/carFetchReducer";
import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Bluetooth,
  GpsFixed,
  CameraAlt,
  WbSunny,
  Lock,
  ChildCare,
  Dvr,
  Usb,
} from "@mui/icons-material";
import IconButton from "@mui/material/IconButton"; // Import từ @mui/material
import CloseIcon from "@mui/icons-material/Close";
import {
  saveFileToDB,
  deleteFileFromDB,
  getFileFromDB,
} from "../../Helper/indexedDBHelper";
import { Skeleton } from "@mui/material";
import { updateCar } from "../../reducers/carFetchReducer";
import { store } from "../../redux/store";
import axios from "axios";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB max size file can input

export default function EditCarDetail() {
  //style for box input file
  const styles = {
    border: "2px dashed #999",
    borderRadius: "8px",
    p: 3,
    textAlign: "center",
    cursor: "pointer",
    width: "250px",
    height: "200px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    "&:hover": { borderColor: "blue" },
  };

  const dispatch = useDispatch();

  const { carData = {}, errors = {} } = useSelector((state) => state.carFetch);

  const [loading, setLoading] = useState(false);
  const handleChange = (event) => {
    dispatch(toggleFunction(event.target.name));
  };

  //function set name error
  const handleError = (errorType, message) => {
    dispatch(setErrors({ ...errors, [errorType]: message }));
  };

  // use useEffect to update the Redux store when `additionalFunctions` changes
  useEffect(() => {
    if (!carData?.additionalFunctions) return;
    const selectedFunction = Object.keys(carData.additionalFunctions)
        .filter((key) => carData.additionalFunctions[key])
        .join(", ");
    if (carData?.data?.additionalFunctions !== selectedFunction) {
      dispatch(
          setCar({ ...carData.data, additionalFunction: selectedFunction })
      );
    }
  }, [carData.additionalFunctions, dispatch]); // Dependencies include `carData.additionalFunctions` and `dispatch`

  //function function delete image from indexDB
  const handleDeleteImage = async (fileType) => {
    await deleteFileFromDB(fileType); // Xóa file khỏi IndexedDB

    setImagePreviews((prev) => ({
      ...prev,
      [fileType]: null, // Xóa ảnh xem trước
    }));
  };

  const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif"];

  const handleDrop = useCallback(
      (fileType, errorType) => async (acceptedFiles) => {
        dispatch(setErrors({ ...errors, [errorType]: "" }));

        const validFile = acceptedFiles.find((file) => {
          const fileExt = file.name
              .substring(file.name.lastIndexOf("."))
              .toLowerCase();
          return allowedExtensions.includes(fileExt);
        });

        if (validFile) {
          await saveFileToDB(fileType, validFile); // Save file to IndexedDB

          setImagePreviews((prev) => ({
            ...prev,
            [fileType]: URL.createObjectURL(validFile),
          }));
        } else {
          const errorMessage = acceptedFiles.some(
              (file) => file.size > MAX_FILE_SIZE
          )
              ? "File size must be less than 5MB."
              : "Invalid file type! Only .doc, .docx, .pdf, .jpg, .jpeg, .png are allowed.";

          dispatch(setErrors({ ...errors, [errorType]: errorMessage }));
        }
      },
      [dispatch, errors]
  );

  //function to call function input image file and control multiple
  const dropzoneImageFront = useDropzone({
    onDrop: handleDrop("carImageFront", "carImageFront"),
    multiple: false,
  });

  //function to call function input image file and control multiple
  const dropzoneImageBack = useDropzone({
    onDrop: handleDrop("carImageBack", "carImageBack"),
    multiple: false,
  });

  //function to call function input image file and control multiple
  const dropzoneImageLeft = useDropzone({
    onDrop: handleDrop("carImageLeft", "carImageLeft"),
    multiple: false,
  });

  //function to call function input image file and control multiple
  const dropzoneImageRight = useDropzone({
    onDrop: handleDrop("carImageRight", "carImageRight"),
    multiple: false,
  });

  const [address, setAddress] = useState([]);
  const [cityProvince, setCityProvince] = useState([]);

  //function to fetch information address from database
  useEffect(() => {
    axios.get("/database.json").then((res) => {
      const data = res.data.Address_list;
      setAddress(data);

      const uniqueCityProvince = Array.from(
          new Set(data.map((item) => item.City_Province))
      ).map((city) => ({ label: city, value: city }));

      setCityProvince(uniqueCityProvince);
    });
  }, []);

  // Filtered data to filter district
  const filteredDistrict = useMemo(() => {
    if (!carData.addressCityProvince) return [];

    const tmp = address.filter(
        (item) => item.City_Province === carData.addressCityProvince
    );
    return Array.from(new Set(tmp.map((item) => item.Disctrict))).map(
        (dsc) => ({
          label: dsc,
          value: dsc,
        })
    );
  }, [address, carData.addressCityProvince]);

  // Filtered data to filter ward
  const filteredWard = useMemo(() => {
    const tmp = address.filter(
        (item) => item.City_Province === carData.addressCityProvince
    );

    const tmp2 = tmp.filter(
        (item) => item.Disctrict === carData.addressDistrict
    );
    return Array.from(new Set(tmp2.map((item) => item.Ward))).map((dsc) => ({
      label: dsc,
      value: dsc,
    }));
  }, [address, carData.addressCityProvince, carData.addressDistrict]);

  const [imagePreviews, setImagePreviews] = useState({
    carImageFront: null,
    carImageBack: null,
    carImageLeft: null,
    carImageRight: null,
  });

  //function get image from indexDB
  useEffect(() => {
    const loadFiles = async () => {
      const storedFiles = {
        carImageFront:
            (await getFileFromDB("carImageFrontUrl")) ||
            (await getFileFromDB("carImageFront")),
        carImageBack:
            (await getFileFromDB("carImageBackUrl")) ||
            (await getFileFromDB("carImageBack")),
        carImageLeft:
            (await getFileFromDB("carImageLeftUrl")) ||
            (await getFileFromDB("carImageLeft")),
        carImageRight:
            (await getFileFromDB("carImageRightUrl")) ||
            (await getFileFromDB("carImageRight")),
      };

      // Chuyển Blob thành URL nếu cần
      const processFile = (file) =>
          file instanceof Blob ? URL.createObjectURL(file) : file;

      setImagePreviews({
        carImageFront: processFile(storedFiles.carImageFront),
        carImageBack: processFile(storedFiles.carImageBack),
        carImageLeft: processFile(storedFiles.carImageLeft),
        carImageRight: processFile(storedFiles.carImageRight),
      });
    };

    loadFiles();
  }, [carData]);

  //funtion display preview image
  useEffect(() => {
    return () => {
      Object.values(imagePreviews).forEach((url) => {
        if (typeof url === "string" && url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [imagePreviews]);

  return (
      <>
        {carData.data ? (
            <Box
                component="form"
                onSubmit={(e) => e.preventDefault()}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: "30px",
                  "& .MuiTextField-root": { m: 2, width: "50ch" },
                }}
                noValidate
                autoComplete="off"
            >
              <Box
                  sx={{
                    maxWidth: "1200px",
                    margin: "auto",
                    p: 3,
                    mt: 2,
                    width: "100%",
                    mb: 3,
                    border: "1px solid #ddd",
                    borderRadius: 2,
                    boxShadow: 2,
                    bgcolor: "white",
                  }}
              >
                {/* Mileage vs fuelConsumption */}
                <div className="flex-container">
                  <TextField
                      required
                      sx={{
                        "& .MuiInputLabel-root": {
                          fontSize: "18px", //
                          fontWeight: "bold",
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: "primary.main", //
                        },
                        "& .MuiInputLabel-root.MuiInputLabel-shrink": {
                          color: "primary.main", //
                        },
                      }}
                      error={!!errors.mileage}
                      helperText={errors.mileage || "Please enter your mileage (km)"}
                      id="mileage"
                      label="Mileage: "
                      variant="standard"
                      name="mileage"
                      type="number"
                      value={carData?.data?.mileage}
                      onKeyDown={(e) => {
                        if (["e", "E", "+", "-"].includes(e.key)) {
                          e.preventDefault(); // prevent e, E, +, -
                        }
                      }}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, ""); // just numbers
                        if (/^\d*$/.test(value)) {
                          if (errors.mileage) {
                            handleError("mileage", "");
                          }
                        }

                        if (e.target.value === "" && !errors.mileage) {
                          handleError("mileage", "Please enter your mileage (km)");
                          dispatch(
                              setErrors({
                                ...errors,
                                mileage: "Please enter your mileage (km)",
                              })
                          );
                        }

                        if (carData.data.mileage !== value) {
                          dispatch(setCar({ ...carData.data, mileage: value }));
                        }
                      }}
                      slotProps={{
                        input: {
                          style: { color: "black" }, //
                        },
                        inputLabel: {
                          shrink: true,
                        },
                      }}
                  />
                  <TextField
                      required
                      error={!!errors.fuelConsumption}
                      helperText={errors.fuelConsumption || "Liter/100 km"}
                      id="fuelConsumption"
                      label="Fuel Consumption: "
                      variant="standard"
                      name="fuelConsumption"
                      type="number"
                      value={carData?.data?.fuelConsumption}
                      sx={{
                        "& .MuiInputLabel-root": {
                          fontSize: "18px", //
                          fontWeight: "bold",
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: "primary.main", //
                        },
                        "& .MuiInputLabel-root.MuiInputLabel-shrink": {
                          color: "primary.main", //
                        },
                      }}
                      onKeyDown={(e) => {
                        if (["e", "E", "+", "-"].includes(e.key)) {
                          e.preventDefault(); // prevent e, E, +, -
                        }
                      }}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, ""); // just numbers
                        if (carData.data.fuelConsumption !== value) {
                          dispatch(
                              setCar({ ...carData.data, fuelConsumption: value })
                          );
                        }
                        if (value === "" && !errors[e.target.name]) {
                          dispatch(
                              setErrors({
                                ...errors,
                                [e.target.name]: "Please enter your mileage (km)",
                              })
                          );
                        } else if (errors[e.target.name]) {
                          dispatch(setErrors({ ...errors, [e.target.name]: "" }));
                        }
                      }}
                      slotProps={{
                        input: {
                          style: { color: "black" }, //
                        },
                        inputLabel: {
                          shrink: true,
                        },
                      }}
                  />
                </div>

                <div className="flex-container">
                  <div>
                    <Typography variant="h6">Address</Typography>
                    <Autocomplete
                        options={cityProvince} //
                        sx={{
                          "& .MuiInputLabel-root": {
                            fontSize: "18px", //
                            fontWeight: "bold",
                          },
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: "primary.main", //
                          },
                          "& .MuiInputLabel-root.MuiInputLabel-shrink": {
                            color: "primary.main", //
                          },
                        }}
                        getOptionLabel={(option) => option.label} //
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="City/Province"
                                name="addressCityProvince"
                                id="addressCityProvince"
                                variant="standard"
                                required
                                error={!!errors.addressCityProvince} //
                                helperText={
                                    errors.addressCityProvince ||
                                    "Please select your City/Province"
                                } //
                                slotProps={{
                                  ...params.InputProps,
                                  style: { color: "gray" }, //
                                }}
                            />
                        )}
                        value={
                          cityProvince.length > 0 && carData.addressCityProvince
                              ? cityProvince.find(
                              (option) =>
                                  option.value === carData.addressCityProvince
                          ) || null
                              : null
                        }
                        onChange={(event, newValue) => {
                          const addressParts = [
                            newValue?.value || "",
                            carData?.addressDistrict || "",
                            carData?.addressWard || "",
                            carData?.addressHouseNumberStreet || "",
                          ];

                          const formattedAddress = addressParts
                              .filter((part) => part.trim() !== "") //
                              .join(", "); //

                          dispatch(
                              setFetchedCarData({
                                ...carData,
                                addressCityProvince: newValue?.value || "",
                                selectedCityProvince: newValue?.label || "",
                                addressDistrict: "",
                                addressWard: "",
                                // addressHouseNumberStreet: "",
                                data: {
                                  ...carData.data,
                                  address: formattedAddress,
                                },
                              })
                          );
                          if (newValue) {
                            dispatch(
                                setErrors({
                                  ...errors,
                                  addressCityProvince: "",
                                  addressDistrict: "Please select your District",
                                  addressWard: "Please select your Ward",
                                  // addressHouseNumberStreet:
                                  //   "Please enter your house number",
                                })
                            ); // Xóa lỗi
                          } else {
                            dispatch(
                                setErrors({
                                  ...errors,
                                  addressCityProvince:
                                      "Please select your City/Province",
                                  addressDistrict: "Please select your District",
                                  addressWard: "Please select your Ward",
                                  // addressHouseNumberStreet:
                                  //   "Please enter your house number",
                                })
                            );
                          }
                        }}
                    />

                    <Autocomplete
                        options={filteredDistrict} //
                        sx={{
                          "& .MuiInputLabel-root": {
                            fontSize: "18px", //
                            fontWeight: "bold",
                          },
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: "primary.main", //
                          },
                          "& .MuiInputLabel-root.MuiInputLabel-shrink": {
                            color: "primary.main", //
                          },
                        }}
                        getOptionLabel={(option) => option.label} // Hiển thị label
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="District"
                                name="addressDistrict"
                                id="addressDistrict"
                                variant="standard"
                                required
                                error={!!errors.addressDistrict} // Nếu có lỗi thì hiện màu đỏ
                                helperText={
                                    errors.addressDistrict || "Please select your District"
                                } // display error or guide
                                slotProps={{
                                  ...params.InputProps,
                                  style: { color: "black" }, // Màu xám nhạt
                                }}
                            />
                        )}
                        value={
                            filteredDistrict.find(
                                (c) => c.value === carData.addressDistrict
                            ) || null
                        } // combine with state
                        onChange={(event, newValue) => {
                          const addressParts = [
                            carData?.addressCityProvince || "",
                            newValue?.value || "",
                            carData?.addressWard || "",
                            carData?.addressHouseNumberStreet || "",
                          ];

                          const formattedAddress = addressParts
                              .filter((part) => part.trim() !== "") //
                              .join(", "); //

                          dispatch(
                              setFetchedCarData({
                                ...carData,
                                addressDistrict: newValue?.value || "",
                                selectedDistrict: newValue?.label || "",
                                addressWard: "",
                                // addressHouseNumberStreet: "",
                                data: {
                                  ...carData.data,
                                  address: formattedAddress,
                                },
                              })
                          );
                          if (newValue) {
                            dispatch(setErrors({ ...errors, addressDistrict: "" })); // delete error
                          } else {
                            dispatch(
                                setErrors({
                                  ...errors,
                                  addressDistrict: "Please select your District",
                                  addressWard: "Please select your Ward",
                                  // addressHouseNumberStreet:
                                  //   "Please enter your house number",
                                })
                            );
                          }
                        }}
                        // disabled={!carData.selectedCityProvince}
                    />

                    <Autocomplete
                        options={filteredWard} //
                        sx={{
                          "& .MuiInputLabel-root": {
                            fontSize: "18px", //
                            fontWeight: "bold",
                          },
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: "primary.main", //
                          },
                          "& .MuiInputLabel-root.MuiInputLabel-shrink": {
                            color: "primary.main", //
                          },
                        }}
                        getOptionLabel={(option) => option.label} // Hiển thị label
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Ward"
                                name="addressWard"
                                id="addressWard"
                                variant="standard"
                                required
                                error={!!errors.addressWard} // Nếu có lỗi thì hiện màu đỏ
                                helperText={
                                    errors.addressWard || "Please select your Ward"
                                } // Hiển thị lỗi hoặc hướng dẫn
                                slotProps={{
                                  ...params.InputProps,
                                  style: { color: "gray" }, // Màu xám nhạt
                                }}
                            />
                        )}
                        value={
                            filteredWard.find((c) => c.value === carData.addressWard) ||
                            null
                        } // Liên kết với state
                        onChange={(event, newValue) => {
                          const addressParts = [
                            carData?.addressCityProvince || "",
                            carData?.addressDistrict || "",
                            newValue?.value || "",
                            carData?.addressHouseNumberStreet || "",
                          ];

                          const formattedAddress = addressParts
                              .filter((part) => part.trim() !== "") //
                              .join(", "); //

                          dispatch(
                              setFetchedCarData({
                                ...carData,
                                addressWard: newValue?.value || "",

                                // addressHouseNumberStreet: "",
                                data: {
                                  ...carData.data,
                                  address: formattedAddress,
                                },
                              })
                          );
                          if (newValue) {
                            dispatch(setErrors({ ...errors, addressWard: "" })); // Xóa lỗi
                          } else {
                            dispatch(
                                setErrors({
                                  ...errors,
                                  addressWard: "Please select your Ward",
                                  // addressHouseNumberStreet:
                                  //   "Please enter your house number",
                                })
                            );
                          }
                        }}
                        // disabled={!carData.selectedDistrict}
                    />
                    <TextField
                        required
                        error={!!errors.addressHouseNumberStreet}
                        helperText={
                            errors.addressHouseNumberStreet ||
                            "Please enter your house number and street"
                        }
                        id="street"
                        label="House number, Street: "
                        variant="standard"
                        name="addressHouseNumberStreet"
                        value={carData.addressHouseNumberStreet}
                        sx={{
                          "& .MuiInputLabel-root": {
                            fontSize: "18px", //
                            fontWeight: "bold",
                          },
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: "primary.main", //
                          },
                          "& .MuiInputLabel-root.MuiInputLabel-shrink": {
                            color: "primary.main", //
                          },
                        }}
                        onChange={(e) => {
                          const newAddressHouseNumberStreet = e.target.value.trim();

                          const addressParts = [
                            carData?.addressCityProvince || "",
                            carData?.addressDistrict || "",
                            carData?.addressWard || "",
                            newAddressHouseNumberStreet || "",
                          ];

                          const formattedAddress = addressParts
                              .filter((part) => part.trim() !== "") //
                              .join(", "); //

                          dispatch(
                              setFetchedCarData({
                                ...carData,
                                addressHouseNumberStreet: e.target.value,
                                data: {
                                  ...carData.data,
                                  address: formattedAddress,
                                },
                              })
                          );

                          if (newAddressHouseNumberStreet) {
                            dispatch(
                                setErrors({ ...errors, addressHouseNumberStreet: "" })
                            ); // Xóa lỗi
                          }
                          if (!newAddressHouseNumberStreet) {
                            dispatch(
                                setErrors({
                                  ...errors,
                                  addressHouseNumberStreet:
                                      "Please enter your house number and street",
                                })
                            );
                          }
                        }}
                    />
                  </div>

                  <div>
                    <TextField
                        id="description"
                        required
                        placeholder="Description of your vehicle"
                        label="Description"
                        multiline
                        name="description"
                        error={!!errors.description}
                        helperText={errors.description}
                        value={carData?.data?.description}
                        onChange={(e) => {
                          dispatch(
                              setCar({ ...carData.data, description: e.target.value })
                          );
                          if (!e.target.value) {
                            dispatch(
                                setErrors({
                                  ...errors,
                                  description:
                                      "Please enter a description of your vehicle",
                                })
                            );
                          }
                          if (e.target.value) {
                            dispatch(setErrors({ ...errors, description: "" })); // delete error
                          }
                        }}
                        rows={4}
                        sx={{
                          "& .MuiInputLabel-root": {
                            fontSize: "18px",
                            fontWeight: "bold",
                          },
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: "primary.main", //
                          },
                          "& .MuiInputLabel-root.MuiInputLabel-shrink": {
                            color: "primary.main", //
                          },
                        }}
                        variant="standard"
                        style={{ marginTop: "50px", backgroundColor: "white" }}
                    />
                  </div>
                </div>

                <Typography
                    variant="h6"
                    sx={{ marginLeft: "10%", marginTop: "20px" }}
                >
                  Additional functions:
                </Typography>

                <Box display="flex" gap={2} flexWrap="wrap" justifyContent="center">
                  <FormGroup
                      style={{
                        backgroundColor: "white",
                        padding: "20px",
                        width: "220px",
                      }}
                  >
                    <FormControlLabel
                        control={
                          <Checkbox
                              checked={carData.additionalFunctions.Bluetooth}
                              onChange={handleChange}
                              name="Bluetooth"
                          />
                        }
                        id="bluetooth"
                        label={
                          <Box display={"flex"} gap={1}>
                            <Bluetooth />
                            <Typography>Bluetooth</Typography>
                          </Box>
                        }
                    />
                    <FormControlLabel
                        control={
                          <Checkbox
                              checked={carData.additionalFunctions.GPS}
                              onChange={handleChange}
                              name="GPS"
                          />
                        }
                        id="gps"
                        label={
                          <Box display={"flex"} gap={1}>
                            <GpsFixed />
                            <Typography>GPS</Typography>
                          </Box>
                        }
                    />
                    <FormControlLabel
                        control={
                          <Checkbox
                              checked={carData.additionalFunctions.Camera}
                              onChange={handleChange}
                              name="Camera"
                          />
                        }
                        id="camera"
                        label={
                          <Box display={"flex"} gap={1}>
                            <CameraAlt />
                            <Typography>Camera</Typography>
                          </Box>
                        }
                    />
                  </FormGroup>

                  <FormGroup
                      style={{
                        backgroundColor: "white",
                        padding: "20px",
                        width: "220px",
                      }}
                  >
                    <FormControlLabel
                        control={
                          <Checkbox
                              checked={carData.additionalFunctions.SunRoof}
                              onChange={handleChange}
                              name="SunRoof"
                          />
                        }
                        id="sunroof"
                        label={
                          <Box display={"flex"} gap={1}>
                            <WbSunny />
                            <Typography>Sun roof</Typography>
                          </Box>
                        }
                    />
                    <FormControlLabel
                        control={
                          <Checkbox
                              checked={carData.additionalFunctions.ChildLock}
                              onChange={handleChange}
                              name="ChildLock"
                          />
                        }
                        id="childlock"
                        label={
                          <Box display={"flex"} gap={1}>
                            <Lock />
                            <Typography>Child lock</Typography>
                          </Box>
                        }
                    />
                    <FormControlLabel
                        control={
                          <Checkbox
                              checked={carData.additionalFunctions.ChildSeat}
                              onChange={handleChange}
                              name="ChildSeat"
                          />
                        }
                        id="childseat"
                        label={
                          <Box display={"flex"} gap={1}>
                            <ChildCare />
                            <Typography>Child lock</Typography>
                          </Box>
                        }
                    />
                  </FormGroup>

                  <FormGroup
                      style={{
                        backgroundColor: "white",
                        padding: "20px",
                        width: "220px",
                      }}
                  >
                    <FormControlLabel
                        control={
                          <Checkbox
                              checked={carData.additionalFunctions.DVD}
                              onChange={handleChange}
                              name="DVD"
                          />
                        }
                        id="dvd"
                        label={
                          <Box display={"flex"} gap={1}>
                            <Dvr />
                            <Typography>DVD</Typography>
                          </Box>
                        }
                    />
                    <FormControlLabel
                        control={
                          <Checkbox
                              checked={carData.additionalFunctions.USB}
                              onChange={handleChange}
                              name="USB"
                          />
                        }
                        id="usb"
                        label={
                          <Box display={"flex"} gap={1}>
                            <Usb />
                            <Typography>USB</Typography>
                          </Box>
                        }
                    />
                  </FormGroup>
                </Box>

                <div style={{ marginLeft: "10%", marginTop: "20px" }}>
                  <Typography variant="h6">
                    Images: <span style={{ color: "red" }}>*</span>
                  </Typography>
                </div>

                <div
                    style={{
                      display: "flex",
                      gap: "100px",
                      marginBottom: "30px",
                      marginLeft: "20%",
                    }}
                >
                  <div>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: "bold",
                            fontSize: "18px",
                            color: imagePreviews.carImageFront
                                ? "rgb(25, 118, 210)"
                                : "rgba(0, 0, 0, 0.6)",
                          }}
                      >
                        Front:
                      </Typography>
                      <Typography
                          variant="subtitle1"
                          sx={{ color: "red", ml: 0.5 }}
                      >
                        *
                      </Typography>
                    </Box>
                    {imagePreviews.carImageFront ? (
                        <div style={{ position: "relative" }}>
                          <img
                              src={imagePreviews.carImageFront}
                              alt="Car Front Preview"
                              style={{
                                width: "300px",
                                height: "250px",
                                objectFit: "cover",
                                borderRadius: "8px",
                              }}
                          />

                          <IconButton
                              id="deleteCarImageFront"
                              onClick={() => {
                                handleDeleteImage("carImageFront");
                                dispatch(
                                    setErrors({
                                      ...errors,
                                      carImageFront: "Please select an image",
                                    })
                                );
                              }}
                              sx={{
                                position: "absolute",
                                top: 5,
                                right: 5,
                                background: "rgba(0,0,0,0.5)",
                                color: "white",
                                "&:hover": { background: "rgba(0,0,0,0.8)" },
                              }}
                          >
                            <CloseIcon />
                          </IconButton>
                        </div>
                    ) : (
                        <Box {...dropzoneImageFront.getRootProps()} sx={styles}>
                          <input
                              {...dropzoneImageFront.getInputProps()}
                              id="carImageFront"
                          />
                          <CloudUploadIcon sx={{ fontSize: 40, color: "#555" }} />
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            Drag and drop OR
                          </Typography>
                          <Link
                              component="button"
                              variant="body2"
                              sx={{ color: "blue" }}
                          >
                            Select file
                          </Link>
                        </Box>
                    )}

                    {errors.carImageFront && (
                        <Alert severity="error" id="carImageFrontError">
                          {errors.carImageFront}
                        </Alert>
                    )}
                  </div>

                  <div>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: "bold",
                            fontSize: "18px",
                            color: imagePreviews.carImageBack
                                ? "rgb(25, 118, 210)"
                                : "rgba(0, 0, 0, 0.6)",
                          }}
                      >
                        Back:
                      </Typography>
                      <Typography
                          variant="subtitle1"
                          sx={{ color: "red", ml: 0.5 }}
                      >
                        *
                      </Typography>
                    </Box>
                    {imagePreviews.carImageBack ? (
                        <div style={{ position: "relative" }}>
                          <img
                              src={imagePreviews.carImageBack}
                              alt="Car Front Preview"
                              style={{
                                width: "300px",
                                height: "250px",
                                objectFit: "cover",
                                borderRadius: "8px",
                              }}
                          />

                          <IconButton
                              id="deleteCarImageBack"
                              onClick={() => {
                                handleDeleteImage("carImageBack");
                                dispatch(
                                    setErrors({
                                      ...errors,
                                      carImageBack: "Please select an image",
                                    })
                                );
                              }}
                              sx={{
                                position: "absolute",
                                top: 5,
                                right: 5,
                                background: "rgba(0,0,0,0.5)",
                                color: "white",
                                "&:hover": { background: "rgba(0,0,0,0.8)" },
                              }}
                          >
                            <CloseIcon />
                          </IconButton>
                        </div>
                    ) : (
                        <Box {...dropzoneImageBack.getRootProps()} sx={styles}>
                          <input
                              {...dropzoneImageBack.getInputProps()}
                              id="carImageBack"
                          />
                          <CloudUploadIcon sx={{ fontSize: 40, color: "#555" }} />
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            Drag and drop OR
                          </Typography>
                          <Link
                              component="button"
                              variant="body2"
                              sx={{ color: "blue" }}
                          >
                            Select file
                          </Link>
                        </Box>
                    )}
                    {errors.carImageBack && (
                        <Alert severity="error" id="carImageBackError">
                          {errors.carImageBack}
                        </Alert>
                    )}
                  </div>
                </div>

                <div style={{ display: "flex", gap: "100px", marginLeft: "20%" }}>
                  <div>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: "bold",
                            fontSize: "18px",
                            color: imagePreviews.carImageLeft
                                ? "rgb(25, 118, 210)"
                                : "rgba(0, 0, 0, 0.6)",
                          }}
                      >
                        Left:
                      </Typography>
                      <Typography
                          variant="subtitle1"
                          sx={{ color: "red", ml: 0.5 }}
                      >
                        *
                      </Typography>
                    </Box>
                    {imagePreviews.carImageLeft ? (
                        <div style={{ position: "relative" }}>
                          <img
                              src={imagePreviews.carImageLeft}
                              alt="Car Front Preview"
                              style={{
                                width: "300px",
                                height: "250px",
                                objectFit: "cover",
                                borderRadius: "8px",
                              }}
                          />

                          <IconButton
                              id="deleteCarImageLeft"
                              onClick={() => {
                                handleDeleteImage("carImageLeft");
                                dispatch(
                                    setErrors({
                                      ...errors,
                                      carImageLeft: "Please select an image",
                                    })
                                );
                              }}
                              sx={{
                                position: "absolute",
                                top: 5,
                                right: 5,
                                background: "rgba(0,0,0,0.5)",
                                color: "white",
                                "&:hover": { background: "rgba(0,0,0,0.8)" },
                              }}
                          >
                            <CloseIcon />
                          </IconButton>
                        </div>
                    ) : (
                        <Box {...dropzoneImageLeft.getRootProps()} sx={styles}>
                          <input
                              {...dropzoneImageLeft.getInputProps()}
                              id="carImageLeft"
                          />
                          <CloudUploadIcon sx={{ fontSize: 40, color: "#555" }} />
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            Drag and drop OR
                          </Typography>
                          <Link
                              component="button"
                              variant="body2"
                              sx={{ color: "blue" }}
                          >
                            Select file
                          </Link>
                        </Box>
                    )}
                    {errors.carImageLeft && (
                        <Alert severity="error" id="carImageLeftError">
                          {errors.carImageLeft}
                        </Alert>
                    )}
                  </div>

                  <div>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: "bold",
                            fontSize: "18px",
                            color: imagePreviews.carImageRight
                                ? "rgb(25, 118, 210)"
                                : "rgba(0, 0, 0, 0.6)",
                          }}
                      >
                        Right:
                      </Typography>
                      <Typography
                          variant="subtitle1"
                          sx={{ color: "red", ml: 0.5 }}
                      >
                        *
                      </Typography>
                    </Box>
                    {imagePreviews.carImageRight ? (
                        <div style={{ position: "relative" }}>
                          <img
                              src={imagePreviews.carImageRight}
                              alt="Car Front Preview"
                              style={{
                                width: "300px",
                                height: "250px",
                                objectFit: "cover",
                                borderRadius: "8px",
                              }}
                          />

                          <IconButton
                              id="deleteCarImageRight"
                              onClick={() => {
                                handleDeleteImage("carImageRight");
                                dispatch(
                                    setErrors({
                                      ...errors,
                                      carImageRight: "Please select an image",
                                    })
                                );
                              }}
                              sx={{
                                position: "absolute",
                                top: 5,
                                right: 5,
                                background: "rgba(0,0,0,0.5)",
                                color: "white",
                                "&:hover": { background: "rgba(0,0,0,0.8)" },
                              }}
                          >
                            <CloseIcon />
                          </IconButton>
                        </div>
                    ) : (
                        <Box {...dropzoneImageRight.getRootProps()} sx={styles}>
                          <input
                              {...dropzoneImageRight.getInputProps()}
                              id="carImageRight"
                          />
                          <CloudUploadIcon sx={{ fontSize: 40, color: "#555" }} />
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            Drag and drop OR
                          </Typography>
                          <Link
                              component="button"
                              variant="body2"
                              sx={{ color: "blue" }}
                          >
                            Select file
                          </Link>
                        </Box>
                    )}
                    {errors.carImageRight && (
                        <Alert severity="error" id="carImageRightError">
                          {errors.carImageRight}
                        </Alert>
                    )}
                  </div>
                </div>

                <Typography
                    variant="body1"
                    sx={{ marginLeft: "10%", marginTop: "20px" }}
                >
                  Please include full 4 images of your vehicle <br></br>
                  File type: .jpg, .jpeg, .png, .gif
                </Typography>
                <Button
                    variant="contained"
                    id="save"
                    sx={{ marginLeft: "46%" }}
                    style={{ backgroundColor: "#00bfa5" }}
                    onClick={async () => {
                      dispatch(checkErrors());
                      setTimeout(async () => {
                        if (
                            Object.keys(store.getState().carFetch.errors).length === 0
                        ) {
                          setLoading(true); // turn loading on

                          try {
                            await dispatch(updateCar()).unwrap(); // wait for the updateCar action to complete
                          } finally {
                            setLoading(false); // turn loading off
                          }
                        }
                      }, 0);
                    }}
                >
                  {loading ? "Saving..." : "Save"} {/* change the button text */}
                </Button>
              </Box>
            </Box>
        ) : (
            <Skeleton variant="rectangular" width={400} height={300} />
        )}
      </>
  );
}
