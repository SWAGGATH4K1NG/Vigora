import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import TrainerProfile from '../models/TrainerProfile';


const TRAINER_FIELDS = ['certification', 'specialties', 'avatarUrl', 'documentUrls', 'hourlyRate'] as const;
type TrainerField = (typeof TRAINER_FIELDS)[number];

const sanitizeUpdate = (payload: Record<string, unknown>): Record<string, unknown> =>
  Object.fromEntries(
    Object.entries(payload).filter(([key]) => TRAINER_FIELDS.includes(key as TrainerField))
  );

export const getMyProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw createError(401, 'Autenticação requerida.');
    const prof = await TrainerProfile.findOne({ userId: req.user._id });
    if (!prof) throw createError(404, 'Perfil de treinador não encontrado');
    res.json(prof);
  } catch (err) { next(err); }
};

export const updateMyProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw createError(401, 'Autenticação requerida.');
    const patch = sanitizeUpdate(req.body ?? {});
    if (Array.isArray(patch.specialties)) {
      patch.specialties = patch.specialties.map((s: unknown) => String(s));
    }
    const prof = await TrainerProfile.findOneAndUpdate(
      { userId: req.user._id },
      { $set: { ...patch, userId: req.user._id } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.json(prof);
  } catch (err) { next(err); }
};

export const listAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { validated } = req.query as { validated?: string };
    const filter: Record<string, unknown> = {};
    if (validated === 'true') filter.validatedByAdmin = true;
    if (validated === 'false') filter.validatedByAdmin = false;
    const trainers = await TrainerProfile.find(filter).sort({ createdAt: -1 });
    res.json(trainers);
  } catch (err) { next(err); }
};

export const validateTrainer = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  try {
    const trainer = await TrainerProfile.findByIdAndUpdate(
      req.params.id,
      { $set: { validatedByAdmin: true, validatedAt: new Date() } },
      { new: true }
    );
    if (!trainer) throw createError(404, 'Trainer não encontrado');
    res.json(trainer);
  } catch (err) { next(err); }
};

export const listPublicTrainers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const trainers = await TrainerProfile
      .find({ validatedByAdmin: { $ne: null } })
      .populate('userId', 'username profile.firstName profile.lastName profile.avatarUrl')
      .sort({ createdAt: -1 });

    res.json(trainers);
  } catch (err) {
    next(err);
  }
};
