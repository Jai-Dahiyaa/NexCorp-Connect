import cluster from "cluster";
import os from "os";
import app from "./src/server.js"; 

if (cluster.isPrimary) {
  const numCPUs = os.cpus().length;
  console.log(`Master ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    console.log("Starting a new worker...");
    cluster.fork();
  });
} else {
 
  app.listen(4000, () => {
    console.log(`Worker ${process.pid} started on port 4000`);
  });
}
