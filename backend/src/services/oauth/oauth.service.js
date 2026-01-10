import * as usersModels from '../../models/users.models.js';
import AppError from '../../utils/appError.js';
import * as socialLogin from '../../models/socialLogin.models.js';
import { profileInserData } from '../../models/profile.models.js';
import bcrypt from 'bcrypt';

const oauthServiceFunction = async (profile) => {
  if (!profile) throw new AppError(`Platfrom auth problem Please try again`, 500);

  const platform = profile.provider;
  const id = profile.id;
  const name = profile.displayName || profile.username || 'NoName';
  const email = profile.emails?.[0]?.value || null;
  const photo = profile.photos?.[0]?.value || null;

  if (!platform || !id || !name || !email || !photo)
    throw new AppError('Not provide Perfect user detail', 400);

  const userData = {
    platform,
    platformId: id,
    name,
    email,
    photo,
  };

  const findUser = await usersModels.findByEmail(userData.email);

  if (findUser) {
    const updateUsers = await socialLogin.updateSocialLogin(
      userData.platform,
      userData.platformId,
      findUser.id
    );

    return { message: 'Welcome Back', user: findUser, social: updateUsers };
    
    // throw new AppError('User Already Register', 409);
  } else {
    const insertUserSocialData = await usersModels.oauthLoginSocial(userData.email);

    const authUserData = {
      id: insertUserSocialData.id,
      email: insertUserSocialData.email,
    };

    const platformIdHash = await bcrypt.hash(userData.platformId, 10);

    const socialLoginDB = await socialLogin.socialLogin(
      authUserData.id,
      userData.platform,
      platformIdHash
    );

    const profileUpdate = await profileInserData(userData.name, userData.photo, authUserData.id);

    if (!authUserData.email && !authUserData.id)
      throw new AppError('Bad Request Please try again', 400);

    return {
      message: `user register successfully`,
      user: insertUserSocialData.email,
      social: socialLoginDB,
      profile: profileUpdate,
    };
  }
};

export default oauthServiceFunction;
