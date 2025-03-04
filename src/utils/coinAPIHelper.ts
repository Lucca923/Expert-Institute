import { COINCAP_URL } from "./constants";

export async function getAssetValue(asset: string){
    const response = await fetch(COINCAP_URL + `/assets/${asset}`, {
                method: 'GET'
            });
    const data = await response.json();
    return data.data.priceUsd;
}