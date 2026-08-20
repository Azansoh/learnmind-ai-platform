import express from "express";
import { register, login, getMe, logout, updateProfile, changePassword } from "../controllers/auth.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.post("/logout", logout);
router.put("/update-profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);

export default router;
