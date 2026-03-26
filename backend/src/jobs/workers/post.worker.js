import { Worker } from "bullmq";
import * as notification from "../../models/notification.models.js";

const connection =  { host: process.env.QUEUE_CONNECTION, port: process.env.QUEUE_PORT };

const worker = new Worker(
    "postDeleteQueue",
    async (job) => {
        const { userId, postId, actionType, message } = job.data;
        await notification.deletePostNotification(userId, postId, actionType, message);

    },
    { connection }
);

worker.on("completed", (job) => {
    console.log(`Job ${job.id} completed and Job Data ${job.data.userId}`);
});