import Layout from "../components/common/Layout"
import { useSearchParams } from "react-router-dom";
import {
    Link,
    Typography,
    Button,
    Grid,
    Box,
    Divider,
    Modal,
    Paper,
    IconButton
} from "@mui/material";
import PaginationComponent from "../components/common/Pagination";
import { useEffect, useState } from "react";
import { getAllCars, getCarDocuments, verifyCar } from "../services/CarServices";
import Filters from "../components/common/Filter";
import CarCard from "../components/common/CarCard";
import ConfirmationDialog from "../components/common/ConfirmationDialog";
import NotificationSnackbar from "../components/common/NotificationSnackbar";
import Documents from "../components/common/Document";
import CloseIcon from "@mui/icons-material/Close";
const ViewListAllCar = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [cars, setCars] = useState([]);
    const [documents, setDocuments] = useState(null);
    const [page, setPage] = useState(parseInt(searchParams.get("page")) || 1);
    const [pageSize, setPageSize] = useState(
        parseInt(searchParams.get("size")) || 10
    );
    const [totalPages, setTotalPages] = useState(1);
    const [sortOption, setSortOption] = useState("newest");
    const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "ALL");
    const [openConfirm, setOpenConfirm] = useState(false);
    const [selectedCar, setSelectedCar] = useState(null);
    const [alert, setAlert] = useState({ open: false, message: "", severity: "info" });
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const getSortQuery = (option) =>
    ({
        newest: "updateAt,DESC",
        oldest: "updateAt,ASC",
        priceHigh: "basePrice,DESC",
        priceLow: "basePrice,ASC",
    }[option] || "updateAt,DESC");
    const statusOptions = [
        "ALL",
        "VERIFIED",
        "NOT_VERIFIED",
        "STOPPED",
    ];
    const validStatuses = new Set(statusOptions.slice(1));
    useEffect(() => {
        const params = {
            page,
            size: pageSize,
            sort: getSortQuery(sortOption),
        };

        if (validStatuses.has(statusFilter)) {
            params.status = statusFilter;
        }

        setSearchParams(params);
    }, [sortOption, page, pageSize, statusFilter, setSearchParams]);

    const handleStatusChange = (car) => {
        setSelectedCar(car);
        setOpenConfirm(true);
    };
    const fetchAllCars = async () => {
        try {
            const params = {
                page: page - 1,
                size: pageSize,
                sort: getSortQuery(sortOption),
            };

            if (validStatuses.has(statusFilter)) {
                params.status = statusFilter;
            }
            const response = await getAllCars(params);
            setCars(response.data.content || []);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("Failed to fetch car data:", error);
        }
    };

    useEffect(() => {
        fetchAllCars();
    }, [page, pageSize, sortOption, statusFilter]);

    const confirmAction = async () => {
        if (!selectedCar) return;
        setLoading(true);
        try {
            console.log(selectedCar.id)
            await verifyCar(selectedCar.id);
            setAlert({ open: true, message: "Verify car successfully!", severity: "success" });
            fetchAllCars();
        } catch (error) {
            setAlert({ open: true, message: error.response?.data?.message || "Failed to verify", severity: "error" });
        }
        setLoading(false);
        setOpenConfirm(false);
    };

    const handleViewDetails = async (car) => {
        try {
            const documents = await getCarDocuments(car.id);
            setDocuments(documents.data);
            setOpenModal(true);
        } catch (error) {
            console.error("Failed to fetch car documents:", error);
        }
    };
    useEffect(() => {
        document.title = 'View List All Cars';
      }, []); 
    return (
        <>
            <Box sx={{ maxWidth: "1200px", mx: "auto", mt: 2 }}>
                {/* Page title */}
                <Typography variant="h4" fontWeight="bold" sx={{ textAlign: "center", p: 2 }}>List All Cars</Typography>
                {/* Page content */}
                <Box
                    sx={{
                        my: 4,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "end",
                    }}
                >
                    <Filters sortOption={sortOption} setSortOption={setSortOption} statusFilter={statusFilter} setStatusFilter={setStatusFilter} statusOptions={statusOptions} />
                </Box>
                {/* List of Cars */}
                <Grid
                    item
                    xs={12}
                    className="border-box"
                    sx={{ p: 3 }}
                >
                    {cars.length === 0 ? (
                        <Typography
                            variant="h6"
                            sx={{ textAlign: "center", my: 4, color: "gray" }}
                        >
                            No cars available.
                        </Typography>
                    ) : (
                        <Grid container direction="column" spacing={3}>
                            {cars.map((car) => (
                                <Grid
                                    item
                                    xs={12}
                                    key={car.id}
                                >
                                    <Grid container spacing={2} alignItems="stretch">
                                        <Grid item xs={10} >
                                            <CarCard carData={car} isEditPage="true" onStatusChange={() => handleStatusChange(car)} />
                                        </Grid>
                                        <Grid
                                            item
                                            xs={2}
                                            container
                                            direction="column"
                                            spacing={2}
                                            alignItems="flex-end"
                                            sx={{
                                                height: "100%",
                                                justifyContent: "space-between",
                                                marginTop: "40px",
                                            }}
                                        >
                                            <Button
                                                variant="contained"
                                                sx={{
                                                    backgroundColor: "#1976d2",
                                                    color: "white",
                                                    "&:hover": { backgroundColor: "#1565c0" },
                                                    width: "80%",
                                                    paddingY: 0.5,
                                                    paddingX: 2,
                                                    fontSize: "0.8rem",
                                                    height: "auto",
                                                    mb: 2,
                                                }}
                                                onClick={() => handleViewDetails(car)}
                                            >
                                                View details
                                            </Button>
                                        </Grid>
                                    </Grid>
                                    <Divider sx={{ mt: 2 }} />
                                </Grid>
                            ))}
                            <ConfirmationDialog
                                open={openConfirm}
                                onClose={() => setOpenConfirm(false)}
                                onConfirm={confirmAction}
                                title="Confirm Action"
                                content="Are you sure you want to update status for this car?"
                                loading={loading}
                            />

                            <NotificationSnackbar alert={alert} onClose={() => setAlert({ ...alert, open: false })} />
                        </Grid>
                    )}
                    {/* Pagination */}
                    <PaginationComponent
                        page={page - 1}
                        totalPages={totalPages}
                        onPageChange={(newPage) => setPage(newPage + 1)}
                        pageSize={pageSize}
                        onPageSizeChange={(size) => {
                            setPageSize(size);
                            setPage(1);
                        }}
                    />
                </Grid>
                <DocumentsModal open={openModal} onClose={() => setOpenModal(false)} carData={documents} />
            </Box >
        </>
    )
}
const DocumentsModal = ({ open, onClose, carData }) => {
    return (
        <Modal open={open} onClose={onClose} aria-labelledby="documents-modal">
            <Paper sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 800, p: 3 }}>
                <Typography variant="h6" id="documents-modal">Car Documents</Typography>
                <IconButton
                    onClick={onClose}
                    sx={{ position: "absolute", top: 8, right: 8, color: "gray" }}
                >
                    <CloseIcon />
                </IconButton>
                {carData ? <Documents CarData={carData} /> : <Typography>No data available.</Typography>}
            </Paper>
        </Modal>
    );
};

export default ViewListAllCar;