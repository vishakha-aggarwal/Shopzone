import React from 'react'
import {ReactNavbar} from "overlay-navbar"
import logo from '../../../Images/logo.png'
import "./Header.css"
import { Link } from 'react-router-dom';
import {FaUserAlt, FaShoppingCart, FaSearch} from 'react-icons/fa';

const options = {
    burgerColorHover: "#006d77",
    logo,
    logoWidth: "20vmax",
    navColor1: "#edf6f9",
    logoHoverSize: "10px",
    logoHoverColor: "#006d77",
    link1Text: "Home",
    link2Text: "Products",
    link3Text: "Contact",
    link4Text: "",
    link1Url: "/",
    link2Url: "/products",
    link3Url: "/contact",
    // link4Url: "/about",
    link1Size: "2.3vmax",
    link1Color: "#006d77",
    link1ColorHover: "#ff9f1c",
    nav1justifyContent: "flex-end",
    nav2justifyContent: "flex-end",
    nav3justifyContent: "flex-start",
    nav4justifyContent: "flex-start",
    link1Margin: "2vmax",
    link1Family:"cursive",
    profileIconUrl: "/login",
    searchIconUrl: "/search",
    cartIconUrl: "/cart",
    profileIconColor: "#006d77",
    searchIconColor: "#006d77",
    cartIconColor: "#006d77",
    profileIconColorHover: "#ff9f1c",
    searchIconColorHover: "#ff9f1c",
    cartIconColorHover: "#ff9f1c",
    cartIconMargin: "1vmax",
    profileIconMargin: "1vmax",
    searchIconMargin: "1vmax",
    profileIcon: true,
    searchIcon: true,
    cartIcon: true,
    ProfileIconElement: FaUserAlt,
    CartIconElement: FaShoppingCart,
    SearchIconElement: FaSearch

};
  
const Header = () => {
    return <div>
        <ReactNavbar {...options} />
        <div className='context'>ShopZone</div>
    </div>

};

export default Header