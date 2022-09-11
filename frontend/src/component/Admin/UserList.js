import React, { Fragment, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import "./ProductList.css";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import MetaData from "../layout/MetaData";
import {MdEdit, MdDelete} from "react-icons/md";
import SideBar from "./SideBar";
import { getAllUsers, clearErrors, deleteUser } from "../../actions/userAction";
import { DELETE_USER_RESET } from "../../constants/userConstants";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UsersList = () => {
    
    const toastOptions = {
        position: "bottom-center",
        autoClose: 5000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    };
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { error, users } = useSelector((state) => state.allUsers);
    const { error: deleteError, isDeleted, message } = useSelector((state) => state.profile);

    const deleteUserHandler = (id) => {
        dispatch(deleteUser(id));
    };

    useEffect(() => {
        if (error) {
            toast.error(error, toastOptions);
            dispatch(clearErrors());
            <ToastContainer />
        }

        if (deleteError) {
            toast.error(deleteError, toastOptions);
            dispatch(clearErrors());
            <ToastContainer />
        }

        if (isDeleted) {
            toast.success(message, toastOptions);
            navigate("/admin/users");
            dispatch({ type: DELETE_USER_RESET });
            <ToastContainer />
        }
        dispatch(getAllUsers());
    }, [dispatch, error, deleteError, isDeleted, message]);

    const columns = [
        { field: "id", headerName: "User ID", minWidth: 180, flex: 0.8 },
        {
            field: "email",
            headerName: "Email",
            minWidth: 200,
            flex: 1,
        },
        {
            field: "name",
            headerName: "Name",
            minWidth: 150,
            flex: 0.5,
        },

        {
            field: "role",
            headerName: "Role",
            type: "number",
            minWidth: 150,
            flex: 0.3,
            cellClassName: (params) => {
                return params.getValue(params.id, "role") === "admin"
                    ? "greenColor"
                    : "redColor";
            },
        },
        {
            field: "actions",
            flex: 0.3,
            headerName: "Actions",
            minWidth: 150,
            type: "number",
            sortable: false,
            renderCell: (params) => {
                return (
                <Fragment>
                    <Link to={`/admin/user/${params.getValue(params.id, "id")}`}>
                        <MdEdit />
                    </Link>
                    <Button onClick={() => deleteUserHandler(params.getValue(params.id, "id"))}>
                        <MdDelete />
                    </Button>
                </Fragment>
                );
            },
        },
    ];

    const rows = [];

    users &&
        users.forEach((item) => {
            rows.push({
                id: item._id,
                role: item.role,
                email: item.email,
                name: item.name,
            });
        });

    return (
    <Fragment>
        <MetaData title={"ALL USERS - Admin"} />

        <div className="dashboard">
            <SideBar />
            <div className="productListContainer">
                <h1 id="productListHeading">ALL USERS</h1>

                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={10}
                    disableSelectionOnClick
                    className="productListTable"
                    autoHeight
                />
            </div>
        </div>
    </Fragment>
    );
};

export default UsersList;