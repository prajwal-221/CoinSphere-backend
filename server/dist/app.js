"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var http_errors_1 = __importDefault(require("http-errors"));
var exampleRoutes_1 = __importDefault(require("./routes/exampleRoutes"));
var userRoutes_1 = __importDefault(require("./routes/userRoutes"));
var mongoose_1 = __importDefault(require("mongoose"));
var config_1 = require("./config");
var errorHanlder_1 = require("./middleware/errorHanlder");
var passport_1 = __importDefault(require("passport"));
var passport_2 = __importDefault(require("./middleware/passport"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var cors_1 = __importDefault(require("cors"));
var healthCheckRoutes_1 = __importDefault(require("./routes/healthCheckRoutes"));
var app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: [process.env.FRONTEND_URL], credentials: true }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(passport_1.default.initialize());
(0, passport_2.default)(passport_1.default);
// Health check should be before the 404 handler
app.use('/api/health', healthCheckRoutes_1.default); // Mount the health check routes
app.use("/", exampleRoutes_1.default);
app.use("/user", userRoutes_1.default);
// 404 handler should be at the end
app.use(function () {
    throw (0, http_errors_1.default)(404, "Route not found");
});
app.use(errorHanlder_1.errorHandler);
mongoose_1.default
    .connect(config_1.DB)
    .then(function () {
    console.log("Connected to db");
    app.listen(config_1.PORT, function () {
        console.log("Listening On PORT ".concat(config_1.PORT));
    });
})
    .catch(function () {
    throw (0, http_errors_1.default)(501, "Unable to connect database");
});
