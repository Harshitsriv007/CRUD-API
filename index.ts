import express, { Request, Response, NextFunction } from 'express';
import connectDB from './config/database';
import { AdminRoute } from './routes';
import path from 'path';
import dotenv from 'dotenv';
import { handleNotFound, handleJsonSyntaxError, handleServerError } from './middleware/errorhandler';
import cluster, { Worker } from 'cluster';
import os from 'os';
import httpProxy from 'http-proxy';
// import * as http from 'http';

const proxy = httpProxy.createProxyServer();

const numCPUs = os.cpus().length;
let lastWorkerIndex = 0;

if (process.env.NODE_ENV === 'multi') {

    if (cluster.isPrimary) {
        console.log(`Master process ${process.pid} is running`);
      
        // Fork workers
        for (let i = 0; i < numCPUs-1; i++) {
          cluster.fork();
        }
      
        cluster.on('exit', (worker: Worker, code: number, signal: string) => {
          console.log(`Worker process ${worker.process.pid} died. Restarting...`);
          cluster.fork();
        });
      } else {
          if (cluster.worker !== undefined) { // Check if cluster.worker is defined

              // Determine the base port for the workers
              const BASE_PORT = 4001; // Start worker ports from 4000
          
              // Calculate the port for this worker
              const PORT = BASE_PORT + cluster.worker.id - 1;
      
              //   const PORT = process.env.PORT || 8000; // Default to 8000 if PORT is not set
              const mongodb =  process.env.MONGO_URI || 'mongodb://localhost:27017/project';
      
              if (!mongodb) {
                  console.error("MONGO_URI is not defined in the environment variables.");
                  process.exit(1);
              }
      
              const app = express();
      
              app.use(express.json());
              app.use(express.urlencoded({ extended: true }));
      
              // Call the connectDB function to establish the database connection
              connectDB(mongodb);
      
              app.use('/api', AdminRoute);
      
              // Error handling middleware
              app.use(handleNotFound);
              app.use(handleJsonSyntaxError);
              app.use(handleServerError);
      
              app.listen(PORT, () => {
                  console.log(`Worker ${process.pid} is listening on PORT ${PORT}`);
              });
          }
      }

    //Load Balancer 

    if (!cluster.isPrimary) {
        const loadBalancerApp = express();

        loadBalancerApp.use((req, res, next) => {
            // Calculate next worker index in a round-robin manner
            lastWorkerIndex = (lastWorkerIndex + 1) % numCPUs;
        
            // Calculate port for the next worker
            const workerPort = 4001 + lastWorkerIndex;
        
            const targetUrl = `http://localhost:${workerPort}${req.originalUrl}`; // Construct target URL
        
            console.log(`Load balancer forwarding request to Worker on port ${workerPort}`);
            console.log(`PORT ${targetUrl}`);
            
            // Proxy the request to the chosen worker
            proxy.web(req, res, { target: targetUrl }, (err) => {
                console.error(err);
                // If an error occurs during proxying, send an error response to the client
                res.status(500).send('Proxy Error');
            });
        });
            // Handle errors from the proxy server
            proxy.on('error', (err: Error) => {
                console.error('Proxy Error:', err);
            });

        loadBalancerApp.listen(4000, () => {
            console.log(`Load balancer is listening on PORT 4000`);
        });
    }
    
}else{

        // Determine the path to the appropriate .env file
        const envFile = process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev';

        // Load the environment variables from the .env file
        dotenv.config({ path: path.resolve(__dirname, '.', envFile) });

        const PORT = process.env.PORT || 4001; // Default to 4001 if PORT is not set
        const mongodb =  process.env.MONGO_URI || 'mongodb://localhost:27017/project';

        if (!mongodb) {
            console.error("MONGO_URI is not defined in the environment variables.");
            process.exit(1);
        }

        const app = express();

        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));

        // Call the connectDB function to establish the database connection
        connectDB(mongodb);

        app.use('/api', AdminRoute);

        // Error handling middleware
        app.use(handleNotFound);
        app.use(handleJsonSyntaxError);
        app.use(handleServerError);

        app.listen(PORT, () => {
            console.log(`Server Start on PORT http://localhost:${PORT}`);
        });
}