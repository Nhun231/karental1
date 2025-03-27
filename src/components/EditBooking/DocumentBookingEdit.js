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
import { useSelector } from "react-redux";

const DocumentBookingEdit = () => {
  // const dispatch = useDispatch();
  const { carData = {} } = useSelector((state) => state.carFetch);

  const documents = [
    {
      no: 1,
      name: "Registration Paper",
      uri: carData?.data?.registrationPaperUrl,
      isVerified: carData?.data?.registrationPaperIsVerified,
      link: carData?.data?.registrationPaperUrl,
    },
    {
      no: 2,
      name: "Certificate of Inspection",
      uri: carData?.data?.certificateOfInspectionUrl,
      isVerified: carData?.data?.certificateOfInspectionUriIsVerified,
      link: carData?.data?.certificateOfInspectionUrl,
    },
    {
      no: 3,
      name: "Insurance",
      uri: carData?.data?.insuranceUrl,
      isVerified: carData?.data?.insuranceUriIsVerified,
      link: carData?.data?.insuranceUrl,
    },
  ];

  return (
    <TableContainer component={Paper} sx={{ mt: 2, width: "100%", p: 2, boxShadow: 3 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>No</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Note</TableCell>
            <TableCell>Link</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {documents.map((doc, index) => (
            <TableRow
              key={doc.no}
              sx={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff" }}
            >
              <TableCell>{doc.no}</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>{doc.name}</TableCell>
              <TableCell>
                {doc.isVerified ? (
                  <Typography component={"span"} sx={{ color: "green", fontSize: "16px" }}>Verified</Typography>
                ) : (
                  <Box
                    component="span"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <Typography component={"span"} sx={{ color: "red", fontSize: "16px" }}>Not Verified</Typography>
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DocumentBookingEdit;
