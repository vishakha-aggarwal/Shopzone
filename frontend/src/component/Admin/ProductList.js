import React, { Fragment, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import "./ProductList.css";
import { useSelector, useDispatch } from "react-redux";
import {clearErrors, getAdminProduct, deleteProduct } from "../../actions/productActions";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import MetaData from "../layout/MetaData";
import {MdEdit, MdDelete} from "react-icons/md";
import SideBar from "./SideBar";
import { DELETE_PRODUCT_RESET } from "../../constants/productConstants";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const ProductList = () => {

    const navigate = useNavigate();
    const toastOptions = {
        position: "bottom-center",
        autoClose: 5000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    }; 

    const dispatch = useDispatch();
    const { error, products } = useSelector((state) => state.products);
    const { error: deleteError, isDeleted } = useSelector((state) => state.product);

    const deleteProductHandler = (id) => {
        dispatch(deleteProduct(id));
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
            toast.success("Product Deleted Successfully", toastOptions);
            navigate("/admin/products");
            dispatch({ type: DELETE_PRODUCT_RESET });
            <ToastContainer />
        }
        dispatch(getAdminProduct());
    }, [dispatch, error, deleteError, isDeleted]);

    const columns = [
        { field: "id", headerName: "Product ID", minWidth: 200, flex: 0.5 },
        {
            field: "name",
            headerName: "Name",
            minWidth: 350,
            flex: 1,
            renderCell: (params) => {
                return (
                    <Fragment>
                        <Link to={`/product/${params.getValue(params.id, "id")}`}>
                            {params.row.name}
                        </Link>
                    </Fragment>
                );
            },
        },
        {
            field: "stock",
            headerName: "Stock",
            type: "number",
            minWidth: 150,
            flex: 0.3,
        },

        {
            field: "price",
            headerName: "Price",
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
                        <Link to={`/admin/product/${params.getValue(params.id, "id")}`}>
                            <MdEdit />
                        </Link>

                        <Button onClick={() => deleteProductHandler(params.getValue(params.id, "id"))} >
                            <MdDelete />
                        </Button>
                    </Fragment>
                );
            },
        },
    ];

    const rows = [];

    products &&
        products.forEach((item) => {
            rows.push({
                id: item._id,
                stock: item.Stock,
                price: item.price,
                name: item.name,
            });
        });

    return (
        <Fragment>
            <MetaData title={`ALL PRODUCTS - Admin`} />

            <div className="dashboard">
                <SideBar />
                <div className="productListContainer">
                    <h1 id="productListHeading">ALL PRODUCTS</h1>

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

export default ProductList;