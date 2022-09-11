import React, { Fragment, useState, useEffect } from "react";
import "./UpdatePassword.css";
import Loader from "../layout/Loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, updatePassword } from "../../actions/userAction";
import { UPDATE_PASSWORD_RESET } from "../../constants/userConstants";
import MetaData from "../layout/MetaData";
import {AiFillLock, AiFillUnlock} from "react-icons/ai";
import {MdVpnKey} from "react-icons/md";
import {useNavigate} from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpdatePassword = () => {
    
    const toastOptions = {
        position: "bottom-center",
        autoClose: 5000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    };

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { error, isUpdated, loading } = useSelector((state) => state.profile);

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const updatePasswordSubmit = (e) => {
        
        e.preventDefault();
        const myForm = new FormData();
        myForm.set("oldPassword", oldPassword);
        myForm.set("newPassword", newPassword);
        myForm.set("confirmPassword", confirmPassword);
        dispatch(updatePassword(myForm));
    };

    useEffect(() => {
        if (error) {
            toast.error(error, toastOptions);
            <ToastContainer />
            dispatch(clearErrors());
        }

        if (isUpdated) {
            toast.success("Profile Updated Successfully", toastOptions);
            navigate("/account");
            <ToastContainer />
            dispatch({
                type: UPDATE_PASSWORD_RESET,
            });
        }
    }, [dispatch, error, isUpdated]);

    return (
    <Fragment>
        {loading ? <Loader /> : (
        <Fragment>
            <MetaData title="Change Password" />
            <div className="updatePasswordContainer">
                <div className="updatePasswordBox">
                    <h2 className="updatePasswordHeading">Update Profile</h2>

                    <form className="updatePasswordForm" onSubmit={updatePasswordSubmit} >
                        <div className="loginPassword">
                            <MdVpnKey />
                            <input type="password" placeholder="Old Password" required value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                        </div>

                        <div className="loginPassword">
                            <AiFillUnlock />
                            <input type="password" placeholder="New Password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                        </div>
                        <div className="loginPassword">
                            <AiFillLock />
                            <input type="password" placeholder="Confirm Password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        </div>
                        <input type="submit" value="Change" className="updatePasswordBtn" />
                    </form>
                </div>
            </div>
            <ToastContainer />
        </Fragment>
        )}
    </Fragment>
    );
};

export default UpdatePassword;