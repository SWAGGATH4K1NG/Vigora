"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMyProfile = exports.getMyProfile = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const ClientProfile_1 = __importDefault(require("../models/ClientProfile"));
const ALLOWED_FIELDS = ['goals', 'injuries', 'preferences'];
const pickAllowedFields = (payload) => {
    return Object.fromEntries(Object.entries(payload).filter(([key]) => ALLOWED_FIELDS.includes(key)));
};
const getMyProfile = async (req, res, next) => {
    try {
        if (!req.user)
            return res.status(401).json({ message: 'Autenticação requerida.' });
        const prof = await ClientProfile_1.default.findOne({ userId: req.user._id });
        if (!prof)
            throw (0, http_errors_1.default)(404, 'Perfil de cliente não encontrado');
        res.json(prof);
    }
    catch (e) {
        next(e);
    }
};
exports.getMyProfile = getMyProfile;
const updateMyProfile = async (req, res, next) => {
    var _a;
    try {
        if (!req.user)
            return res.status(401).json({ message: 'Autenticação requerida.' });
        const patch = pickAllowedFields((_a = req.body) !== null && _a !== void 0 ? _a : {});
        const updated = await ClientProfile_1.default.findOneAndUpdate({ userId: req.user._id }, { $set: { ...patch, userId: req.user._id } }, { new: true, upsert: true, setDefaultsOnInsert: true });
        res.json(updated);
    }
    catch (e) {
        next(e);
    }
};
exports.updateMyProfile = updateMyProfile;
