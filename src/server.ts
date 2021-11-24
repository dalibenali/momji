import http from "http";
import express, { Application } from "express";
import morgan from "morgan";
import teamsRoutes from "./routes/teams";
import cors from "./middlewares/cors";

const router: express.Application = express();

// Logging
router.use(morgan("dev"));

// Parse the request data
router.use(express.urlencoded({ extended: false }));
router.use(express.json());
router.use(cors);

// Routes
router.use("/", teamsRoutes);

// Error handling
router.use((req, res, next) => {
  const error: Error = new Error("not found");
  return res.status(404).json({
    message: error.message,
  });
});

// Server
const httpServer: http.Server = http.createServer(router);
const PORT: number = parseInt(<string>process.env.PORT, 10) || 3000;
httpServer.listen(PORT, () =>
  console.log(`The server is running on port ${PORT}`)
);

export default router;

