import http from "http";
import express from "express";
import morgan from "morgan";
import teamsRoutes from "./routes/teams";
import employeesRoutes from "./routes/employees";
import cors from "./middlewares/cors";
import notFound from "./middlewares/notFound";

const router: express.Application = express();

// Logging
router.use(morgan("dev"));

// Middlewares
router.use(express.urlencoded({ extended: false }));
router.use(express.json());
router.use(cors);
router.use("/", teamsRoutes);
router.use("/", employeesRoutes);
router.use(notFound);

// Server
const httpServer: http.Server = http.createServer(router);
const PORT: number = parseInt(<string>process.env.PORT, 10) || 3000;
httpServer.listen(PORT, () =>
  console.log(`The server is running on port ${PORT}`)
);

export default router;
