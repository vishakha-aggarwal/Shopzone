import React, { Fragment } from "react";
import { Stepper, StepLabel, Step } from "@mui/material";
import {MdLocalShipping, MdLibraryAddCheck, MdAccountBalance} from 'react-icons/md'
import "./CheckoutSteps.css";

const CheckoutSteps = ({ activeStep }) => {
    
    const steps = [
        {
            label: <h3 style={{fontFamily: "Roboto"}}>Shipping Details</h3>,
            icon: <MdLocalShipping />,
        },
        {
            label: <h3 style={{fontFamily: "Roboto"}}>Confirm Order</h3>,
            icon: <MdLibraryAddCheck />,
        },
        {
            label: <h3 style={{fontFamily: "Roboto"}}>Payment</h3>,
            icon: <MdAccountBalance />,
        },
    ];

    const stepStyles = {
        boxSizing: "border-box",
    };

    return (
    <Fragment>
        <Stepper alternativeLabel activeStep={activeStep} style={stepStyles}>
            {steps.map((item, index) => (
                <Step key={index}
                    active={activeStep === index ? true : false}
                    completed={activeStep >= index ? true : false}>
                    <StepLabel
                        style={{ color: activeStep > index ? "rgb(0, 124, 124)" : "red"}}
                        icon={item.icon}>
                        {item.label}
                    </StepLabel>
                </Step>
            ))}
        </Stepper>
    </Fragment>
    );
};

export default CheckoutSteps;