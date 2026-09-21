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


// chat history is read by both sides of a conversation. A browser can hold both
// cookies at once (someone who's logged in as a buyer and a seller), so we
// resolve both identities here instead of returning on the first one found —
// otherwise a stale buyer cookie would shadow a seller who is the real caller.
export const isAuthenticatedUserOrSeller = catchAsyncErrors(async (req, res, next) => {
    const { token, seller_token } = req.cookies;

    if (!token && !seller_token) {
        return next(new ErrorHandler("Please login to continue", 401));
    }

    if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = await User.findById(decoded.id);
    }

    if (seller_token) {
        const decoded = jwt.verify(seller_token, process.env.JWT_SECRET_KEY);
        req.seller = await Shop.findById(decoded.id);
    }

    next();
});

export const isAdmin = (...roles) => {
    return (req,res,next) => {
        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler(`${req.user.role} can not access this resources!`))
        };
        next();
    }
}