import { useEffect, useState } from "react";
import Layout from "../components/common/Layout";
import { useSearchParams } from "react-router-dom";
import { getFeedbackByCarOwner, getAverageRating, getFeedbackByCustomer } from "../services/FeedbackServices";
import { Button, Box, Rating, Typography, Breadcrumbs, Link } from "@mui/material";
import Pagination from "../components/common/Pagination";
import { Divider } from "@mui/joy";
import FeedbackList from "../components/CarDetails/FeedbackList";
const MyFeedback = () => {
    const [feedbackList, setFeedbackList] = useState(null);
    const [averageRating, setAverageRating] = useState(0);
    const [searchParams, setSearchParams] = useSearchParams();
    const [page, setPage] = useState(parseInt(searchParams.get("page")) || 1);
    const [pageSize, setPageSize] = useState(parseInt(searchParams.get("size")) || 10);
    const [totalPages, setTotalPages] = useState(1);

    // Get role
    const role = localStorage.getItem("role");

    // State handle rating filter
    const [ratingFilter, setRatingFilter] = useState(parseInt(searchParams.get("ratingFilter")) || 0);

    // State handle rating option
    const [ratingOptions, setRatingOptions] = useState([
        { label: "All", value: 0, count: 0 },
        { label: "5 Stars", value: 5, count: 0 },
        { label: "4 Stars", value: 4, count: 0 },
        { label: "3 Stars", value: 3, count: 0 },
        { label: "2 Stars", value: 2, count: 0 },
        { label: "1 Star", value: 1, count: 0 },
    ]);

    useEffect(() => {
        document.title = 'My Feedback';
    }, []);
    useEffect(() => {
        setSearchParams((prevParams) => {
            const newParams = {
                page,
                size: pageSize,
                ...(role === "CAR_OWNER" && { ratingFilter }),
            };
            return newParams;
        });
    }, [page, pageSize, ratingFilter, setSearchParams, role]);

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                if (role === "CAR_OWNER") {
                    const response = await getFeedbackByCarOwner({
                        ratingFilter: parseInt(searchParams.get("ratingFilter")) || 0,
                        page: parseInt(searchParams.get("page")) - 1 || 0,
                        size: parseInt(searchParams.get("size")) || 10,
                    });
                    setFeedbackList(response.data.feedbacks);
                    setTotalPages(response.data.totalPages);
                }
                else if (role === "CUSTOMER") {
                    const response = await getFeedbackByCustomer({
                        page: parseInt(searchParams.get("page")) - 1 || 0,
                        size: parseInt(searchParams.get("size")) || 10,
                    });
                    setFeedbackList(response.data.feedbacks);
                    setTotalPages(response.data.totalPages);
                }

            } catch (error) {
                console.error("Error fetching feedback:", error);
            }
        };
        fetchFeedback();
    }, [searchParams, role]);

    useEffect(() => {
        if (role === "CAR_OWNER") {
            const fetchAverageRating = async () => {
                try {
                    const response = await getAverageRating();
                    setAverageRating(response.data.averageRatingByOwner || 0);
                    const ratingCounts = response.data.ratingCounts || {};
                    setRatingOptions([
                        { label: "All", value: 0, count: Object.values(ratingCounts).reduce((acc, count) => acc + count, 0) },
                        { label: "5 Stars", value: 5, count: ratingCounts["5"] || 0 },
                        { label: "4 Stars", value: 4, count: ratingCounts["4"] || 0 },
                        { label: "3 Stars", value: 3, count: ratingCounts["3"] || 0 },
                        { label: "2 Stars", value: 2, count: ratingCounts["2"] || 0 },
                        { label: "1 Star", value: 1, count: ratingCounts["1"] || 0 },
                    ]);
                } catch (error) {
                    console.error("Error fetching average rating:", error);
                }
            };
            fetchAverageRating();
        }
    }, [role]);
    const handleFilterChange = (value) => {
        setRatingFilter(value);
        setSearchParams({ page: 1, size: pageSize, ratingFilter: value });
    };

    return (
        <Layout>
            <Box sx={{ maxWidth: "1200px", mx: "auto", my: 2 }}>
                <Breadcrumbs >
                    <Link underline="hover" color="inherit" href="/">
                        Home
                    </Link>
                    <Typography color="text.primary">My Feedback</Typography>
                </Breadcrumbs>
                <Typography variant="h4" fontWeight="bold" sx={{ textAlign: "center", p: 2 }}>My Feedback</Typography>
                <Box sx={{
                    border: "1px solid #ccc",
                    borderRadius: "6px",
                    p: 4,
                    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.3)"
                }}>
                    {localStorage.getItem("role") === "CAR_OWNER" && <Box>
                        {/* Average Ratings */}
                        <Typography variant="h6" fontWeight="bold" >Average Ratings</Typography>
                        <Box textAlign="center" sx={{ mb: 2, p: 4 }}>
                            <Typography variant="h4" fontWeight="bold">
                                {averageRating.toFixed(2)}
                            </Typography>
                            <Rating value={Math.ceil(averageRating * 2) / 2} precision={0.5} readOnly sx={{ fontSize: "40px" }} />
                        </Box>
                        {/* Rating Filter */}
                        <Typography variant="h6" fontWeight="bold" >Details</Typography>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: "8px", my: 2 }}>
                            {ratingOptions.map((option) => (
                                <Button
                                    key={option.value}
                                    onClick={() => handleFilterChange(option.value)}
                                    variant={ratingFilter === option.value ? "contained" : "outlined"}
                                    sx={{
                                        flex: "1 1 auto",
                                        minWidth: "120px",
                                        border: "1px solid #05ce80",
                                        borderRadius: "8px",
                                        color: ratingFilter === option.value ? "#fff" : "#05ce80",
                                        bgcolor: ratingFilter === option.value ? "#05ce80" : "transparent",
                                        "&:hover": {
                                            bgcolor: ratingFilter === option.value ? "#05ce80" : "#e0e0e0",
                                        },
                                    }}
                                >
                                    {option.label} ({option.count})
                                </Button>
                            ))}
                        </Box>
                        <Divider sx={{ width: "calc(100% + 64px)", mx: "-32px", my: 4 }} /></Box>}
                    {/* Feedback List */}
                    <Typography variant="h6" fontWeight="bold" sx={{ textAlign: "center" }}>Feedback List</Typography>
                    <Divider sx={{ width: "calc(100% + 64px)", mx: "-32px", my: 4 }} />
                    {feedbackList && feedbackList.length > 0 ? (
                        <FeedbackList feedbackList={feedbackList}></FeedbackList>
                    ) : (
                        <Box
                            sx={{
                                textAlign: "center",
                                p: 4,
                                bgcolor: "#f9f9f9",
                                borderRadius: "8px",
                                boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
                                height: "250px",
                                alignContent: "center"
                            }}
                        >
                            <Typography variant="h6" color="textSecondary">
                                No feedback available for this rating.
                            </Typography>
                            <img
                                src="https://img.icons8.com/?size=100&id=SfQftXEz2mXG&format=png&color=05ce80"
                                alt="No feedback"
                                width="200"
                                height="200"
                            />
                        </Box>
                    )}
                </Box>
                {/* Pagination */}
                <Pagination
                    page={page - 1}
                    totalPages={totalPages}
                    onPageChange={(newPage) => setPage(newPage + 1)}
                    pageSize={pageSize}
                    onPageSizeChange={(size) => {
                        setPageSize(size);
                        setPage(1);
                    }}
                />
            </Box>
        </Layout >
    )
}
export default MyFeedback;
