import { useState } from "react";
import FeedbackCard from "../Feedback/FeedbackCard";
import { Divider, Button, Box } from "@mui/joy";

const FeedbackList = ({ feedbackList, img }) => {
    // Check if this is the "Load More" page (determined by the presence of an image)
    const isLoadMorePage = !!img;
    // State to track the number of feedbacks currently displayed
    const [visibleCount, setVisibleCount] = useState(3);

    // Slice the feedback list based on the number of visible feedbacks
    const visibleFeedbacks = isLoadMorePage ? feedbackList.slice(0, visibleCount) : feedbackList;

    return (
        <>
            {visibleFeedbacks.map((feedback, index) => (
                <div key={index}>
                    <FeedbackCard feedbackData={feedback} img={img} />
                    <Divider />
                </div>
            ))}
            {isLoadMorePage && (
                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2 }}>
                    {visibleCount < feedbackList.length && (
                        <Button onClick={() => setVisibleCount(prev => prev + 3)} variant="outlined" sx={{ mt: 1, borderColor: "#05ce80", color: "#05ce80" }} >
                            Load More
                        </Button>
                    )}
                    {visibleCount > 3 && (
                        <Button onClick={() => setVisibleCount(3)} variant="outlined">
                            Collapse
                        </Button>
                    )}
                </Box>
            )}
        </>
    );
};

export default FeedbackList;
