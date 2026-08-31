import ErrorHandler from "../utils/ErrorHandler.js";
import catchAsyncErrors from "./catchAsyncErrors.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js"
import Shop from "../models/Shop.js"


export const isAuthenticated = catchAsyncErrors(async(req,res,next) => {
    const {token} = req.cookies;

    if(!token){
        return next(new ErrorHandler("Please login with valid email and password to continue", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.user = await User.findById(decoded.id);

    next();
});


export const isSeller = catchAsyncErrors(async(req,res,next) => {
    const {seller_token} = req.cookies;
    if(!seller_token){
        return next(new ErrorHandler("Please login to continue", 401));
    }

    const decoded = jwt.verify(seller_token, process.env.JWT_SECRET_KEY);

    req.seller = await Shop.findById(decoded.id);

    next();
});


// chat history is read by both sides of a conversation, so accept either cookie
export const isAuthenticatedUserOrSeller = catchAsyncErrors(async (req, res, next) => {
    const { token, seller_token } = req.cookies;

    if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = await User.findById(decoded.id);
        return next();
    }

    if (seller_token) {
        const decoded = jwt.verify(seller_token, process.env.JWT_SECRET_KEY);
        req.seller = await Shop.findById(decoded.id);
        return next();
    }

    return next(new ErrorHandler("Please login to continue", 401));
});

export const isAdmin = (...roles) => {
    return (req,res,next) => {
        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler(`${req.user.role} can not access this resources!`))
        };
        next();
    }
}