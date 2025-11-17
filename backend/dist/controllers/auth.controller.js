"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refresh = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = __importDefault(require("../models/User"));
const jwt_1 = require("../utils/jwt");
const sanitizeUser = (user) => ({
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    profile: user.profile,
});
const register = async (req, res, next) => {
    try {
        const { username, email, password, firstName, lastName, role } = req.body;
        if (!username || !email || !password || !firstName || !lastName) {
            return res.status(400).json({ message: 'Campos obrigatórios: username, email, password, firstName, lastName.' });
        }
        const normalizedRole = role !== null && role !== void 0 ? role : 'CLIENT';
        if (!['ADMIN', 'TRAINER', 'CLIENT'].includes(normalizedRole)) {
            return res.status(400).json({ message: 'Role inválido.' });
        }
        const exists = await User_1.default.findOne({ $or: [{ email }, { username }] });
        if (exists)
            return res.status(409).json({ message: 'Email ou username já existe.' });
        const passwordHash = await bcrypt_1.default.hash(password, 12);
        const user = await User_1.default.create({
            username,
            email,
            passwordHash,
            role: normalizedRole,
            profile: { firstName, lastName },
            isActive: true,
        });
        const accessToken = (0, jwt_1.signAccess)(user);
        const refreshToken = (0, jwt_1.signRefresh)(user);
        res.status(201).json({
            user: sanitizeUser(user),
            accessToken,
            refreshToken,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const { emailOrUsername, password } = req.body;
        if (!emailOrUsername || !password) {
            return res.status(400).json({ message: 'Campos obrigatórios: emailOrUsername e password.' });
        }
        const user = await User_1.default.findOne({
            $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
        });
        if (!user)
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        if (!user.isActive)
            return res.status(403).json({ message: 'Conta desativada.' });
        const valid = await bcrypt_1.default.compare(password, user.passwordHash);
        if (!valid)
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        const accessToken = (0, jwt_1.signAccess)(user);
        const refreshToken = (0, jwt_1.signRefresh)(user);
        res.json({
            user: sanitizeUser(user),
            accessToken,
            refreshToken,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.login = login;
const refresh = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken)
            return res.status(400).json({ message: 'refreshToken é obrigatório.' });
        let payload;
        try {
            payload = (0, jwt_1.verifyRefresh)(refreshToken);
        }
        catch {
            return res.status(401).json({ message: 'Refresh token inválido ou expirado.' });
        }
        const user = await User_1.default.findById(payload.id);
        if (!user || !user.isActive)
            return res.status(401).json({ message: 'Utilizador inválido.' });
        const accessToken = (0, jwt_1.signAccess)(user);
        const newRefreshToken = (0, jwt_1.signRefresh)(user); // estratégia rotativa
        res.json({ accessToken, refreshToken: newRefreshToken });
    }
    catch (err) {
        next(err);
    }
};
exports.refresh = refresh;
