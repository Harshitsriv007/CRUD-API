"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = __importDefault(require("./config/database"));
const routes_1 = require("./routes");
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const errorhandler_1 = require("./middleware/errorhandler");
const cluster_1 = __importDefault(require("cluster"));
const os_1 = __importDefault(require("os"));
const http_proxy_1 = __importDefault(require("http-proxy"));
const proxy = http_proxy_1.default.createProxyServer();
const numCPUs = os_1.default.cpus().length;
let lastWorkerIndex = 0;
if (process.env.NODE_ENV === 'multi') {
    if (cluster_1.default.isPrimary) {
        console.log(`Master process ${process.pid} is running`);
        // Fork workers
        for (let i = 0; i < numCPUs - 1; i++) {
            cluster_1.default.fork();
        }
        cluster_1.default.on('exit', (worker, code, signal) => {
            console.log(`Worker process ${worker.process.pid} died. Restarting...`);
            cluster_1.default.fork();
        });
    }
    else {
        if (cluster_1.default.worker !== undefined) { // Check if cluster.worker is defined
            // Determine the path to the appropriate .env file
            //   const envFile = process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev';
            //   // Load the environment variables from the .env file
            //   dotenv.config({ path: path.resolve(__dirname, '.', envFile) });
            // Determine the base port for the workers
            const BASE_PORT = 4001; // Start worker ports from 4000
            // Calculate the port for this worker
            const PORT = BASE_PORT + cluster_1.default.worker.id - 1;
            //   const PORT = process.env.PORT || 8000; // Default to 8000 if PORT is not set
            const mongodb = process.env.MONGO_URI || 'mongodb://localhost:27017/project';
            if (!mongodb) {
                console.error("MONGO_URI is not defined in the environment variables.");
                process.exit(1);
            }
            const app = (0, express_1.default)();
            app.use(express_1.default.json());
            app.use(express_1.default.urlencoded({ extended: true }));
            // Call the connectDB function to establish the database connection
            (0, database_1.default)(mongodb);
            app.use('/api', routes_1.AdminRoute);
            // Error handling middleware
            app.use(errorhandler_1.handleNotFound);
            app.use(errorhandler_1.handleJsonSyntaxError);
            app.use(errorhandler_1.handleServerError);
            app.listen(PORT, () => {
                console.log(`Worker ${process.pid} is listening on PORT ${PORT}`);
            });
        }
    }
    //Load Balancer 
    if (!cluster_1.default.isPrimary) {
        const loadBalancerApp = (0, express_1.default)();
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
        proxy.on('error', (err) => {
            console.error('Proxy Error:', err);
        });
        // // Handle errors from the proxy server
        // proxy.on('error', (err: Error, req: http.IncomingMessage, res: http.ServerResponse) => {
        //     console.error('Proxy Error:', err);
        //     // Send an error response to the client
        //     res.status(500).send('Proxy Error');
        // });
        loadBalancerApp.listen(4000, () => {
            console.log(`Load balancer is listening on PORT 4000`);
        });
    }
}
else {
    // if (cluster.isPrimary) {
    //   console.log(`Master process ${process.pid} is running`);
    //   // Fork workers
    //   for (let i = 0; i < numCPUs-1; i++) {
    //     cluster.fork();
    //   }
    //   cluster.on('exit', (worker: Worker, code: number, signal: string) => {
    //     console.log(`Worker process ${worker.process.pid} died. Restarting...`);
    //     cluster.fork();
    //   });
    // } else {
    //     if (cluster.worker !== undefined) { // Check if cluster.worker is defined
    // Determine the path to the appropriate .env file
    const envFile = process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev';
    // Load the environment variables from the .env file
    dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '.', envFile) });
    // // Determine the base port for the workers
    // const BASE_PORT = process.env.PORT ? parseInt(process.env.PORT) : 4001; // Start worker ports from 4000
    // // Calculate the port for this worker
    // const PORT = BASE_PORT + cluster.worker.id - 1;
    const PORT = process.env.PORT || 4001; // Default to 8000 if PORT is not set
    const mongodb = process.env.MONGO_URI || 'mongodb://localhost:27017/project';
    if (!mongodb) {
        console.error("MONGO_URI is not defined in the environment variables.");
        process.exit(1);
    }
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    // Call the connectDB function to establish the database connection
    (0, database_1.default)(mongodb);
    app.use('/api', routes_1.AdminRoute);
    // Error handling middleware
    app.use(errorhandler_1.handleNotFound);
    app.use(errorhandler_1.handleJsonSyntaxError);
    app.use(errorhandler_1.handleServerError);
    app.listen(PORT, () => {
        console.log(`Server Start on PORT http://localhost:${PORT}`);
    });
    //     }
    // }
}
