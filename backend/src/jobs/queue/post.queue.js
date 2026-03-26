import { Queue } from "bullmq";

const connection =  { host: "127.0.0.1", port: 6379 };

export const postDeleteQueue = new Queue("postDeleteQueue", {
  connection
});