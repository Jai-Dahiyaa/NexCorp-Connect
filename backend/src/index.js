import app from "./server.js";
import http from "http";
import logger from "./config/logger.js";
import runLLM from "./utils/openai.js";
// import { initSocket, setIO } from './config/socket.config.js';

const server = http.createServer(app);

const PORT = process.env.PORT || 6000;
// const io = initSocket(server)
// setIO(io);

// io.on("connection", (socket) => {
//   socket.on("join", (userId) => { 
//     socket.join(userId.toString()); 
//     console.log(`User ${userId} joined room`); 
//   });
// });

server.listen(PORT, () => {
  logger.info(`Server Is run http://localhost:${PORT}`);
  logger.info(`Swagger docs at http://localhost:${PORT}/api-docs`);
});

runLLM();
export default app;