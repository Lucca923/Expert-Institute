import express from 'express';
import cors from 'cors';
import assetRoutes from './routes/assetRoutes';
import authRoutes from './routes/authRoutes';
import walletRoutes from './routes/walletRoutes';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/', authRoutes);
app.use('/assets', assetRoutes);
app.use('/', walletRoutes);

export default app;