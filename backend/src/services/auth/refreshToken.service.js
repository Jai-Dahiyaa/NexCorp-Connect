import * as userModel from '../../models/users.models.js';
import AppError from '../../utils/appError.js';

const refreshTokenService = async (email) => {
  if (!email) throw new AppError('email not find unauthorized', 402);

  const result = await userModel.refreshRouteGetUsers(email);
  if (!result) throw new AppError('Users not find', 404);

  const users = {
    id: result.id,
    email: result.email,
    role: result.role,
    status: result.status,
    created_at: result.created_at
  }

  if(!users) throw new AppError('Users value get problem', 404)

  return { message: 'Refresh User successfully find', users };
};


export default refreshTokenService;