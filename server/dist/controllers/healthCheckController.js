"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthCheck = void 0;
// Health Check Controller
var healthCheck = function (req, res) {
    try {
        // If needed, add additional checks, such as DB connection
        res.status(200).json({ status: 'OK', message: 'Service is healthy' });
    }
    catch (err) {
        console.error('Health check failed:', err);
        res.status(500).json({ status: 'FAIL', message: 'Service is unavailable' });
    }
};
exports.healthCheck = healthCheck;
