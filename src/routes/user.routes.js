import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import {upload } from "../middlewares/multer.middleware.js";


const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
    )

    // router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)
    // router.route("/cover-image").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage)

export default router 