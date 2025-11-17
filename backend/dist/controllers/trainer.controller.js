"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTrainer = exports.listAll = exports.updateMyProfile = exports.getMyProfile = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const TrainerProfile_1 = __importDefault(require("../models/TrainerProfile"));
const TRAINER_FIELDS = ['certification', 'specialties', 'avatarUrl', 'documentUrls', 'hourlyRate'];
const sanitizeUpdate = (payload) => Object.fromEntries(Object.entries(payload).filter(([key]) => TRAINER_FIELDS.includes(key)));
const getMyProfile = async (req, res, next) => {
    try {
        if (!req.user)
            throw (0, http_errors_1.default)(401, 'Autenticação requerida.');
        const prof = await TrainerProfile_1.default.findOne({ userId: req.user._id });
        if (!prof)
            throw (0, http_errors_1.default)(404, 'Perfil de treinador não encontrado');
        res.json(prof);
    }
    catch (err) {
        next(err);
    }
};
exports.getMyProfile = getMyProfile;
const updateMyProfile = async (req, res, next) => {
    var _a;
    try {
        if (!req.user)
            throw (0, http_errors_1.default)(401, 'Autenticação requerida.');
        const patch = sanitizeUpdate((_a = req.body) !== null && _a !== void 0 ? _a : {});
        if (Array.isArray(patch.specialties)) {
            patch.specialties = patch.specialties.map((s) => String(s));
        }
        const prof = await TrainerProfile_1.default.findOneAndUpdate({ userId: req.user._id }, { $set: { ...patch, userId: req.user._id } }, { new: true, upsert: true, setDefaultsOnInsert: true });
        res.json(prof);
    }
    catch (err) {
        next(err);
    }
};
exports.updateMyProfile = updateMyProfile;
const listAll = async (req, res, next) => {
    try {
        const { validated } = req.query;
        const filter = {};
        if (validated === 'true')
            filter.validatedByAdmin = true;
        if (validated === 'false')
            filter.validatedByAdmin = false;
        const trainers = await TrainerProfile_1.default.find(filter).sort({ createdAt: -1 });
        res.json(trainers);
    }
    catch (err) {
        next(err);
    }
};
exports.listAll = listAll;
const validateTrainer = async (req, res, next) => {
    try {
        const trainer = await TrainerProfile_1.default.findByIdAndUpdate(req.params.id, { $set: { validatedByAdmin: true, validatedAt: new Date() } }, { new: true });
        if (!trainer)
            throw (0, http_errors_1.default)(404, 'Trainer não encontrado');
        res.json(trainer);
    }
    catch (err) {
        next(err);
    }
};
exports.validateTrainer = validateTrainer;
