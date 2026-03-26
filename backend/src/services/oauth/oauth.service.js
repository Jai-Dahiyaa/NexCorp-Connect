import * as usersModels from "../../models/users.models.js";
import AppError from "../../utils/appError.js";
import * as socialLogin from "../../models/socialLogin.models.js";
import { profileInserDataOAuth } from "../../models/profile.models.js";

const oauthServiceFunction = async (userProfile) => {
  const profile = userProfile;

  if (!profile) throw new AppError("Platfrom auth problem Please try again", 500);

  const findUserHere = await usersModels.findByEmail(profile.email);

  if (findUserHere) {
    const userAlreadySign = await userAlreadyRegister(profile, findUserHere);
    return userAlreadySign;
  }

  const profileDataObj = {
    id: profile.id,
    email: profile.email,
    name: profile.name,
    provider: profile.provider,
    image: profile.photo,
  };

  let firstRegisterUser = {
    id: null,
    email: null,
    provider: null,
  };

  const firstInsertUserSocialData = await usersModels.oauthLoginSocial(profileDataObj.email);

  const userSocialDataInsert = await socialLogin.socialLoginDataInsert(firstInsertUserSocialData.id, profileDataObj.provider, profileDataObj.id);

  if (firstInsertUserSocialData && userSocialDataInsert) {
    firstRegisterUser.id = firstInsertUserSocialData.id;
    firstRegisterUser.email = firstInsertUserSocialData.email;
    firstRegisterUser.provider = profileDataObj.provider;
  }

  await profileInserDataOAuth(profileDataObj.name, profileDataObj.image, firstInsertUserSocialData.id);

  if (!firstRegisterUser) throw new AppError("User create successfully please try again", 401);
  if (profileDataObj.id !== userSocialDataInsert.provider_user_id) throw new AppError("Platform id is not equal please try again", 401);

  return firstRegisterUser;

};

async function userAlreadyRegister(profile, findUserHere) {
  if (!profile) throw new AppError("Profile is missing please try again", 404);

  let user = {
    id: null,
    email: null,
    provider: null,
  };

  if (findUserHere) {
    user.id = findUserHere.id;
    user.email = findUserHere.email;
  }

  let socialTableFindUser = await socialLogin.findUserInSocail(findUserHere.id);

  if (!socialTableFindUser) {
    const userSocialDataInsert = await socialLogin.socialLoginDataInsert(findUserHere.id, profile.provider, profile.id);
    socialTableFindUser = userSocialDataInsert;
  }

  if (socialTableFindUser) {
    await socialLogin.updateSocialLogin(socialTableFindUser.user_id);
    user.provider = socialTableFindUser.provider;
  }

  if (profile.id !== socialTableFindUser.provider_user_id) throw new AppError("User id is not match perfect please try again", 401);

  if (!user) throw new AppError("Please try again", 401);

  return user;
}

export default oauthServiceFunction;
