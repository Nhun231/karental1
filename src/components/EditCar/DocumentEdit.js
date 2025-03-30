import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import {
  setCar,
  setErrors,
  toggleUse,
  checkErrors,
} from "../../reducers/carFetchReducer";
import { saveFileToDB } from "../../Helper/indexedDBHelper";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const DocumentEdit = () => {
  const dispatch = useDispatch();
  const { carData = {}, errors = {} } = useSelector((state) => state.carFetch);

  const documents = [
    {
      no: 1,
      name: "Registration Paper",
      uri: carData?.data?.registrationPaperUrl,
      isVerified: carData?.data?.registrationPaperUriIsVerified,
      link: carData?.data?.registrationPaperUrl,
      action: "registrationPaper",
    },
    {
      no: 2,
      name: "Certificate of Inspection",
      uri: carData?.data?.certificateOfInspectionUrl,
      isVerified: carData?.data?.certificateOfInspectionUriIsVerified,
      link: carData?.data?.certificateOfInspectionUrl,
      action: "certificateOfInspection",
    },
    {
      no: 3,
      name: "Insurance",
      uri: carData?.data?.insuranceUrl,
      isVerified: carData?.data?.insuranceUriIsVerified,
      link: carData?.data?.insuranceUrl,
      action: "insurance",
    },
  ];

  // check file
  const allowedExtensions = [".doc", ".docx", ".pdf", ".jpg", ".jpeg", ".png"];

  const handleError = (errorType, message) => {
    // Updates the Redux store with a new error message for the specified error type
    dispatch(setErrors({ ...errors, [errorType]: message }));
  };

  const handleFile = (fileType, errorType) => async (event) => {
    handleError(errorType, ""); // Clears any previous error message

    const files = Array.from(event.target.files); // Chuyển FileList thành mảng
    if (files.length === 0) {
      handleError(errorType, "No file selected.");
      return;
    }

    const validFile = files.find((file) => {
      const fileExt = file.name
        .substring(file.name.lastIndexOf("."))
        .toLowerCase();
      return allowedExtensions.includes(fileExt);
    });

    if (validFile) {
      await saveFileToDB(fileType, validFile); // Save the file to IndexedDB
    } else {
      const errorMessage = files.some((file) => file.size > MAX_FILE_SIZE)
        ? "File size must be less than 5MB."
        : "Invalid file type! Only .doc, .docx, .pdf, .jpg, .jpeg, .png are allowed.";
      handleError(errorType, errorMessage); // Set error message
    }
  };

  return (
    <TableContainer component={Paper} sx={{ mt: 2, width: "100%", p: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                No
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                Name
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                Note
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                Link
              </Typography>
            </TableCell>
            {carData?.data?.status === "NOT_VERIFIED" && (
              <TableCell>
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  Action
                </Typography>
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {documents.map((doc, index) => (
            <TableRow
              key={doc.no}
              sx={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff" }}
            >
              <TableCell>
                <Typography variant="body1">{doc.no}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1">{doc.name}</Typography>
              </TableCell>
              <TableCell>
                {doc.isVerified ? (
                  <Typography component={"span"}>Verified</Typography>
                ) : (
                  <Box
                    component="span"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <Typography variant="body1">Not Verified</Typography>
                  </Box>
                )}
              </TableCell>
              <TableCell>
                <a
                  href={doc.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#007BFF", textDecoration: "underline" }}
                >
                  View Document
                </a>
              </TableCell>
              {(carData?.data?.status === "NOT_VERIFIED" ||
                carData?.data?.status === "STOPPED") && (
                <TableCell>
                  <input
                    type="file"
                    multiple
                    onChange={handleFile(doc.action, doc.action)}
                  />
                  {errors[doc.action] && (
                    <Typography variant="body2" color="error">
                      {errors[doc.action]}
                    </Typography>
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DocumentEdit;
