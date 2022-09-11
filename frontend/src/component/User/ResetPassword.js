import React, { Fragment, useState, useEffect } from "react";
import "./ResetPassword.css";
import Loader from "../layout/Loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, resetPassword } from "../../actions/userAction";
import MetaData from "../layout/MetaData";
import {AiFillLock, AiFillUnlock} from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {useNavigate} from 'react-router-dom';
import { useParams } from "react-router";


const ResetPassword = () => {

    const toastOptions = {
        position: "bottom-center",
        autoClose: 5000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    };   
    const { token } = useParams();
    const dispatch = useDispatch();
    const { error, success, loading } = useSelector((state) => state.forgotPassword);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();

    const resetPasswordSubmit = (e) => {

        e.preventDefault();
        const myForm = new FormData();
        myForm.set("password", password);
        myForm.set("confirmPassword", confirmPassword);
        dispatch(resetPassword(token, myForm));
    };

    useEffect(() => {

        if (error) {
            toast.error(error, toastOptions);
            <ToastContainer />
            dispatch(clearErrors());
        }
        if (success) {
            toast.success("Password Updated Successfully", toastOptions);
            <ToastContainer />
            navigate("/login");
        }
    }, [dispatch, error, success]);

    return (
    <Fragment>
        {loading ? <Loader /> : (
        <Fragment>
            <MetaData title="Change Password" />
            <div className="resetPasswordContainer">
                <div className="resetPasswordBox">
                    <h2 className="resetPasswordHeading">Update Profile</h2>
                    <form className="resetPasswordForm" onSubmit={resetPasswordSubmit} >
                        <div>
                            <AiFillUnlock />
                            <input type="password" placeholder="New Password" required value={password} onChange={(e) => setPassword(e.target.value)}  />
                        </div>
                        <div className="loginPassword">
                            <AiFillLock />
                            <input type="password" placeholder="Confirm Password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        </div>
                        <input type="submit" value="Update" className="resetPasswordBtn" />
                    </form>
                </div>
            </div>
            <ToastContainer />
        </Fragment>
        )}
    </Fragment>
    );
};

export default ResetPassword;