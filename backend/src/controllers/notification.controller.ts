import { Request, Response, NextFunction } from 'express';
import Notification from '../models/Notification';

export const listMyNotifications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Não autenticado.' });

    const { onlyUnread } = req.query as { onlyUnread?: string };

    const filter: any = { recipientId: req.user._id };
    if (onlyUnread === 'true') filter.isRead = false;

    const items = await Notification
      .find(filter)
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (err) {
    next(err);
  }
};

export const markNotificationRead = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Não autenticado.' });

    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipientId: req.user._id },
      { $set: { isRead: true } },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notificação não encontrada.' });
    }

    res.json(notification);
  } catch (err) {
    next(err);
  }
};
