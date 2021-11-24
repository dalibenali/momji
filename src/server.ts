import http from "http";
import express, { Application } from "express";
import morgan from "morgan";
import teamsRoutes from "./routes/teams";

const router: Application = express();

// Logging
router.use(morgan("dev"));

// Parse the request data
router.use(express.urlencoded({ extended: false }));
router.use(express.json());

// RULES OF OUR API
router.use((req, res, next) => {
  // CORS policy
  res.header("Access-Control-Allow-Origin", "*");
  // CORS headers
  res.header(
    "Access-Control-Allow-Headers",
    "origin, X-Requested-With,Content-Type,Accept, Authorization"
  );
  // CORS method headers
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET PATCH DELETE POST");
    return res.status(200).json({});
  }
  next();
});

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

