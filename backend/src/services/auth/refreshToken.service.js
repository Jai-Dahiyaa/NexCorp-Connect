import * as userModel from "../../models/users.models.js";
import AppError from "../../utils/appError.js";
import { accessTokenReGenerateWithRefresh } from "../../models/sessions.models.js";

const refreshTokenService = async (id) => {
  if (!id) throw new AppError("id not find unauthorized", 402);

  const result = await userModel.refreshRouteGetUsers(id);
  if (!result) throw new AppError("Users not find", 404);

  const users = {
    id: result.id,
    email: result.email,
    role: result.role,
    status: result.status,
    created_at: result.created_at
  };

  if (!users.id && !users.email && !users.role) throw new AppError("Users value get problem", 404);

  const refreshTokenFromDB = await accessTokenReGenerateWithRefresh(id);

  return { message: "Refresh User successfully find", users, refreshTokenFromDB };
};


export default refreshTokenService;