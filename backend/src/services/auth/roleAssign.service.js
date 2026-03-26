import * as userModel from "../../models/users.models.js";
import AppError from "../../utils/appError.js";
import { insertSessionsTokenFromRoleFile } from "../../models/sessions.models.js";

export const roleAssignUsers = async (email, role) => {
    if (!email || !role) throw new AppError("Required Email and Role Please Enter", 402);

    const users = await userModel.insertUserRole(email, role);

    if(!users) throw new AppError("User Role not assign", 500)

    return users ;
};

export const refreshTokenStore = async (userId, refreshToken, expiresAt, userAgent, ipAdress) => {
    const dataToken = {
        id: userId,
        token: refreshToken,
        expires_at: expiresAt,
        user_agent: userAgent,
        ip_address: ipAdress
    };

    if (!dataToken.id && !dataToken.token && !dataToken.expires_at) throw new AppError("Token data is missing please again SignUp", 401);

    const tokenInsert = await insertSessionsTokenFromRoleFile(dataToken.id, dataToken.token, dataToken.expires_at, dataToken.user_agent, dataToken.ip_address);

    if (!tokenInsert) throw new AppError("DB Response problem", 500);

    return tokenInsert;
};
