import express from 'express';
import { authenticateToken } from '../utils/authMiddleware';
import { walletController } from '../Controllers/walletController';

const router = express.Router();

router.get('/wallet', authenticateToken, walletController.getWallet);
router.post('/wallet/add', authenticateToken, walletController.addToWallet);
router.put('/wallet/remove', authenticateToken, walletController.removeFromWallet);
router.get('/wallet/value', authenticateToken, walletController.getWalletValue);
router.get('/wallet/change', authenticateToken, walletController.getWalletChange);

export default router;