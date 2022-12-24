const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAysncErrors");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");
const {isAuthenticatedUser} = require("../middleware/auth");

//register
exports.registerUser = catchAsyncError(async (req, res, next) => {

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale",
    });

    const { name, email, password } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url
        }
    })

    // const token = user.getJWTToken();
    // creating token along with cookie
    sendToken(user, 201, res);
})

//login
exports.loginUser = async (req, res, next) => {

    const { email, password } = req.body;
    if (!email || !password)
        return next(new ErrorHandler("Please Enter Email & Password", 400));

    const user = await User.findOne({ email }).select("+password");

    if (!user)
        return next(new ErrorHandler("Invalid email or password", 401));

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched)
        return next(new ErrorHandler("Invalid email or password", 401));

    //storing token in cookie
    sendToken(user, 200, res);
}

//logout
exports.logout = catchAsyncError(async (req, res, next) => {

    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });
    
    res.status(200).json({
        success: true,
        message: "Logged Out Successfully",
    });
});

// forgot password
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user)
        return next(new ErrorHandler("User not found", 404));

    // Get ResetPassword Token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });
    // const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;
    const api = "localhost:5000";
    const resetPasswordUrl = api + `/password/reset/${resetToken}`; 
    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\n. 
    If you have not requested this email then, please ignore it.`;


    try {
        await sendEmail({
            email: user.email,
            subject: `ShopZone Password Recovery`,
            message,
        });

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`,
        });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler(error.message, 500));
    }
});

//reset password

exports.resetPassword = catchAsyncError(async (req, res, next) => {

    // creating token hash
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) 
        return next(new ErrorHandler("Reset Password Token is invalid or has been expired",400));

    if (req.body.password !== req.body.confirmPassword) 
        return next(new ErrorHandler("Password doesn't match", 400));

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);
});

// Get User Details
exports.getUserDetails = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id);
  
    res.status(200).json({
        success: true,
        user,
    });
});

// update User password
exports.updatePassword = catchAsyncError(async (req, res, next) => {

    const user = await User.findById(req.user.id).select("+password");
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
  
    if (!isPasswordMatched) 
        return next(new ErrorHandler("Old password is incorrect", 400));
  
    if (req.body.newPassword !== req.body.confirmPassword) 
        return next(new ErrorHandler("Password does not match", 400));
    
    if(req.body.oldPassword === req.body.newPassword)
        return next(new ErrorHandler("New Password should be different from Old Password", 400));
    
        user.password = req.body.newPassword;
    await user.save();  
    sendToken(user, 200, res);
});

//update user profile
exports.updateProfile = catchAsyncError(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
    };
    if (req.body.avatar !== "") {

        const user = await User.findById(req.user.id);
        const imageId = user.avatar.public_id;
        await cloudinary.v2.uploader.destroy(imageId);
        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: "avatars",
            width: 150,
            crop: "scale",
        });
    
        newUserData.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        };
    }
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });
  
    res.status(200).json({
        success: true,
        user
    });
});
  
//get all users -- admin
exports.getAllUser = catchAsyncError(async (req, res, next) => {

    const users = await User.find();
    res.status(200).json({
      success: true,
      users,
    });
});

// get user details by admin
exports.getSingleUser = catchAsyncError(async (req, res, next) => {

    const user = await User.findById(req.params.id);
    if (!user) 
        return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`));
  
    res.status(200).json({
        success: true,
        user,
    });
});

// update User Role -- Admin

exports.updateUserRole = catchAsyncError(async (req, res, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    };
  
    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });
  
    res.status(200).json({
        success: true,
        user
    });
});
  
// Delete User -- Admin

exports.deleteUser = catchAsyncError(async (req, res, next) => {

    const user = await User.findById(req.params.id);

    if (!user) 
        return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 400));
    
    const imageId = user.avatar.public_id;
    await cloudinary.v2.uploader.destroy(imageId);
    await user.remove();
    res.status(200).json({
        success: true,
        message: "User Deleted Successfully",
    });
});