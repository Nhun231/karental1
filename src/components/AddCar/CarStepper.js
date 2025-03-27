import React from "react";
import { Stepper, Step, StepLabel, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";

const steps = [
  { label: "Basic", path: "/add-car-basic" },
  { label: "Details", path: "/add-car-details" },
  { label: "Pricing", path: "/add-car-pricing" },
  { label: "Finish", path: "/add-car-finish" },
];

export default function CarStepper() {
  const location = useLocation();
  const activeStep = steps.findIndex((step) => step.path === location.pathname);

  return (
    <>
      <div style={{ width: "80%", margin: "auto", padding: "20px" }}></div>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel>
              {/* <Link
                to={step.path}
                style={{
                  textDecoration: "none",
                  color: activeStep === index ? "#05ce80" : "gray",
                  fontWeight: activeStep === index ? "bold" : "normal",
                }}
              >
                {`Step ${index + 1}: ${step.label}`}
              </Link> */}
              <div
                style={{
                  textDecoration: "none",
                  color: activeStep === index ? "#05ce80" : "gray",
                  fontWeight: activeStep === index ? "bold" : "normal",
                  fontSize: "16px",
                }}
              >{`Step ${index + 1}: ${step.label}`}</div>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </>
  );
}
