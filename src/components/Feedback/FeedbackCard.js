import React, { useState } from "react";
import { Card, CardContent, CardMedia, Typography, Box, Button } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import dayjs from "dayjs";
import PersonIcon from "@mui/icons-material/Person";

const MAX_LENGTH = 250; // Limit character display

/**
 * Feedback Component
 * Displays details of an feedback.
 */

const FeedbackCard = ({ feedbackData, img }) => {
    const [expanded, setExpanded] = useState(false);
    const handleToggle = () => setExpanded(!expanded);

    // Define display text depend on state expanded
    const displayText = expanded || feedbackData.comment.length <= MAX_LENGTH
        ? feedbackData.comment
        : feedbackData.comment.slice(0, MAX_LENGTH) + "...";

    return (
        <Card sx={{ boxShadow: "none", my: 2 }} id="feedback-item" data-feedback-id={feedbackData.bookingId || ""} data-rating={feedbackData.rating || 0}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                {/* Reviewer Name */}
                <Box display="flex" alignItems="center" gap={1}>
                    <PersonIcon sx={{ fontSize: 30 }} />
                    <Typography variant="subtitle1" fontWeight="bold">
                        {feedbackData.reviewerName}
                    </Typography>
                </Box>
                {/* Rating & Time */}
                <Box textAlign="right">
                    <Box display="flex" color="#FFD700">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <StarIcon key={index} sx={{ fontSize: 30 }} color={index < feedbackData.rating ? "inherit" : "disabled"} />
                        ))}
                    </Box>
                    <Typography variant="subtitle1" color="text.secondary">
                        {dayjs(feedbackData.createdAt).format("DD/MM/YYYY HH:mm")}
                    </Typography>
                </Box>
            </Box>

            {/* Feedback Content */}
            <CardContent>
                <Typography variant="body2" color="text.secondary" mb={1.5}>
                    {displayText}
                </Typography>
                {feedbackData.comment.length > MAX_LENGTH && (
                    <Button size="small" onClick={handleToggle} sx={{ textTransform: "none", color: "#05ce80" }}>
                        {expanded ? "See Less" : "See More"}
                    </Button>
                )}

                <Box display="flex" gap={5} mt={2}>
                    {/* Car Image */}
                    <CardMedia
                        component="img"
                        image={feedbackData.carImageFrontUrl || img}
                        alt="Car Image"
                        sx={{ width: 250, height: 150, borderRadius: 1, border: "1px solid #ddd" }}
                    />
                    {/* Car & Booking Information*/}
                    <Box>
                        <Typography variant="h6" fontWeight="bold" mb={1.5} sx={{ letterSpacing: "0.9px", lineHeight: "1.6" }}>
                            {feedbackData.brand} {feedbackData.model} {feedbackData.year}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mb={1.5} sx={{ letterSpacing: "0.9px", lineHeight: "1.6" }}>
                            • From: {dayjs(feedbackData.pickUpTime).format("DD/MM/YYYY - HH:mm A")}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ letterSpacing: "0.9px", lineHeight: "1.6" }}>
                            • To: {dayjs(feedbackData.dropOffTime).format("DD/MM/YYYY - HH:mm A")}
                        </Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default FeedbackCard;
