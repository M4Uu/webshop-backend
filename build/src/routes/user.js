"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserRouter = void 0;
const express_1 = require("express");
const user_1 = require("../controllers/user");
const createUserRouter = (userModel) => {
    const userRouter = (0, express_1.Router)();
    const userController = new user_1.UserController(userModel);
    // ENDPOINTS
    userRouter.get('/protected', userController.protected);
    userRouter.get('/logout', userController.logOut);
    userRouter.post('/login', userController.getUser);
    userRouter.post('/register', userController.register);
    userRouter.patch('/upload', userController.upload);
    return userRouter;
};
exports.createUserRouter = createUserRouter;
