import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import TrainerChangeRequest from '../models/TrainerChangeRequest';
import ClientProfile from '../models/ClientProfile';
import TrainerProfile from '../models/TrainerProfile';

export const createRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw createError(401, 'Autenticação requerida.');

    const { requestedTrainerId, reason } = req.body as {
      requestedTrainerId?: string;
      reason?: string;
    };

    if (!requestedTrainerId) {
      return res.status(400).json({ message: 'requestedTrainerId é obrigatório.' });
    }

    // perfil de cliente deste user
    const clientProfile = await ClientProfile.findOne({ userId: req.user._id });
    if (!clientProfile) {
      return res.status(400).json({ message: 'Perfil de cliente não encontrado.' });
    }

    // garante que o PT existe e está validado
    const trainer = await TrainerProfile.findById(requestedTrainerId).select('validatedByAdmin');
    if (!trainer || !trainer.validatedByAdmin) {
      return res.status(400).json({ message: 'Treinador inválido ou não validado.' });
    }

    // evita múltiplos pedidos pendentes
    const existing = await TrainerChangeRequest.findOne({
      clientId: clientProfile._id,
      status: 'PENDING',
    });
    if (existing) {
      return res.status(409).json({ message: 'Já existe um pedido pendente.' });
    }

    const doc = await TrainerChangeRequest.create({
      clientId: clientProfile._id,
      currentTrainerId: clientProfile.trainerId ?? undefined,
      requestedTrainerId,
      reason,
      status: 'PENDING',
    });

    res.status(201).json(doc);
  } catch (err) {
    next(err);
  }
};

export const listRequests = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.query as { status?: string };

    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;

    const items = await TrainerChangeRequest
      .find(filter)
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (err) {
    next(err);
  }
};

export const decideRequest = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw createError(401, 'Autenticação requerida.');

    const { status } = req.body as { status?: 'APPROVED' | 'REJECTED' };

    if (!status || !['APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ message: 'status deve ser APPROVED ou REJECTED.' });
    }

    const request = await TrainerChangeRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Pedido não encontrado.' });

    if (request.status !== 'PENDING') {
      return res.status(400).json({ message: 'Pedido já foi decidido.' });
    }

    request.status = status;
    request.decidedByAdminId = req.user._id;
    await request.save();

    // se aprovado, atualiza o trainerId do ClientProfile
    if (status === 'APPROVED') {
      await ClientProfile.findByIdAndUpdate(
        request.clientId,
        { $set: { trainerId: request.requestedTrainerId } },
      );
    }

    res.json(request);
  } catch (err) {
    next(err);
  }
};
