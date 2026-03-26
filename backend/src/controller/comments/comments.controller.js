import { commentCreateService, deleteCommentService, fetchCommentService } from "../../services/comments/comments.service.js";
import jwt from "jsonwebtoken";
import AppError from "../../utils/appError.js";

export const commentCreateController = async (req, res) => {
    const postId = req.params.id;
    const { accessToken } = req.cookies;
    const { comment } = req.body;

    if (!comment)
        throw new AppError("Please insert your comment", 404);

    if (!accessToken) throw new AppError("Access Token is messing please first login", 404);

    const decodeToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN);

    const data = {
        postId: postId,
        userId: decodeToken.id,
        comment: comment
    };

    if (!data.postId || !data.userId || !data.comment)
        throw new AppError("comment data is missing please try again", 404);

    const commentResult = await commentCreateService(data);

    if (!commentResult)
        throw new AppError("Comment not create please try again", 500);

    res.status(200).json({status: true, message: "Comment Create Successfully", commentResult });
};

export const deleteCommentController = async (req, res) => {
    const commentId = req.params.id;
    const { accessToken } = req.cookies;

    if (!accessToken) throw new AppError("Access Token is messing please first login", 404);

    const decodeToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN);

    const data = {
        userId: decodeToken.id,
        commentId: commentId
    };

    if (!data.userId || !data.commentId)
        return next(new AppError("Access Token Missing", 401));

    const deleteResult = await deleteCommentService(data);

    if (!deleteResult)
        throw new AppError("Comment not delete please try again", 500);

    res.status(200).json({status: true, message: "Comment Create Successfully", deleteResult });
};

export const fetchCommentController = async (req, res) => {
    const postId = req.params.id;

    if (!postId) throw new AppError("Post id not catch for fetch comments", 404);

    const data = {
        postId: postId,
    };

    if (!data.postId)
        throw new AppError("Fetch comment data is missing please try again", 404);

    const fetchResult = await fetchCommentService(data);

    if (!fetchResult)
        throw new AppError("Comment not fetch please try again", 500);

    res.status(200).json({status: true, message: "Comment Create Successfully", fetchResult });
};