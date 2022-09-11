import React, { Fragment, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import "./ProductList.css";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import MetaData from "../layout/MetaData";
import {MdEdit, MdDelete} from "react-icons/md";
import SideBar from "./SideBar";
import { deleteOrder, getAllOrders, clearErrors } from "../../actions/orderActions";
import { DELETE_ORDER_RESET } from "../../constants/orderConstants";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OrderList = () => {

    const toastOptions = {
        position: "bottom-center",
        autoClose: 5000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    }; 

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { error, orders } = useSelector((state) => state.allOrders);
    const { error: deleteError, isDeleted } = useSelector((state) => state.order);

    const deleteOrderHandler = (id) => {
        dispatch(deleteOrder(id));
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
            toast.success("Order Deleted Successfully", toastOptions);
            navigate("/admin/orders");
            dispatch({ type: DELETE_ORDER_RESET });
            <ToastContainer />
        }
        dispatch(getAllOrders());
    }, [dispatch, error, deleteError, isDeleted]);

    const columns = [
        { 
            field: "id", 
            headerName: "Order ID", 
            minWidth: 300, 
            flex: 1,
            renderCell: (params) => {
                return (
                    <Fragment>
                        <Link to={`/order/${params.getValue(params.id, "id")}`}>
                            {params.id}
                        </Link>
                    </Fragment>
                );
            }, 
        },

        {
            field: "status",
            headerName: "Status",
            minWidth: 150,
            flex: 0.5,
            cellClassName: (params) => {
                return params.getValue(params.id, "status") === "Delivered"
                    ? "greenColor"
                    : "redColor";
            },
        },
        {
            field: "itemsQty",
            headerName: "Items Qty",
            type: "number",
            minWidth: 150,
            flex: 0.4,
        },

        {
            field: "amount",
            headerName: "Amount",
            type: "number",
            minWidth: 270,
            flex: 0.5,
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
                        <Link to={`/admin/order/${params.getValue(params.id, "id")}`}>
                            <MdEdit />
                        </Link>
                        <Button
                            onClick={() => deleteOrderHandler(params.getValue(params.id, "id"))}>
                            <MdDelete />
                        </Button>
                    </Fragment>
                );
            },
        },
    ];

    const rows = [];

    orders &&
        orders.forEach((item) => {
            rows.push({
                id: item._id,
                itemsQty: item.orderItems.length,
                amount: item.totalPrice,
                status: item.orderStatus,
            });
        });

    return (
        <Fragment>
            <MetaData title={`ALL ORDERS - Admin`} />

            <div className="dashboard">
                <SideBar />
                <div className="productListContainer">
                    <h1 id="productListHeading">ALL ORDERS</h1>

                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={10}
                        disableSelectionOnClick
                        className="productListTable"
                        autoHeight
                    />
                </div>
                <ToastContainer />
            </div>
        </Fragment>
    );
};

export default OrderList;