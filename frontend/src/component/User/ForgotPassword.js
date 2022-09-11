import React, { Fragment, useState, useEffect } from "react";
import "./ForgotPassword.css";
import Loader from "../layout/Loader/Loader";
import {AiOutlineMail} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, forgotPassword } from "../../actions/userAction";
import MetaData from "../layout/MetaData";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const ForgotPassword = () => {

    const toastOptions = {
        position: "bottom-center",
        autoClose: 5000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    };   
    const dispatch = useDispatch();
    const { error, message, loading } = useSelector((state) => state.forgotPassword);

    const [email, setEmail] = useState("");

    const forgotPasswordSubmit = (e) => {

        e.preventDefault();
        const myForm = new FormData();
        myForm.set("email", email);
        dispatch(forgotPassword(myForm));
    };

    useEffect(() => {
        if (error) {
            toast.error(error, toastOptions);
            dispatch(clearErrors());
            <ToastContainer />
        }

        if (message) {
            toast.success(message, toastOptions);
            <ToastContainer />
        }
    }, [dispatch, error, message]);

    return (
    <Fragment>
        {loading ? <Loader /> : (
        <Fragment>
            <MetaData title="Forgot Password" />
            <div className="forgotPasswordContainer">
                <div className="forgotPasswordBox">
                    <h2 className="forgotPasswordHeading">Forgot Password</h2>
                    <form className="forgotPasswordForm" onSubmit={forgotPasswordSubmit} >
                        <h4 className="text">Enter the email to recieve recovery link</h4>
                        <div className="forgotPasswordEmail">
                            <AiOutlineMail />
                            <input type="email" placeholder="Email" required name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <input type="submit" value="Send" className="forgotPasswordBtn" />
                    </form>
                </div>
            </div>
            <ToastContainer />
        </Fragment>
        )}
    </Fragment>
    );
};

export default ForgotPassword;