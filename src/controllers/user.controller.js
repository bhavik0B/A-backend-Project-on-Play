import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler( async (req, res) => {
    //get user details from frontend
    const {fullName, email, uername, password} = req.body;
    console.log("email", email);
    console.log("password", password);

    //validation - non empty
    if(
        [fullName, email, uername, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    //check if user already exists : username, email
    const existedUser = await User.findOne({$or: [{username}, {email}]})
    if (existedUser) {
        throw new ApiError(409, "Username or email already exists")
    }

    // check for images, check for avatar
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalpath = req.files?.coverImage[0]?.path;
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar File is required")
    }

    // upload them to cloudinary ,avatar
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalpath)

    // check avatar exists
    if (!avatar) {
        throw new ApiError(400, "Failed to upload avatar to cloudinary")
    }

    // create user object - create entry in db
    User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    }) 

    // remove password and refresh token field from response
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken" 
    )

    // check for user creation 
    if(!createdUser) {
        throw new ApiError(500, "Failed to create user")
    }

    //return res
    return res.status(201).json(
        new ApiREsponse(200, createdUser, "User registered Successfully")
    )



 
})

export {registerUser}