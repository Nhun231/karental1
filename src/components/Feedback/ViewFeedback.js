import React from "react";
import { Modal, Box, Typography, Rating, Button } from "@mui/material";

const FeedbackModal = ({ open, onClose, feedback }) => {
    return (
        <Modal id="view-feedback-modal" open={open} onClose={onClose}>
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
                    textAlign: "center",
                    alignItems: "center",
                    maxHeight: "60vh", // Scroll when content is long
                    overflowY: "auto"
                }}
            >
                <Typography variant="h6">Your Feedback</Typography>

                {!feedback ? (
                    <Box>
                        <Typography variant="body1" sx={{ mt: 2 }}>
                            No feedback available.
                        </Typography>
                    </Box>
                ) : (
                    <>
                        <Typography variant="body2" color="textSecondary">
                            Create Date: {new Date(feedback.createdAt).toLocaleDateString()}
                        </Typography>
                        <Rating value={feedback.rating} readOnly sx={{ mt: 1, alignSelf: "center" }} />
                        <Typography
                            variant="body2"
                            sx={{
                                mt: 1,
                                px: 2,
                                textAlign: "justify", // Justify text for better readability
                                whiteSpace: "pre-wrap" // Preserve formatting
                            }}
                        >
                            {feedback.comment}
                        </Typography>
                    </>
                )}

                {/* Close modal */}
                <Button onClick={onClose} variant="contained" sx={{ mt: 2, width: "30%" }}>
                    Close
                </Button>
            </Box>
        </Modal>
    );
};

export default FeedbackModal;
