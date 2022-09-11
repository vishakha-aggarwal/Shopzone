import React, { Fragment, useEffect, useState } from "react";
import "./Search.css";
import "./Products.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, getProduct } from "../../actions/productActions";
import Loader from "../layout/Loader/Loader";
import ProductCard from "../Home/ProductCard";
// import Pagination from "react-js-pagination";
import MetaData from "../layout/MetaData";
import { ToastContainer, toast } from "react-toastify";
import { useParams, withRouter } from "react-router";
import { useNavigate } from "react-router-dom";

const Search = () => {

    const navigate = useNavigate();
    const [keyword, setKeyword] = useState("");
    const dispatch = useDispatch();
    const {loading, error, products, productsCount } = useSelector((state) => state.products);

    const toastOptions = {
        position: "bottom-center",
        autoClose: 5000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      };

    useEffect(() => {
        if (error) {
            toast.error(error, toastOptions);
            <ToastContainer />
            return;
        }
        dispatch(getProduct());
    }, [dispatch, error]);


    const searchSubmitHandler = (e) => {
        e.preventDefault();
        if (keyword.trim()) 
            navigate(`/products/${keyword}`);
        else 
            navigate("/products");
        
    };

    return (
    <Fragment>
        <MetaData title="Search A Product - ShopZone" />
        <form className="searchBox" onSubmit={searchSubmitHandler}>
            <input type="text" placeholder="Search a Product ..." onChange={(e) => setKeyword(e.target.value)} />
            <input type="submit" value="Search" />
        </form>
        {loading ? <Loader />: (
        <Fragment>
            <h2 className="productsHeading">Products</h2>
            <div className="products">
                {products &&
                    products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
            <ToastContainer />
        </Fragment>
        )}
    </Fragment>
    );
};

export default Search;