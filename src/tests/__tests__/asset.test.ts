import request from "supertest";
import app from "../testbed";
import { COINCAP_URL } from "../../utils/constants";

// Mock the fetch function
global.fetch = jest.fn();

    describe("Asset API", () => {
    beforeEach(() => {
        // Reset the mock before each test
        jest.resetAllMocks();
    });

    describe("GET /assets", () => {
        it("should get all assets", async () => {
            const mockAssets = {
                data: [
                { id: "bitcoin", name: "Bitcoin", priceUsd: "50000" },
                { id: "ethereum", name: "Ethereum", priceUsd: "4000" }
                ]
            };

            // Mock fetch to return the mock assets
            (fetch as jest.Mock).mockResolvedValue({
                json: jest.fn().mockResolvedValue(mockAssets)
            });
            const response = await request(app).get("/assets");

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockAssets);
        });

        it("should handle errors when fetching assets", async () => {
            // Mock fetch to throw an error
            (fetch as jest.Mock).mockRejectedValue(new Error("Failed to fetch assets"));

            const response = await request(app).get("/assets");

            expect(response.status).toBe(500);
            expect(response.body.message).toBe("Failed to fetch assets");
        });
    });

  describe("GET /assets/:id", () => {
        it("should get an asset by ID", async () => {
            const mockAsset = {
                data: { id: "bitcoin", name: "Bitcoin", priceUsd: "50000" }
            };

            // Mock fetch to return the mock asset
            (fetch as jest.Mock).mockResolvedValue({
                json: jest.fn().mockResolvedValue(mockAsset)
            });

            const response = await request(app).get("/assets/bitcoin");

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockAsset);
        });

        it("should handle errors when fetching an asset by ID", async () => {
            // Mock fetch to throw an error
            (fetch as jest.Mock).mockRejectedValue(new Error("Failed to fetch asset"));

            const response = await request(app).get("/assets/bitcoin");

            expect(response.status).toBe(500);
            expect(response.body.message).toBe("Failed to fetch asset by ID");
        });
    });
});