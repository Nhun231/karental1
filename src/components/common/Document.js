import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from "@mui/material";

const Documents = ({ CarData }) => {
    const documents = [
        { no: 1, name: "Registration Paper", uri: CarData.registrationPaperUrl, isVerified: CarData.registrationPaperUriIsVerified },
        { no: 2, name: "Certificate of Inspection", uri: CarData.certificateOfInspectionUrl, isVerified: CarData.certificateOfInspectionUriIsVerified },
        { no: 3, name: "Insurance", uri: CarData.insuranceUrl, isVerified: CarData.insuranceUriIsVerified },
    ];
    return (
        <TableContainer component={Paper} sx={{ mt: 2, width: "100%", p: 1 }}>
            <Table>
                <TableHead>
                    <TableRow >
                        <TableCell>No</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Note</TableCell>
                        {localStorage.getItem("role") === "CAR_OWNER" && <TableCell>Link</TableCell>}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {documents.map((doc, index) => (
                        <TableRow key={doc.no} sx={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff" }}
                        >
                            <TableCell>{doc.no}</TableCell>
                            <TableCell>{doc.name}</TableCell>
                            <TableCell>
                                {CarData.status === "BOOKED" ? (
                                    <a href={doc.uri} target="_blank" rel="noopener noreferrer" style={{ color: "#007BFF", textDecoration: "underline" }}>
                                        View Document
                                    </a>
                                ) : doc.isVerified ? (
                                    "Verified"
                                ) : (
                                    "Not available"
                                )}
                            </TableCell>
                            {localStorage.getItem("role") === "CAR_OWNER" && <TableCell>{doc.isVerified ? <a href={doc.uri} target="_blank" rel="noopener noreferrer" style={{ color: "#007BFF", textDecoration: "underline" }}>

                            </a> : "Not available"}
                            </TableCell>}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {/* Note */}
            {CarData.booked !== true && localStorage.getItem("role") !== "CAR_OWNER" && (
                <Box sx={{ mt: 2, p: 1, backgroundColor: "#FFF3CD", borderRadius: "8px", color: "#856404", textAlign: "center", fontSize: "10px" }}>
                    Note: Documents will be available for viewing after you've paid the deposit to rent.
                </Box>
            )}
        </TableContainer>
    );
};

export default Documents;
