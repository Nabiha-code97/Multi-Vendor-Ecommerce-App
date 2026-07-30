import express from "express"

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/activate-account", activateUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", logoutUser);
userRouter.get("/me", authUser, getCurrentUser);
userRouter.put("/me",updateUserInfo)
userRouter.put("/avatar",updateUserAvatar)
userRouter.put("/",updateUserAddresses)
// 6. updateUserInfo

// 7. updateUserAvatar

// 8. updateUserAddresses

// 9. deleteUserAddress

// 10. updateUserPassword

// 11. getUserById

// 12. getAllUsers

// 13. deleteUser