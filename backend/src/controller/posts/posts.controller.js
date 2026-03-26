import { deletePostServiceFunc, postEditServiceFunc, postServiceFunction, announcementStatusService, projectInterstedService, assignUserProjectService, projectCreateService, projectStatusChangeService } from "../../services/posts/posts.service.js";
import AppError from "../../utils/appError.js";
import { uploadFileToCloudinary } from "../../utils/cloudinaryUpload.js";
import jwt from "jsonwebtoken";
import { postDeleteQueue } from "../../jobs/queue/post.queue.js";
// import { getIO } from "../../config/socket.config.js"
// import { Socket } from "socket.io";

export const postControllerFunction = async (req, res) => {
    const { accessToken } = req.cookies;
    const { title, description, type } = req.body;
    const filePath = req.file?.path;

    if (!accessToken)
        throw new AppError("Access Token find please first login or signup", 400);

    const tokenDecode = jwt.verify(accessToken, process.env.ACCESS_TOKEN);

    const finalBodyDataObj = {
        id: tokenDecode.id,
        title: title,
        description: description,
        type: type,
        path: filePath
    };

    const imageUrl = await uploadFileToCloudinary(filePath, "post image");
    if (imageUrl) {
        finalBodyDataObj.image = imageUrl;
    }

    if (!finalBodyDataObj.id || !finalBodyDataObj.title || !finalBodyDataObj.description || !finalBodyDataObj.type || !finalBodyDataObj.path) throw new AppError("Post data all vale not insert", 404);

    const postInsert = await postServiceFunction(finalBodyDataObj);

    if (!postInsert)
        throw new AppError("POST not create please try again", 500);

    res.status(200).json({status: true, message: "User post successfully create", postInsert });
};

export const announcementStatusChangeController = async (req, res) => {
    const postId = Number(req.params.id);
    const { accessToken } = req.cookies;

    if (!accessToken) throw new AppError("Access token is missing", 404);

    const decodeToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN);

    let data = {
        userId: decodeToken.id,
        postId: postId,
    };

    if (req.body.status == "expire") {
        data.status = "expire";
    } else {
        data.status = "active";
    }

    if (!data) throw new AppError("Status base data missing", 404);

    const statusChangeResult = await announcementStatusService(data);

    if (!statusChangeResult) throw new AppError("Status not change please try again", 404);

    res.status(200).json({status: true, message: "Status Change successFully", statusChangeResult });
};

export const projectCreateController = async (req, res) => {
    const { accessToken } = req.cookies;
    const { title, description, type } = req.body;
    const filePath = req.file?.path;

    if (!accessToken)
        throw new AppError("Access Token find please first login or signup", 400);

    const tokenDecode = jwt.verify(accessToken, process.env.ACCESS_TOKEN);

    const finalBodyDataObj = {
        id: tokenDecode.id,
        title: title,
        description: description,
        type: type,
        path: filePath
    };

    const imageUrl = await uploadFileToCloudinary(filePath, "post image");
    if (imageUrl) {
        finalBodyDataObj.image = imageUrl;
    }

    if (!finalBodyDataObj.id || !finalBodyDataObj.title || !finalBodyDataObj.description || !finalBodyDataObj.type || !finalBodyDataObj.path) throw new AppError("Post data all vale not insert", 404);

    const projectResult = await projectCreateService(finalBodyDataObj);

    if (!projectResult)
        throw new AppError("Project not create please try again", 500);

    res.status(200).json({status: true, message: "User Project successfully create", projectResult });

};

export const projectStatusController = async (req, res) => {
    const postId = req.params.id;
    const { status } = req.body;
    const { accessToken } = req.cookies;

    if (
        status !== "open" &&
        status !== "in_progress" &&
        status !== "complete" &&
        status !== "expired" &&
        status !== "on_hold")
        throw new AppError("This value not valid for change project status", 402);

    if (!accessToken)
        throw new AppError("Access Token find please first login or signup", 400);

    const tokenDecode = jwt.verify(accessToken, process.env.ACCESS_TOKEN);

    const statusObj = {
        status: status,
        postId: postId,
        userId: tokenDecode.id
    };

    if (!statusObj) throw new AppError("Status not recive please try again", 404);

    const projectStatusChangeResult = await projectStatusChangeService(statusObj);

    if (!projectStatusChangeResult) throw new AppError("project change status not recive in db", 500);

    res.status(200).json({status: true, message: "Project status change successfully", projectStatusChangeResult });
};

export const interestProjectController = async (req, res) => {
    const postId = req.params.id;
    const { accessToken } = req.cookies;

    if (!accessToken) throw new AppError("Access token is missing", 404);
    const decodeToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN);

    const data = {
        postId: postId,
        userId: decodeToken.id
    };

    if (!data) throw new AppError("interest data not found for interested table", 404);

    const interestResult = await projectInterstedService(data);

    if (!interestResult) throw new AppError("Interest project not insert", 500);

    res.status(200).json({status: true, message: "Your interest add in this project please wait to connect", interestResult });
};

export const assignUserProjectController = async (req, res) => {
    const postId = req.params.id;
    const { accessToken } = req.cookies;

    if (!accessToken) throw new AppError("Access token is missing", 404);
    const decodeToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN);

    const data = {
        postId: postId,
        userId: decodeToken.id
    };

    if (!data) throw new AppError("Assign data not found for interested table", 404);

    const assignProjectResult = await assignUserProjectService(data);

    if (!assignProjectResult) throw new AppError("Assign project not insert", 500);

    res.status(200).json({status: true, message: "Project assign successfully", assignProjectResult });
};

export const postEditController = async (req, res) => {
    const { accessToken } = req.cookies;
    const postId = Number(req.params.id);
    const body = req.body;
    let fileUrl;

    if (req.file) {
        const imageFile = req.file?.path;
        const cloudUrl = await uploadFileToCloudinary(imageFile, "edit post image");
        fileUrl = cloudUrl;
    }

    if (!accessToken)
        throw new AppError("Access Token find please first login or signup", 400);

    const tokenDecode = jwt.verify(accessToken, process.env.ACCESS_TOKEN);

    const editObj = {
        edit: ["title", "description", "image"]
    };

    let postEditObj = {
        id: tokenDecode.id,
        postId: postId,
    };

    if (body) {
        for (let field of editObj.edit) {
            if (body[field] !== undefined) {
                postEditObj[field] = body[field];
            }
        }
    }

    if (fileUrl) {
        postEditObj.image = fileUrl;
    }

    if (!postEditObj)
        throw new AppError("Post Edit Data Not Insert", 404);

    const postEditResult = await postEditServiceFunc(postEditObj);

    if (!postEditResult)
        throw new AppError("Post not update please try again", 500);

    res.status(200).json({status: true, message: "Post Edit successfully", postEditResult });

};

export const deletePostControllerFunc = async (req, res) => {
    const postId = req.params.id;
    const { accessToken } = req.cookies;
    
    if (!accessToken)
        throw new AppError("AccessToken not find please first login and signup", 400);

    const decodeToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN);

    const userDataObject = {
        id: decodeToken.id,
        postId: postId
    };

    const result = await deletePostServiceFunc(userDataObject);

    if (!result)
        throw new AppError("result not found post not delete successfully please try again", 404);

    await postDeleteQueue.add("Post Delete", {
        userId: decodeToken.id,
        postId: result.id,
        actionType: "delete",
        message: `Your post '${result.title}' has been deleted`
    });

    // const io = getIO(); 
    // io.to("join", decodeToken.id).emit("notification", {
    //     message: `Your post '${result.title}' has been deleted`, 
    //     actionType: "delete"
    // }); 

    // io.to("join", 34).emit("notification", {
    //     message: `Your post '${result.title}' has been deleted`, 
    //     actionType: "delete"
    // }); 

    res.status(200).json({status: true, message: "Post Delete successfull", result });
};