"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleUserActive = exports.searchUsers = exports.updateMe = exports.getMe = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const User_1 = __importDefault(require("../models/User"));
const parsePagination = (value, fallback) => {
    if (!value)
        return fallback;
    const parsed = Number.parseInt(value, 10);
    return Number.isNaN(parsed) ? fallback : parsed;
};
const getMe = async (req, res, next) => {
    try {
        if (!req.user)
            throw (0, http_errors_1.default)(401, 'Autenticação requerida.');
        const me = await User_1.default.findById(req.user._id).select('-passwordHash');
        if (!me)
            throw (0, http_errors_1.default)(404, 'Utilizador não encontrado');
        res.json(me);
    }
    catch (e) {
        next(e);
    }
};
exports.getMe = getMe;
const updateMe = async (req, res, next) => {
    try {
        if (!req.user)
            throw (0, http_errors_1.default)(401, 'Autenticação requerida.');
        const { email, firstName, lastName, avatarUrl, bio } = req.body;
        const update = {};
        if (email)
            update.email = email;
        if (firstName)
            update['profile.firstName'] = firstName;
        if (lastName)
            update['profile.lastName'] = lastName;
        if (avatarUrl !== undefined)
            update['profile.avatarUrl'] = avatarUrl;
        if (bio !== undefined)
            update['profile.bio'] = bio;
        const updated = await User_1.default.findByIdAndUpdate(req.user._id, { $set: update }, { new: true }).select('-passwordHash');
        res.json(updated);
    }
    catch (e) {
        next(e);
    }
};
exports.updateMe = updateMe;
const searchUsers = async (req, res, next) => {
    try {
        const { q = '', role } = req.query;
        const page = Math.max(1, parsePagination(req.query.page, 1));
        const limit = Math.max(1, Math.min(100, parsePagination(req.query.limit, 20)));
        const skip = (page - 1) * limit;
        const filter = {};
        if (q) {
            const regex = new RegExp(q, 'i');
            filter.$or = [
                { username: regex },
                { email: regex },
                { 'profile.firstName': regex },
                { 'profile.lastName': regex },
            ];
        }
        if (role)
            filter.role = role;
        const [docs, total] = await Promise.all([
            User_1.default.find(filter).select('-passwordHash').skip(skip).limit(limit),
            User_1.default.countDocuments(filter),
        ]);
        res.json({ data: docs, page, total });
    }
    catch (e) {
        next(e);
    }
};
exports.searchUsers = searchUsers;
const toggleUserActive = async (req, res, next) => {
    try {
        const user = await User_1.default.findById(req.params.id);
        if (!user)
            throw (0, http_errors_1.default)(404, 'Utilizador não encontrado');
        user.isActive = !user.isActive;
        await user.save();
        res.json({ id: user._id, isActive: user.isActive });
    }
    catch (e) {
        next(e);
    }
};
exports.toggleUserActive = toggleUserActive;
