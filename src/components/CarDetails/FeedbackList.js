import { useState } from "react";
import FeedbackCard from "../Feedback/FeedbackCard";
import { Divider, Button, Box } from "@mui/joy";

const FeedbackList = ({ feedbackList, img }) => {
    /*
     * The feedback list in the 'Car Detail' page does not have an image of the car
     * So it needs to be passed down from the parent component.
     * Use img to distinguish it from the pagination display (which does not have a "Load More" button) on the 'My Feedback' page.
     */
    const isLoadMorePage = !!img;
    // Number of visible feedback
    const [visibleCount, setVisibleCount] = useState(3);
    const visibleFeedbacks = isLoadMorePage ? feedbackList.slice(0, visibleCount) : feedbackList;
    // Handle load more feedback
    const handleLoadMore = () => setVisibleCount(prev => prev + 3);
    // Handle collapse
    const handleCollapse = () => setVisibleCount(3);

    return (
        <>
            {/* Display Feedback Card*/}
            {visibleFeedbacks.map((feedback, index) => (
                <div key={feedback.id || index}>
                    <FeedbackCard feedbackData={feedback} img={img} />
                    {index < visibleFeedbacks.length - 1 && <Divider />}
                </div>
            ))}
            {/* Display button 'Load More' and 'Collapse' */}
            {isLoadMorePage && (
                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2 }}>
                    {visibleCount < feedbackList.length && (
                        <Button onClick={handleLoadMore} variant="outlined" sx={buttonStyles}>
                            Load More
                        </Button>
                    )}
                    {visibleCount > 3 && (
                        <Button onClick={handleCollapse} variant="outlined">
                            Collapse
                        </Button>
                    )}
                </Box>
            )}
        </>
    );
};


const buttonStyles = { mt: 1, borderColor: "#05ce80", color: "#05ce80" };

export default FeedbackList;
