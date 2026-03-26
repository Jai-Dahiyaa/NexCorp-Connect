// import { Server } from "socket.io";

// let io;

// export const initSocket = (server) => {
//   io = new Server(server, {
//     cors: {
//       origin: "*",
//       methods: ["GET", "POST"]
//     }
//   });

//   io.on("connection", (socket) => {
//     console.log("Socket User connected:", socket.id);

//     socket.on("join", (userId) => {
//       socket.join(userId.toString());
//     });
//   });

//   return io;
// };

// export const setIO = (instance) => {
//   io = instance;
// };

// export const getIO = () => {
//   if (!io) throw new Error("Socket.io not initialized!");
//   return io;
// };
