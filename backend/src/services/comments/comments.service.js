import * as comments from "../../models/comment.models.js";
import AppError from "../../utils/appError.js";

export const commentCreateService = async (userData) => {
    if (!userData)
        throw new AppError("Delete data not found plaease try again", 404);

    const data = userData;

    const insertComment = await comments.insertCommentDB(data.postId, data.userId, data.comment);

    if (!insertComment)
        throw new AppError("Comment not create successFully", 500);

    return insertComment;
};

export const deleteCommentService = async (deleteData) => {
    if (!deleteData) throw new AppError("delete data not found please try again", 404);

    const deleteDB = deleteData;

    const deletCommentInDB = await comments.deleteCommentDB(deleteDB.userId, deleteDB.commentId);

    if (!deletCommentInDB) throw new AppError("Comment Already delete", 500);

    return deletCommentInDB;
};

export const fetchCommentService = async (fetchData) => {
    if (!fetchData) throw new AppError("delete data not found please try again", 404);

    const fetchPostId = fetchData;

    const fetchComments = await comments.fetchCommentsDB(fetchPostId.postId);

    if (!fetchComments) throw new AppError("Comment not fetch successFully", 500);

    return fetchComments;
};