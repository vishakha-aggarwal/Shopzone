import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@mui/material";
import MetaData from "../layout/MetaData";
import {MdMailOutline, MdPerson, MdVerifiedUser} from "react-icons/md";
import SideBar from "./SideBar";
import { UPDATE_USER_RESET } from "../../constants/userConstants";
import { getUserDetails, updateUser, clearErrors } from "../../actions/userAction";
import Loader from "../layout/Loader/Loader";
import { useNavigate, useParams } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpdateUser = () => {
    
    const toastOptions = {
        position: "bottom-center",
        autoClose: 5000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    };
    const navigate = useNavigate();
    const {id} = useParams();
    const dispatch = useDispatch();
    const { loading, error, user } = useSelector((state) => state.userDetails);
    const { loading: updateLoading, error: updateError, isUpdated} = useSelector((state) => state.profile);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const userId = id;

    useEffect(() => {
        
        if (user && user._id !== userId) 
            dispatch(getUserDetails(userId));
        else {
            setName(user.name);
            setEmail(user.email);
            setRole(user.role);
        }

        if (error) {
            toast.error(error, toastOptions);
            dispatch(clearErrors());
            <ToastContainer />
        }

        if (updateError) {
            toast.error(updateError, toastOptions);
            dispatch(clearErrors());
            <ToastContainer />
        }

        if (isUpdated) {
            toast.success("User Updated Successfully", toastOptions);
            navigate("/admin/users");
            dispatch({ type: UPDATE_USER_RESET });
            <ToastContainer />
        }
    }, [dispatch, error, isUpdated, updateError, user, userId]);

    const updateUserSubmitHandler = (e) => {
        
        e.preventDefault();
        const myForm = new FormData();
        myForm.set("name", name);
        myForm.set("email", email);
        myForm.set("role", role);
        dispatch(updateUser(userId, myForm));
    };

    return (
    <Fragment>
        <MetaData title="Update User" />
        <div className="dashboard">
            <SideBar />
            <div className="newProductContainer">
                {loading ? <Loader /> : (
                    <form className="createProductForm" onSubmit={updateUserSubmitHandler} >
                        <h1>Update User</h1>
                        <div>
                            <MdPerson />
                            <input type="text" placeholder="Name" required value={name} onChange={(e) => setName(e.target.value)}/>
                        </div>
                        <div>
                            <MdMailOutline />
                            <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)}/>
                        </div>

                        <div>
                            <MdVerifiedUser />
                            <select value={role} onChange={(e) => setRole(e.target.value)}>
                                <option value="">Choose Role</option>
                                <option value="admin">Admin</option>
                                <option value="user">User</option>
                            </select>
                        </div>

                        <Button id="createProductBtn" type="submit"
                            disabled={
                                updateLoading ? true : false || role === "" ? true : false
                            }>
                            Update
                        </Button>
                    </form>
                )}
            </div>
        </div>
    </Fragment>
    );
};

export default UpdateUser;