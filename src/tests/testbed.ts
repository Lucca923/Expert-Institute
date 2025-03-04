import express from "express";
import walletRoutes from "../routes/walletRoutes";
import authRoutes from "../routes/authRoutes";
import assetRoutes from "../routes/assetRoutes";

const app = express();
app.use(express.json());

app.use('/', authRoutes);
app.use('/', assetRoutes);
app.use('/', walletRoutes);

export default app;