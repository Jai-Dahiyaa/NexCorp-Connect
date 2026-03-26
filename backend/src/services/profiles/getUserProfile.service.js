import * as profiles from "../../models/profile.models.js";
import AppError from "../../utils/appError.js";

export const profileFetch = async (user_id, role) => {
  const userid = user_id;
  const userRole = role;

  let findUserProfile = await profiles.profileFind(userid);

  let addUserData;

  if (!findUserProfile) {
    addUserData = await profiles.profileInsertUserId(userid);
  } else if (findUserProfile) {
    addUserData = findUserProfile;
  }

  if (!addUserData) throw new AppError("!User not found", 404);

  const finalObjUser = {
    id: addUserData.user_id,
    role: userRole
  };

  if (!finalObjUser.user_id && !finalObjUser.role) throw new AppError("Please try again: ", 401);

  const userFinalGet = await roleBaseAcess(finalObjUser);

  return userFinalGet;
};

let finalUserIsHere;

async function roleBaseAcess(user) {
  const id = user.id;
  const role = user.role;

  switch (role) {
    case "student":
      const studentDATA = await studentBaseProfileFetch(id, role);
      finalUserIsHere = studentDATA;
      break;
    case "company":
      const companyDATA = await companyBaseProfileFetch(id, role);
      finalUserIsHere = companyDATA;
      break;
    case "employee":
      const employeeDATA = await employeeProfileFetch(id, role);
      finalUserIsHere = employeeDATA;
      break;
    case "admin":
      const adminDATA = await adminProfileFetch(id, role);
      finalUserIsHere = adminDATA;
      break;
  }

  return finalUserIsHere;
}

async function studentBaseProfileFetch(userId, userRole) {
  const userid = userId;
  const role = userRole;

  const studentProfileFetchDB = await profiles.studentBaseProfileFetch(userid, role);

  if (!studentProfileFetchDB) throw new AppError("User Profile Not Find", 404);

  return studentProfileFetchDB;
}

async function companyBaseProfileFetch(userId, userRole) {
  const userid = userId;
  const role = userRole;

  const companyProfileFetchDB = await profiles.companyBaseProfileFetch(userid, role);

  if (!companyProfileFetchDB) throw new AppError("User Profile Not Find", 404);

  return companyProfileFetchDB;
}

async function employeeProfileFetch(userId, userRole) {
  const userid = userId;
  const role = userRole;

  const employeeProfileFetchDB = await profiles.employeeBaseProfileFetch(userid, role);

  if (!employeeProfileFetchDB) throw new AppError("User Profile Not Find", 404);

  return employeeProfileFetchDB;
}

async function adminProfileFetch(userId, userRole) {
  const userid = userId;
  const role = userRole;

  const adminProfileFetchDB = await profiles.adminBaseProfileFetch(userid, role);

  if (!adminProfileFetchDB) throw new AppError("User Profile Not Find", 404);

  return adminProfileFetchDB;
}

//User Profile Data fill Here

export const userProfileDataFieldInsert = async (userId, userRole, body, file) => {
  const role = userRole;
  const id = userId;
  const avatarFile = file || "undefined";

  if(!role && !id) throw new AppError("ID and Role is missing please try again", 401);


  if (!role && userProfileId) throw new AppError("User value is missing", 404);

  const profileUpdateHere = await userFieldDataInsert(id, body, role, avatarFile);

  return profileUpdateHere;
};

async function userFieldDataInsert(id, body, role, avatarFile) {

  let UpdateFieldDataGetReady;

  const roleFields = {
    admin: ["company_name", "phone", "avatar_url", "bio", "profiles_source", "industry", "experience_year", "department"],
    student: ["full_name", "avatar_url", "phone", "bio", "dob", "course", "year", "college_name"],
    company: ["company_name", "avatar_url", "phone", "bio", "industry", "experience_year", "department"],
    employee: ["full_name", "company_name", "avatar_url", "phone", "bio", "dob", "industry", "experience_year", "department"]
  };

  const allowedFields = roleFields[role];

  for (let field of allowedFields) {
    if (body[field] !== undefined) {
      const updateHereAllField = await profiles.advanceFieldUpdate(field, body[field], id);
      UpdateFieldDataGetReady = updateHereAllField;
    } 
    
    if (field === "full_name" && body[field] !== undefined) {
      const updateHereAllField = await profiles.advanceFieldNameUpdate(field, body[field], id);
      UpdateFieldDataGetReady = updateHereAllField;
    } 
    
    if (field === "avatar_url" && avatarFile) {
      const updateHereAllField = await profiles.advanceFieldImageUpdate("avatar_url", avatarFile, id);
      UpdateFieldDataGetReady = updateHereAllField;
    }
  }
  return UpdateFieldDataGetReady;
}
