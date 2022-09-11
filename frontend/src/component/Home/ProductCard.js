import React from 'react'
import { Link } from "react-router-dom";
import Rating  from '@mui/material/Rating';
import './Home.css'


const ProductCard = ({ product }) => {
  const options = {
    value: product.ratings.$numberDecimal,
    readOnly: true,
    precision: 0.5,
    color: "blue",
  };  
  return (
    <Link className="productCard" to={`/product/${product._id}`}>
      <img src={product.images[0].url} alt={product.name} className='productImg'/>
      <p style={{fontSize: "18px"}}>{product.name}</p>
      <div className='rating'>
        <Rating {...options} />{" "}
        <div >({product.numOfReviews} Reviews)</div>
      </div>
      <span>{`₹${product.price}`}</span>
    </Link>
  );
};

export default ProductCard;