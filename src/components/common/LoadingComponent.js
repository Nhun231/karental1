import React from "react";
import {Backdrop, CircularProgress} from "@mui/material";

const LoadingComponent = () => {
    return (
        <Backdrop sx={(theme) => ({color: "#fff", zIndex: theme.zIndex.drawer + 1, transition: "all .15s linear",})}
                  open={true}>
            <CircularProgress color="inherit"/>
        </Backdrop>);
};
export default LoadingComponent;