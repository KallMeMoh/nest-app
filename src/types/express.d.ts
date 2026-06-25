import { User } from '../user/entities/user.entity';

declare global {
  namespace Express {
    interface Request {
      user?: User & {
        _id: Types.ObjectId;
      } & {
        __v: number;
      };
      tokenId?: string;
    }
  }
}
