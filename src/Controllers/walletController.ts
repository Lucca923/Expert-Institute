import { Response } from "express";
import { AuthenticatedRequest } from "../utils/authMiddleware";
import { readUsers, writeUsers } from "../utils/fileFunctions";
import { getAssetValue } from "../utils/coinAPIHelper";

async function getTotalWalletValue(user: any){
    let totalValue = 0;
        for (const asset in user.wallet.assets) {
            const assetValue = await getAssetValue(asset);
            totalValue += Number(assetValue) * Number(user.wallet.assets[asset]);
        }
    return totalValue;
}

export function getWallet(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.id;
    let users = readUsers();
    
    const user = users.find((user) => user.id === userId);
    if (user) {
        res.status(200).json(user.wallet);
    } else {
        res.status(400).json({ message: "User doesn't exist!" });
    }
}

export async function addToWallet(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.id;
    let users = readUsers();
    
    const user = users.find((user) => user.id === userId);
    try {
        if (user) {
            const AssetName = req.body.asset.name;
            const AssetAmount = Number(req.body.asset.amount);
            const AssetValue = await getAssetValue(AssetName);
            const AssetPrice = AssetAmount * AssetValue;
            console.log("Price:", AssetValue);
            if (AssetAmount < 0){
                res.status(400).json({ message: "Amount can't be negative!" });
                return;
            }
            const newWalletData = {[AssetName]: AssetAmount};
            if (user.wallet.assets.hasOwnProperty(AssetName)) {
                user.wallet.assets[AssetName] += AssetAmount;
            } else {
                user.wallet.assets = { ...user.wallet.assets, ...newWalletData };
            }
            user.wallet.TotalDeposits += AssetPrice;
            writeUsers(users);
            res.status(200).json(user.wallet);
        } else {
            res.status(400).json({ message: "User doesn't exist!" });
        }
    } catch (error) {
    console.error("Error adding to wallet:", error);
    res.status(500).json({ message: "Server error", error });
    }
}

export async function removeFromWallet(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.id;
    let users = readUsers();

    const user = users.find((user) => user.id === userId);
    if (user) {
        const AssetName = req.body.asset.name;
        const AssetAmount = Number(req.body.asset.amount);
        const AssetValue = await getAssetValue(AssetName);
        const AssetPrice = AssetAmount * AssetValue;
        if (!user.wallet.assets.hasOwnProperty(AssetName)) {
            res.status(400).json({ message: "Asset doesn't exist!" });
            return;
        }
        if (AssetAmount < 0 || AssetAmount > user.wallet.assets[AssetName]){
            res.status(400).json({ message: "Amount to withdrawl of asset is invalid!" });
            return;
        }
        user.wallet.assets[AssetName] -= AssetAmount;
        user.wallet.TotalDeposits = Number(user.wallet.TotalDeposits) - AssetPrice;
        writeUsers(users);
        res.status(200).json(user.wallet);
    }
    else {
        res.status(400).json({ message: "User doesn't exist!" });
    }
}

export async function getWalletValue(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.id;
    let users = readUsers();
    
    const user = users.find((user) => user.id === userId);
    if (user) {
        const totalValue = await getTotalWalletValue(user);
        res.status(200).json({totalValue});
    } else {
        res.status(400).json({ message: "User doesn't exist!" });
    }
}

export async function getWalletChange(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.id;
    let users = readUsers();
    
    const user = users.find((user) => user.id === userId);
    if (user) {
        const totalValue = await getTotalWalletValue(user);
        const totalChange = totalValue - user.wallet.TotalDeposits;
        res.status(200).json({totalChange});
    } else {
        res.status(400).json({ message: "User doesn't exist!" });
    }
}

export const walletController = {
    getWallet,
    addToWallet,
    removeFromWallet,
    getWalletValue,
    getWalletChange
}