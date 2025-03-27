import React, { useState, useEffect } from "react";
import {
    Modal,
    Box,
    Typography,
    Rating,
    TextField,
    Button,
} from "@mui/material";
import { sendFeedback } from "../../services/FeedbackServices";
import NotificationSnackbar from "../common/NotificationSnackbar";
const RatingModal = ({ open, onClose, onSubmit, bookingDate, hasReviewed, bookingId }) => {
    // State store variable of rating
    const [rating, setRating] = useState(0);
    // State store the review
    const [review, setReview] = useState("");
    // State to track whether the time to feedback has expired  
    const [isExpired, setIsExpired] = useState(false);
    // State to track whether the user has submitted a feedback
    const [isReviewed, setIsReviewed] = useState(hasReviewed);
    // State to store alert message
    const [alert, setAlert] = useState({ open: false, severity: "", message: "" });
    useEffect(() => {
        if (bookingDate) {
            const completedDate = new Date(bookingDate);
            const now = new Date();
            const diffInDays = (now - completedDate) / (1000 * 60 * 60 * 24);
            setIsExpired(diffInDays > 30);
            // Set isExpired to true if the booking was completed more than 30 days ago
            // This prevents users from leaving feedback after 30 days
        }
    }, [bookingDate]);

    const handleSubmit = async () => {
        try {
            // Send feedback data to API
            await sendFeedback({
                bookingId,
                rating,
                comment: review.trim()
            });

            // Set alert message
            setAlert({ open: true, severity: "success", message: "Feedback submitted successfully!" });
            // Call the onSubmit callback to update the UI or state after successful submission 
            // User can't open the modal after send feedback successfully
            setTimeout(() => {
                onSubmit({ rating, review });
                onClose();
            }, 1000);
        } catch (error) {
            console.error("Error submitting feedback:", error);
            setAlert({ open: true, severity: "error", message: "Failed to submit feedback!" });
        }
    };
    return (
        <>
            <Modal id="feedback-modal" open={open} onClose={onClose}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                    }}
                >
                    <Typography variant="h6" align="center">
                        Rate your trip
                    </Typography>

                    {isExpired ? (
                        <Typography color="error" align="center">
                            Feedback period expired (30 days limit).
                        </Typography>
                    ) : isReviewed ? (
                        <Typography color="textSecondary" align="center">
                            You have already submitted your review.
                        </Typography>
                    ) : (
                        <>
                            <Typography variant="body2" align="center">
                                Do you enjoy your trip? Please let us know what you think.
                            </Typography>

                            <Rating
                                name="trip-rating"
                                value={rating}
                                onChange={(event, newValue) => setRating(newValue)}
                                size="large"
                            />

                            <TextField
                                id="feedback-comment"
                                multiline
                                rows={3}
                                fullWidth
                                variant="outlined"
                                placeholder="Write your review..."
                                value={review}
                                // User can't input the review with length>250
                                onChange={(e) => setReview(e.target.value.slice(0, 2000))}
                                helperText={`${review.length}/2000`}
                                disabled={isReviewed}
                            />

                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                {/* Close modal if user want to skip */}
                                <Button id="skip-feedback" onClick={onClose} variant="outlined">
                                    Skip
                                </Button>
                                {/* Prevent user submit if rating = 0 */}
                                <Button
                                    id="send-review"
                                    onClick={handleSubmit}
                                    variant="contained"
                                    disabled={rating === 0 || isReviewed}
                                    sx={{ backgroundColor: "#05ce80" }}
                                >
                                    Send Review
                                </Button>
                            </Box>
                        </>
                    )}
                </Box>

            </Modal>
            <NotificationSnackbar alert={alert} onClose={() => setAlert({ ...alert, open: false })} />
        </>
    );
};

export default RatingModal;
