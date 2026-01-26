import * as profiles from '../../models/profile.models.js';
import AppError from '../../utils/appError.js';

export const profileFetch = async (user_id, role) => {
  const userid = user_id;
  const userRole = role;

  const findUserProfile = await profiles.profileFind(userid);

  let userFindObj;

  if (!findUserProfile.id && !findUserProfile.user_id) {
    const insertUserInDB = await profiles.profileInsertUserId(userid);
    console.log('This is find user: ', findUserProfile.id, findUserProfile.user_id);
    return (userFindObj = insertUserInDB);
  }

  console.log('Object is find user: ', userFindObj.id, userFindObj.user_id);

  // console.log('Test after not find user insert value: ', userFindObj.id, userFindObj.user_id);

  switch (role) {
    case 'student':
      const studentProfile = await studentBaseProfileFetch(userInsertInProfile.id, userRole);
      return studentProfile;

    case 'employee':
      const employeeProfile = await employeeBaseProfileFetch(user_id, role);
      return employeeProfile;

    case 'company':
      const companyProfile = await companyBaseProfileFetch(user_id, role);
      return companyProfile;

    case 'admin':
      const adminProfile = await adminBaseProfileFetch(user_id, role);
      return adminProfile;

  }

  return userFindObj;
};

async function studentBaseProfileFetch(userId, userRole) {
  const userid = userId;
  const role = userRole;

  const studentProfileFetchDB = await profiles.studentBaseProfileFetch(userid, role);

  if (!studentProfileFetchDB) throw new AppError('User Profile Not Find', 404);

  return studentProfileFetchDB;
}

async function employeeBaseProfileFetch(userId, userRole) {
  const userid = userId;
  const role = userRole;

  const studentProfileFetchDB = await profiles.studentBaseProfileFetch(userid, role);

  if (!studentProfileFetchDB) throw new AppError('User Profile Not Find', 404);

  return studentProfileFetchDB;
}
