import React, { Fragment, useEffect, useRef } from "react";
import CheckoutSteps from "../Cart/CheckoutSteps";
import { useSelector, useDispatch } from "react-redux";
import MetaData from "../layout/MetaData";
import { Typography } from "@mui/material";
import {CardNumberElement, CardCvcElement, CardExpiryElement, useStripe, useElements} from "@stripe/react-stripe-js";
import axios from "axios";
import "./Payment.css";
import {useNavigate} from 'react-router-dom';
import {MdCreditCard, MdEvent, MdVpnKey} from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {clearErrors, createOrder} from '../../actions/orderActions'

const Payment = () => {

    const toastOptions = {
        position: "bottom-center",
        autoClose: 5000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    };

    const navigate = useNavigate();
    const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
    const dispatch = useDispatch();
    const stripe = useStripe();
    const elements = useElements();
    const payBtn = useRef(null);

    const { shippingInfo, cartItems } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.user);
    const { error } = useSelector((state) => state.newOrder);

    const paymentData = {
        amount: Math.round(orderInfo.totalPrice * 100),
    };

    const order = {
        shippingInfo,
        orderItems: cartItems,
        itemsPrice: orderInfo.subtotal,
        taxPrice: orderInfo.tax,
        shippingPrice: orderInfo.shippingCharges,
        totalPrice: orderInfo.totalPrice,
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        payBtn.current.disabled = true;
        try {
            const config = { method: "POST", headers: { "Content-Type": "application/json" }, withCredentials: 'true', credentials: 'include' };
            const api = "https://shopzone-mern.vercel.app";
            const { data } = await axios.post(api + "/api/v1/payment/process",
                paymentData,
                config
            );

            const client_secret = data.client_secret;
            if (!stripe || !elements) 
                return;

            const result = await stripe.confirmCardPayment(client_secret, {
                payment_method: {
                    card: elements.getElement(CardNumberElement),
                    billing_details: {
                        name: user.name,
                        email: user.email,
                        address: {
                            line1: shippingInfo.address,
                            city: shippingInfo.city,
                            state: shippingInfo.state,
                            postal_code: shippingInfo.pinCode,
                            country: shippingInfo.country,
                        },
                    },
                },
            });

            if (result.error) {
                payBtn.current.disabled = false;
                toast.error(result.error.message, toastOptions);
                <ToastContainer />
            } 
            else {
                if (result.paymentIntent.status === "succeeded") {
                    order.paymentInfo = {
                        id: result.paymentIntent.id,
                        status: result.paymentIntent.status,
                    };
                    dispatch(createOrder(order));
                    navigate("/success");
                } else {
                    toast.error("There's some issue while processing payment ", toastOptions);
                    <ToastContainer />
                }
            }
        } catch (error) {
            payBtn.current.disabled = false;
            toast.error(error.response.data.message, toastOptions);
            <ToastContainer />
        }
    };

    useEffect(() => {
        if (error) {
            toast.error(error, toastOptions);
            dispatch(clearErrors());
            <ToastContainer />
        }
    }, [dispatch, error]);

    return (
        <Fragment>
            <MetaData title="Payment" />
            <CheckoutSteps activeStep={2} />
            <div className="paymentContainer">
                <form className="paymentForm" onSubmit={(e) => submitHandler(e)}>
                    <Typography>Card Info</Typography>
                    <div>
                        <MdCreditCard />
                        <CardNumberElement className="paymentInput" />
                    </div>
                    <div>
                        <MdEvent />
                        <CardExpiryElement className="paymentInput" />
                    </div>
                    <div>
                        <MdVpnKey />
                        <CardCvcElement className="paymentInput" />
                    </div>

                    <input
                        type="submit"
                        value={`Pay - ₹${orderInfo && orderInfo.totalPrice}`}
                        ref={payBtn}
                        className="paymentFormBtn"
                    />
                </form>
                <ToastContainer />
            </div>
        </Fragment>
    );
};

export default Payment;