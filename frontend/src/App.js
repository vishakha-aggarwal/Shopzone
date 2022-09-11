import "./App.css"
import Header from "./component/layout/Header/Header"
import { BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom'
import React, { useEffect } from 'react'
import webFont from "webfontloader"
import Footer from "./component/layout/Footer/Footer"
import Home from './component/Home/Home.js'
import ProductDetails from './component/Products/ProductDetails'
import Products from './component/Products/Products'
import Search from './component/Products/Search'
import LoginSignup from './component/User/LoginSignup'
import store from './store.js'
import { loadUser } from "./actions/userAction"
import UserOptions from './component/layout/Header/UserOptions'
import { useSelector } from "react-redux"
import Profile from './component/User/Profile'
import UpdateProfile from "./component/User/UpdateProfile"
import UpdatePassword from "./component/User/UpdatePassword"
import ForgotPassword from './component/User/ForgotPassword'
import ResetPassword from './component/User/ResetPassword'
import Cart from './component/Cart/Cart';
import Shipping from './component/Cart/Shipping'
import ConfirmOrder from "./component/Cart/ConfirmOrder"
import { useState } from "react"
import axios from "axios"
import Payment from "./component/Cart/Payment"
import {Elements} from '@stripe/react-stripe-js'
import {loadStripe} from '@stripe/stripe-js'
import Success from './component/Cart/Success'
import MyOrders from './component/Order/MyOrder'
import OrderDetails from "./component/Order/OrderDetails"
import Dashboard from './component/Admin/Dashboard'
import ProductList from './component/Admin/ProductList'
import NewProduct from "./component/Admin/NewProduct"
import UpdateProduct from "./component/Admin/UpdateProduct"
import OrderList from "./component/Admin/OrderList"
import ProcessOrder from './component/Admin/ProcessOrder'
import UserList from './component/Admin/UserList'
import UpdateUser from "./component/Admin/UpdateUser"
import ProductReviews from './component/Admin/ProductReviews'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Contact from './component/layout/Contact/Contact'

function App() {

  const { isAuthenticated, user } = useSelector((state) => state.user);
  const [stripeApiKey, setStripeApiKey] = useState("");
  const toastOptions = {
    position: "bottom-center",
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  }; 

  async function getStripeApiKey() {
    const api = "https://shopzone-mern.herokuapp.com";
    const config = { method: "GET", headers: { "Content-Type": "application/json" }, withCredentials: 'true', credentials: 'include' };
    const {data} = await axios.get(api + "/api/v1/stripeapikey", config);
    setStripeApiKey(data.stripeApiKey);
  }


  useEffect(() =>{
  
    webFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      }
    })
    store.dispatch(loadUser());
    if(isAuthenticated === true)
      getStripeApiKey();
  }, [])

  function RequireAuth({isAdmin, children, redirectTo }) {
    const { loading, isAuthenticated, user } = useSelector((state) => state.user);
    if(loading === false)
    {
      if(isAuthenticated===false)
        return <Navigate to={redirectTo} />
      if(user !== undefined && isAdmin === true && user.role !== "admin")
      {
        toast.error("You can't access this resource", toastOptions);
        <ToastContainer />
        return <Navigate to="/" />
      }
      return children;
    }
  }

  return <Router>
    <Header />
    {isAuthenticated && <UserOptions user={user} />}
    <Routes>
        <Route path="/" element={<Home />} /> 

        <Route path="/product/:id" element={<ProductDetails />} /> 

        <Route path="/products" element={<Products />} /> 

        <Route path="/products/:keyword" element={<Products />} /> 

        <Route path="/search" element={<Search />} /> 

        <Route path="/login" element={<LoginSignup />} /> 

        <Route path="/account" element={<RequireAuth redirectTo="/login" children={<Profile />}></RequireAuth>}/>

        <Route path="/me/update" element={<RequireAuth redirectTo = "/login" children={<UpdateProfile />} ></RequireAuth > } />

        <Route path="/password/update" element={<RequireAuth redirectTo = "/login" children={<UpdatePassword />} ></RequireAuth > } />

        <Route path="/password/forgot" element={<ForgotPassword />} />

        <Route path="/password/reset/:token" element={<ResetPassword />} />

        <Route path="/cart" element={<RequireAuth redirectTo = "/login" children={<Cart />} ></RequireAuth > } />

        <Route path="/shipping" element={<RequireAuth redirectTo = "/login" children={<Shipping />} ></RequireAuth > } />

        <Route path="/order/confirm" element={<RequireAuth redirectTo = "/login" children={<ConfirmOrder />} ></RequireAuth > } />
        
        <Route path="/success" element={<RequireAuth redirectTo = "/login" children={<Success />} ></RequireAuth > } />
        
        <Route path="/orders" element={<RequireAuth redirectTo = "/login" children={<MyOrders />} ></RequireAuth > } />
        
        <Route path="/order/:id" element={<RequireAuth redirectTo = "/login" children={<OrderDetails />} ></RequireAuth > } />

        <Route path="/admin/dashboard" element={<RequireAuth isAdmin={true} redirectTo = "/login" children={<Dashboard />} ></RequireAuth > } />

        <Route path="/admin/products" element={<RequireAuth isAdmin={true} redirectTo = "/login" children={<ProductList />} ></RequireAuth > } />
        
        <Route path="/admin/product" element={<RequireAuth isAdmin={true} redirectTo = "/login" children={<NewProduct />} ></RequireAuth > } />

        <Route path="/admin/product/:id" element={<RequireAuth isAdmin={true} redirectTo = "/login" children={<UpdateProduct />} ></RequireAuth > } />

        <Route path="/admin/orders" element={<RequireAuth isAdmin={true} redirectTo = "/login" children={<OrderList />} ></RequireAuth > } />

        <Route path="/admin/order/:id" element={<RequireAuth isAdmin={true} redirectTo = "/login" children={<ProcessOrder />} ></RequireAuth > } />

        <Route path="/admin/users" element={<RequireAuth isAdmin={true} redirectTo = "/login" children={<UserList />} ></RequireAuth > } />

        <Route path="/admin/user/:id" element={<RequireAuth isAdmin={true} redirectTo = "/login" children={<UpdateUser />} ></RequireAuth > } />

        <Route path="/admin/reviews" element={<RequireAuth isAdmin={true} redirectTo = "/login" children={<ProductReviews />} ></RequireAuth > } />

        <Route path="/contact" element={<Contact />} /> 

    </Routes>
    {stripeApiKey && (
      <Elements stripe={loadStripe(stripeApiKey)}>
        <Routes>
          <Route path="/process/payment" element={<RequireAuth redirectTo = "/login" children={<Payment />} ></RequireAuth > } />
        </Routes>
      </Elements>
    )}
    <ToastContainer />
    <Footer />
  </Router>
}

export default App