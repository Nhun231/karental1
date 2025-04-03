import { Box, Typography } from "@mui/material";

const NoFeedbackMessage = ({ message = "No feedback available." }) => {
    return (
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
                {message}
            </Typography>
            <img
                src="https://img.icons8.com/?size=100&id=SfQftXEz2mXG&format=png&color=05ce80"
                alt="No feedback"
                width="200"
                height="200"
            />
        </Box>
    );
};

export default NoFeedbackMessage;