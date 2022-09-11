import React, { Fragment, useEffect, useState } from "react";
import "./Products.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, getProduct } from "../../actions/productActions";
import Loader from "../layout/Loader/Loader";
import ProductCard from "../Home/ProductCard";
import Pagination from "react-js-pagination";
import MetaData from "../layout/MetaData";
import { ToastContainer, toast } from "react-toastify";
import { useParams } from "react-router";
import { Typography } from '@mui/material'
import { Slider } from "@mui/material";

const categories = ["Laptop", "Footwear", "Bottom", "Tops", "Attire", "Camera", "SmartPhones"];

const Products = () => {

    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(1);
    const [price, setPrice] = useState([0, 25000]);
    const [category, setCategory] = useState("");
    const [ratings, setRatings] = useState(0);
    const {products, filteredProducts, loading, error, productsCount, resultPerPage, filteredProductsCount} = useSelector((state) => state.products);
    const { keyword } = useParams();
    
    const setCurrentPageNo = (e) => {
        setCurrentPage(e);
    };

    
    const priceHandler = (event, newPrice) => {
        setPrice(newPrice);
        setCurrentPage(1);

    };

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
        dispatch(getProduct(keyword, currentPage, price, category, ratings));
    }, [dispatch, error, keyword, currentPage, price, category, ratings]);
    return (
        <Fragment>
        {loading ? <Loader />: (
            <Fragment>
            <MetaData title="Products - ShopZone" />
            <h2 className="productsHeading">Products</h2>

            <div className="products">
                {filteredProducts &&
                    filteredProducts.map((product) => (
                        <ProductCard key={product._id} product={product} />
                        ))
                }
                {(filteredProducts !== undefined && filteredProducts.length === 0)? (<div>PRODUCT NOT FOUND :(</div>): <span></span>}
            </div>
            <div className="filterBox">
                <Typography>Price</Typography>
                <Slider value={price} onChange = {priceHandler}valueLabelDisplay="auto" aria-labelledby="range-slider" min={0} max={25000} />

                <Typography>Categories</Typography>
                <ul className="categoryBox">
                {categories.map((category) => (
                    <li className="category-link" key={category} onClick={() => setCategory(category)} >
                    {category}
                    </li>
                ))}
                </ul>
                <fieldset>
                <Typography component="legend">Ratings Above</Typography>
                <Slider
                    value={ratings}
                    onChange={(e, newRating) => {
                    setRatings(newRating);
                    }}
                    aria-labelledby="continuous-slider"
                    valueLabelDisplay="auto"
                    min={0}
                    max={5}
                />
                </fieldset>
            </div>
            {products && resultPerPage < filteredProductsCount && (
            <div className="paginationBox">
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={resultPerPage}
                totalItemsCount={productsCount}
                onChange={setCurrentPageNo}
                nextPageText="Next"
                prevPageText="Prev"
                firstPageText="1st"
                lastPageText="Last"
                itemClass="page-item"
                linkClass="page-link"
                activeClass="pageItemActive"
                activeLinkClass="pageLinkActive"
              />
            </div>
            )}
            <ToastContainer />
            </Fragment>
        )}
        </Fragment>
    );
};

export default Products;