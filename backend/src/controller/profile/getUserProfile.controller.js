import { profileFetch, userProfileDataFieldInsert } from "../../services/profiles/getUserProfile.service.js";
import AppError from "../../utils/appError.js";
import jwt from "jsonwebtoken";
import { uploadFileToCloudinary } from "../../utils/cloudinaryUpload.js";

export const findUserProfileController = async (req, res) => {
  const { accessToken } = req.cookies;

  if (!accessToken) throw new AppError("Token is missing try againa later", 401);

  const decode = jwt.verify(accessToken, process.env.ACCESS_TOKEN);

  const userDataFetchForProfile = {
    id: decode.id,
    role: decode.role
  };

  if (!userDataFetchForProfile.role) throw new AppError("Please firest user role", 401);

  const user = await profileFetch(userDataFetchForProfile.id, userDataFetchForProfile.role);

  if (!user) throw new AppError("User not found", 404);

  res.status(200).json({ message: "User profile fetch", user: user });
};


export const userProfileDataInsert = async (req, res) => {
  const bodyData = req.body;
  const { accessToken } = req.cookies;

  const tokenVerfyDecode = jwt.verify(accessToken, process.env.ACCESS_TOKEN);

  const valueObject = {
    id: tokenVerfyDecode.id,
    role: tokenVerfyDecode.role
  };

  if (!valueObject) throw new AppError("Token is missing please first login", 404);

  let imageUrl;
  if (req.file) {
    const avatarBuffer = req.file?.path;
    imageUrl = await uploadFileToCloudinary(avatarBuffer, "User profile Image");
  }

  const userDataInsertHere = await userProfileDataFieldInsert(valueObject.id, valueObject.role, bodyData, imageUrl);

  res.status(200).json({ message: "User successfully add", userDataInsertHere });
};