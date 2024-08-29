"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = App;
const express_1 = __importDefault(require("express"));
const user_1 = require("./src/routes/user");
const cors_1 = require("./src/middleware/cors");
const dotenv_1 = require("dotenv");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
function App(userModel) {
    const app = (0, express_1.default)();
    const port = process.env["PORT"] ?? 1234;
    app.disable('x-powered-by');
    app.use(dotenv_1.config);
    app.use((0, cookie_parser_1.default)());
    app.use(express_1.default.json());
    app.use((0, cors_1.corsMiddleware)());
    app.use('/users', (0, user_1.createUserRouter)(userModel));
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}
