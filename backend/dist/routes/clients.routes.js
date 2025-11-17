"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_controller_1 = require("../controllers/client.controller");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const requireRole_1 = __importDefault(require("../middleware/requireRole"));
const router = (0, express_1.Router)();
router.use(authMiddleware_1.default);
router.get('/me', (0, requireRole_1.default)('CLIENT'), client_controller_1.getMyProfile);
router.put('/me', (0, requireRole_1.default)('CLIENT'), client_controller_1.updateMyProfile);
exports.default = router;
