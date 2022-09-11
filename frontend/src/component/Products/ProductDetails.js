import React, { Fragment, useEffect, useState } from "react";
import "./ProductDetails.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, getProductDetails } from "../../actions/productActions";
import Loader from "../layout/Loader/Loader";
import MetaData from "../layout/MetaData";
import Rating from '@mui/material/Rating';
import { ToastContainer, toast } from "react-toastify";
import { useParams } from "react-router";
import { Slide } from 'react-slideshow-image';
import ReviewCard from './ReviewCard';
import { addItemsToCart } from "../../actions/cartActions";
import { newReview } from "../../actions/productActions";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
} from "@mui/material";
import { NEW_REVIEW_RESET } from "../../constants/productConstants";


const ProductDetails = () => {

    const { id } = useParams();
    const dispatch = useDispatch();
    const { product, loading, error } = useSelector((state) => state.productDetails);
    const { success, error: reviewError } = useSelector((state) => state.newReview);
    



    const [quantity, setQuantity] = useState(1);
    const [open, setOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    const toastOptions = {
        position: "bottom-center",
        autoClose: 5000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    };

    const options = {
        value: (product!== undefined && product.ratings !== undefined)? product.ratings.$numberDecimal : 0,
        readOnly: true,
        precision: 0.5,
        color: "blue",
    };  

    
    const addToCartHandler = () => {
        dispatch(addItemsToCart(id, quantity));
        toast.success("Item Added To Cart", toastOptions);
        <ToastContainer />
    };
    

    const incQty = () => {
        if (product.Stock <= quantity) 
        return;
        const qty = quantity + 1;
        setQuantity(qty);
    };
    
    const decQty = () => {
        if (1 >= quantity) 
        return;
        const qty = quantity - 1;
        setQuantity(qty);
    };
    
    const submitReviewToggle = () => {
        open ? setOpen(false) : setOpen(true);
    };
    
    const reviewSubmitHandler = () => {
        const myForm = new FormData();
    
        myForm.set("rating", rating);
        myForm.set("comment", comment);
        myForm.set("productId", id);
        dispatch(newReview(myForm));
        setOpen(false);
    };

    useEffect(() => {
        if (error) {
            toast.error(error, toastOptions);
            <ToastContainer />
            return;
        }
        if (reviewError) {
            toast.error(reviewError, toastOptions);
            dispatch(clearErrors());
            <ToastContainer />
        }
      
        if (success) {
            toast.success("Review Submitted Successfully", toastOptions);
            dispatch({ type: NEW_REVIEW_RESET });
            <ToastContainer />
        }

        dispatch(getProductDetails(id));
    }, [dispatch, id, error, reviewError, success]);
    
    return (
    <Fragment>
    {loading ? <Loader /> : (
    <Fragment>
        <MetaData title={`${product.name} - ShopZone`} />
        <div className="ProductDetails">
            <div className = "slider">
                <Slide>
                {product.images &&
                    product.images.map((item, i) => (
                    <img
                    className="SlideImage"
                    key={i}
                    src={item.url}
                    alt={`${i} Slide`}
                    />
                ))}
                </Slide>
            </div>
            <div>
                <div className="prodHeading">
                    <h2>{product.name}</h2>
                    <h4>Product #{product._id}</h4>
                </div>
                <div className="ratings">
                    <Rating {...options} />
                    <span className="reviewsCount">
                        {" "}
                        ({product.numOfReviews} Reviews)
                    </span>
                </div>
                <div className="incDec">
                    <h2>{`₹${product.price}`}</h2>
                    <div className="addToCart">
                        <div className="add">
                            <button onClick={decQty}>-</button>
                            <input readOnly type="number" value={quantity}/>
                            <button onClick={incQty}>+</button>
                        </div>
                        <button disabled={product.Stock < 1 ? true: false} onClick={addToCartHandler}>
                            Add to Cart
                        </button>
                    </div>

                    <p> Status - 
                        <b style={{color: product.Stock < 1 ? "red": "green"}}>
                            {product.Stock < 1 ? " OutOfStock" : " InStock"}
                        </b>
                    </p>
                </div>

                <div className="description">
                    Description: <p>{product.description}</p>
                </div>
                <button onClick={submitReviewToggle} className="submitReview">
                    Submit Review
                </button>
            </div>
        </div>

        <h3 className="reviewsHeading">REVIEWS</h3>
        
        <Dialog
            aria-labelledby="simple-dialog-title"
            open={open}
            onClose={submitReviewToggle} >
            <DialogTitle>Submit Review</DialogTitle>
            <DialogContent className="submitDialog">
                <Rating
                    onChange={(e) => setRating(e.target.value)}
                    value={rating}
                    size="large"/>

                <textarea className="submitDialogTextArea" cols="30" rows="5" value={comment} onChange={(e) => setComment(e.target.value)}>
                </textarea>
            </DialogContent>
            <DialogActions>
                <Button onClick={submitReviewToggle} color="secondary">
                    Cancel
                </Button>
                <Button onClick={reviewSubmitHandler} color="primary">
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
        
        {product.reviews && product.reviews[0] ? (
            <div className="reviews">
              {product.reviews &&
                product.reviews.map((review) => (
                  <ReviewCard key={review._id} review={review} />
                ))}
            </div>
          ) : (
            <p className="noReviews">No Reviews Yet</p>
          )}

    </Fragment>
    )}
    <ToastContainer />
    </Fragment>
    );
};

export default ProductDetails;