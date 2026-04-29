import dotenv from "dotenv";
import app from "./src/app.js";
import http from "http";
import connectDB from "./src/config/db.js";
import { initSocket } from "./src/sockets/server.socket.js";


dotenv.config();

const httpServer =http.createServer(app);

initSocket(httpServer)


const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectDB();

  

  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
