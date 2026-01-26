import {profileFetch} from "../../services/profiles/getUserProfile.service.js"

export const findUserProfileController = async (req, res) => {
  const {id} = req.body;
  const role = "student";

  const user = await profileFetch(id, role);

  res.status(200).json({message: "User profile fetch", id: user.id, userID: user.user_id})
}