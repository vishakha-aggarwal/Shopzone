import {
    CREATE_ORDER_REQUEST,
    CREATE_ORDER_SUCCESS,
    CREATE_ORDER_FAIL,
    MY_ORDERS_REQUEST,
    MY_ORDERS_SUCCESS,
    MY_ORDERS_FAIL,
    ALL_ORDERS_REQUEST,
    ALL_ORDERS_SUCCESS,
    ALL_ORDERS_FAIL,
    UPDATE_ORDER_REQUEST,
    UPDATE_ORDER_SUCCESS,
    UPDATE_ORDER_FAIL,
    DELETE_ORDER_REQUEST,
    DELETE_ORDER_SUCCESS,
    DELETE_ORDER_FAIL,
    ORDER_DETAILS_REQUEST,
    ORDER_DETAILS_SUCCESS,
    ORDER_DETAILS_FAIL,
    CLEAR_ERRORS,
} from "../constants/orderConstants";

import axios from "axios";
const api = "https://shopzone.vercel.app";

// Create Order
export const createOrder = (order) => async (dispatch) => {

    try {
        dispatch({ type: CREATE_ORDER_REQUEST });
        const config = { method: "POST", headers: { "Content-Type": "application/json" }, withCredentials: 'true', credentials: 'include' };
        const { data } = await axios.post(api + "/api/v1/order/new", order, config);
        dispatch({ 
            type: CREATE_ORDER_SUCCESS, 
            payload: data 
        });
    } catch (error) {
        dispatch({
            type: CREATE_ORDER_FAIL,
            payload: error.response.data.message,
        });
    }
};

// Clearing Errors
export const clearErrors = () => async (dispatch) => {
    dispatch({ type: CLEAR_ERRORS });
};

// My Orders
export const myOrders = () => async (dispatch) => {
    
    try {
        dispatch({ type: MY_ORDERS_REQUEST });
        const config = { method: "GET", headers: { "Content-Type": "application/json" }, withCredentials: 'true', credentials: 'include' };
        const { data } = await axios.get(api + "/api/v1/order/me", config);
        dispatch({ 
            type: MY_ORDERS_SUCCESS, 
            payload: data.orders 
        });
    } catch (error) {
        dispatch({
            type: MY_ORDERS_FAIL,
            payload: error.response.data.message,
        });
    }
};
  
// Get Order Details
export const getOrderDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: ORDER_DETAILS_REQUEST });
        const config = { method: "GET", headers: { "Content-Type": "application/json" }, withCredentials: 'true', credentials: 'include' };
        const { data } = await axios.get(api + `/api/v1/order/${id}`, config);
        dispatch({ 
            type: ORDER_DETAILS_SUCCESS, 
            payload: data.order 
        });
    } catch (error) {
        dispatch({
            type: ORDER_DETAILS_FAIL,
            payload: error.response.data.message,
        });
    }
};

// Get All Orders (admin)
export const getAllOrders = () => async (dispatch) => {
    
    try {
        dispatch({ type: ALL_ORDERS_REQUEST });
        const config = { method: "GET", headers: { "Content-Type": "application/json" }, withCredentials: 'true', credentials: 'include' };
        const { data } = await axios.get(api + "/api/v1/admin/orders", config);
        dispatch({ type: ALL_ORDERS_SUCCESS, payload: data.orders });
    } catch (error) {
        dispatch({
            type: ALL_ORDERS_FAIL,
            payload: error.response.data.message,
        });
    }
};
  
// Update Order
export const updateOrder = (id, order) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_ORDER_REQUEST });
        const config = { method: "PUT", headers: { "Content-Type": "application/json" }, withCredentials: 'true', credentials: 'include' };
        const { data } = await axios.put(api + `/api/v1/admin/order/${id}`,
            order,
            config
        );
        dispatch({ type: UPDATE_ORDER_SUCCESS, payload: data.success });
    } catch (error) {
        dispatch({
            type: UPDATE_ORDER_FAIL,
            payload: error.response.data.message,
        });
    }
};

// Delete Order
export const deleteOrder = (id) => async (dispatch) => {
    
    try {
        dispatch({ type: DELETE_ORDER_REQUEST });
        const config = { method: "DELETE", headers: { "Content-Type": "application/json" }, withCredentials: 'true', credentials: 'include' };
        const { data } = await axios.delete(api + `/api/v1/admin/order/${id}`, config);
        dispatch({ type: DELETE_ORDER_SUCCESS, payload: data.success });
    } catch (error) {
        dispatch({
            type: DELETE_ORDER_FAIL,
            payload: error.response.data.message,
        });
    }
};