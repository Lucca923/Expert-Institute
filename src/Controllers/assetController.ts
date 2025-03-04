import { Request, Response } from 'express';
import { COINCAP_URL } from '../utils/constants';

export async function getAssets(req: Request, res: Response) {
    try {
        const response = await fetch(COINCAP_URL + '/assets', {
                method: 'GET'
            });
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching assets:", error);
        res.status(500).json({ message: "Failed to fetch assets" });
    }
}

export async function getAssetById(req: Request, res: Response) {
    const id  = req.params.id;
    try {
        const response = await fetch(COINCAP_URL + `/assets/${id}`, {
                method: 'GET'
            });
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching asset by ID:", error);
        res.status(500).json({ message: "Failed to fetch asset by ID" });
    }
}
export const assetController = {
    getAssets,
    getAssetById
}