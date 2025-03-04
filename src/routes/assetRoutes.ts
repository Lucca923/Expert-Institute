import express from 'express';
import { assetController } from '../Controllers/assetController';

const router = express.Router();

router.get('/assets', assetController.getAssets);
router.get('/assets/:id', assetController.getAssetById);

export default router;

