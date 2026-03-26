import * as posts from "../../models/posts.models.js";
import * as uploads from "../../models/uploads.models.js";
import * as interests from "../../models/interests.models.js";
import AppError from "../../utils/appError.js";

export const postServiceFunction = async (postData) => {
    const postValue = postData;
    if (!postValue)
        throw new AppError("IN SERVICE NOT ADD VALUE: ", 401);

    let postCreateData;

    if (postValue.type === "post") {
        const insertPostTable = await posts.normalPostInsertDB(postValue.id, postValue.title, postValue.description, postValue.type);
        postCreateData = insertPostTable;
    }

    if (postValue.type === "announcement") {
        const insertPostTable = await posts.announcementPostCreate(postValue.id, postValue.title, postValue.description, postValue.type);
        postCreateData = insertPostTable;
    }

    if (!postCreateData)
        throw new AppError("Post table data not insert", 500);

    const uploadTableInsert = await uploads.normalUploadInsertDB(postCreateData.id, postValue.image, postValue.id, postValue.path);

    if (!uploadTableInsert)
        throw new AppError("Upload table data not insert", 500);

    if (uploadTableInsert) {
        postCreateData.image = uploadTableInsert.fileUrl;
    }

    if (!postCreateData)
        throw new AppError("POST is not create successfully", 500);

    return postCreateData;
};

export const announcementStatusService = async (data) => {
    if (!data) throw new AppError("Announcement Status data not find", 404);

    const statusChange = data;

    const changeStatus = await posts.changeAnnouncementStatus(statusChange.status, statusChange.postId, statusChange.userId);

    if (!changeStatus) throw new AppError("Announcement Post Status not change", 500);

    return changeStatus;
};

export const projectCreateService = async (data) => {
    if (!data) throw new AppError("Project Status data not find", 404);

    let postCreateData;

    const projectCreateData = data;

    if (projectCreateData.type === "project") {
        const insertPostTable = await posts.projectPostCreate(projectCreateData.id, projectCreateData.title, projectCreateData.description, projectCreateData.type);
        postCreateData = insertPostTable;
    }

    if (!postCreateData)
        throw new AppError("Post table data not insert", 500);

    const uploadTableInsert = await uploads.normalUploadInsertDB(postCreateData.id, projectCreateData.image, projectCreateData.id, projectCreateData.path);

    if (!uploadTableInsert)
        throw new AppError("Upload table data not insert", 500);

    if (uploadTableInsert) {
        postCreateData.image = uploadTableInsert.fileUrl;
    }

    return postCreateData;
};

export const projectStatusChangeService = async (data) => {
    if (!data) throw new AppError("Project Status change data is missing", 404);

    const PstatusData = data;

    const projectStatusChangeDB = await posts.projectStatusChange(PstatusData.status, PstatusData.userId, PstatusData.postId);

    if (PstatusData === projectStatusChangeDB.status) throw new AppError("Your project status not change please try again", 500);

    if (!projectStatusChangeDB.status) throw new AppError("PROJECT status not change please try again");

    return projectStatusChangeDB;
};

export const projectInterstedService = async (data) => {
    if (!data) throw new AppError("Post Inersted data not find", 404);

    const interestsData = data;

    const insertInterestDB = await interests.interestsInsertUser(interestsData.postId, interestsData.userId);

    if (!insertInterestDB) throw new AppError("Project Interests user not found", 404);

    return insertInterestDB;
};

export const assignUserProjectService = async (data) => {
    if (!data) throw new AppError("Project Assign user data not find", 404);

    const assignData = data;

    const assignUserDB = await posts.assignProjectUser(assignData.userId, assignData.postId);

    if (!assignUserDB) throw new AppError("Project Not assign user not found", 404);

    return assignUserDB;
};

export const postEditServiceFunc = async (editObj) => {
    const editData = editObj;
    if (!editObj)
        throw new AppError("Post Edit data not insert", 400);

    let updatePost;
    let updateImage;

    if (editData.title) {
        const postTitleEdit = await posts.postTitleUpdate(editData.title, editData.id, editData.postId);
        const uploadImageFetch = await uploads.fetchPostUpdateTime(editData.id, postTitleEdit.id);

        updatePost = postTitleEdit;
        updateImage = uploadImageFetch;
    }

    if (editData.description) {
        const postDescriptionEdit = await posts.postDescriptionUpdate(editData.description, editData.id, editData.postId);
        const uploadImageFetch = await uploads.fetchPostUpdateTime(editData.id, postDescriptionEdit.id);

        updatePost = postDescriptionEdit;
        updateImage = uploadImageFetch;
    }

    if (editData.image) {
        const postImageEdit = await uploads.uploadImagePostImageEdit(editData.image, editData.id, editData.postId);
        const postDataFetch = await posts.fetchPostData(editData.id, editData.postId);

        updatePost = postDataFetch;
        updateImage = postImageEdit;
    }

    let editPostReturnObj = {
        id: updatePost.id,
        image: updateImage.fileUrl,
        title: updatePost.title,
        description: updatePost.description,
        type: updatePost.type
    };

    if (!editPostReturnObj.id || !editPostReturnObj.image || !editPostReturnObj.description || !editPostReturnObj.type || !editPostReturnObj.title)
        throw new AppError("Post not update successfully please try again", 500);

    return editPostReturnObj;
};

export const deletePostServiceFunc = async (deleteData) => {
    if (!deleteData)
        throw new AppError("Delete data not found plaease try again", 404);

    const deletePostData = deleteData;

    const uploadDelete = await uploads.deleteUploadFileUrl(deletePostData.postId, deletePostData.id);

    const postsDelete = await posts.deleteUserPostFunc(deletePostData.id, deletePostData.postId);

    if (uploadDelete && postsDelete) {
        let deletPostResponse = {
            id: postsDelete.id,
            image: uploadDelete.fileUrl,
            title: postsDelete.title,
            description: postsDelete.description,
            type: postsDelete.type
        };

        return deletPostResponse;
    }

    return "Post is not found";
};