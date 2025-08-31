"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// routes/healthCheckRoutes.ts
var express_1 = require("express");
var router = (0, express_1.Router)();
router.get("/", function (req, res) {
    res.status(200).send("Health check passed");
});
exports.default = router;
