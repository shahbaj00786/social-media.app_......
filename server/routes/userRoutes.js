import express from "express";
import { protect } from "../middleware/auth.js";
import {
  acceptConnectionReq,
  discoverUsers,
  followUsers,
  getUserConnections,
  getUserData,
  getUserProfiles,
  sendConnectionRequest,
  unFollowUsers,
  updateUserData,
} from "../controllers/userController.js";
import { upload } from "../configs/multer.js";
import { getUserRecentMessages } from "../controllers/messageContollers.js";

const userRouter = express.Router();

userRouter.get("/data", getUserData);
userRouter.post(
  "/update",
  upload.fields([
    { name: "profile", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  protect,
  updateUserData
);
userRouter.post("/discover", protect, discoverUsers);
userRouter.post("/follow", protect, followUsers);
userRouter.post("/unfollow", protect, unFollowUsers);
userRouter.post("/connect", protect, sendConnectionRequest);
userRouter.post("/accept", protect, acceptConnectionReq);
userRouter.post("/connections", protect, getUserConnections);
userRouter.post("/profiles", protect, getUserProfiles);
userRouter.get("/recent-messages", protect, getUserRecentMessages);

export default userRouter;
