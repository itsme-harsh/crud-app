import jwt from 'jsonwebtoken';
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/ayncHandler.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        console.log(process.env.ACCESS_TOKEN_SECRET)
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        console.log(token)
        if (!token) {
            throw new ApiError(401, "Unauthorised request");
        }


        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        console.log("decodedToken: ",decodedToken);

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
        console.log("user: ",user);

        if (!user) {
            throw new ApiError(401, "Invalid Access Token");
        }

        req.user = user;
        next();

    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access Token");
    }

})