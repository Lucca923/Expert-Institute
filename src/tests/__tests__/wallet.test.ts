import request from "supertest";
import app from "../testbed";
import { readUsers, writeUsers } from "../../utils/fileFunctions";
import { userDataModel, walletDataModel } from "../../data/dataModel";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../utils/constants";

// Mock the readUsers and writeUsers functions
jest.mock("../../utils/fileFunctions");

describe("Wallet API", () => {
    let token: string;
    let existingUser: userDataModel;

    beforeEach(async () => {
        // Reset the mock before each test
        jest.resetAllMocks();

        // Create a user and generate a token
        existingUser = new userDataModel(
            "existingUserId",
            "existinguser",
            "$2b$10$TBfAwtR7fK4LOEBcYrsnEurCPGtoKZFhMkQo3gVZFI22CFtZzsblq", // hashed password for "password123"
            new walletDataModel(0, { ethereum: 300 })
        );

        token = jwt.sign({ id: existingUser.id }, JWT_SECRET as string, { expiresIn: "1h" });

        // Mock readUsers to return an array with the existing user
        (readUsers as jest.Mock).mockReturnValue([existingUser]);
    });

    describe("GET /wallet", () => {
        it("should get the user's wallet", async () => {
            const response = await request(app)
            .get("/wallet")
            .set("Authorization", token);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(existingUser.wallet);
        });

        it("should return an error if the user does not exist", async () => {
            (readUsers as jest.Mock).mockReturnValue([]);

            const response = await request(app)
                .get("/wallet")
                .set("Authorization", token);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe("User doesn't exist!");
        });
    });

    describe("POST /wallet/add", () => {
        it("should add to the user's wallet", async () => {
            const newAsset = { name: "bitcoin", amount: 2 };

            const response = await request(app)
                .post("/wallet/add")
                .set("Authorization", token)
                .send({ asset: newAsset });

            expect(response.status).toBe(200);
            expect(response.body.assets.bitcoin).toBe(2);
        });

        it("should return an error if the amount is negative", async () => {
            const newAsset = { name: "bitcoin", amount: -2 };

            const response = await request(app)
                .post("/wallet/add")
                .set("Authorization", token)
                .send({ asset: newAsset });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe("Amount can't be negative!");
        });
    });

    describe("PUT /wallet/remove", () => {
        it("should remove from the user's wallet", async () => {
            const assetToRemove = { name: "ethereum", amount: 100 };

            const response = await request(app)
                .put("/wallet/remove")
                .set("Authorization", token)
                .send({ asset: assetToRemove });

            expect(response.status).toBe(200);
            expect(response.body.assets.ethereum).toBe(200);
        });

        it("should return an error if the asset does not exist", async () => {
            const assetToRemove = { name: "bitcoin", amount: 2 };

            const response = await request(app)
                .put("/wallet/remove")
                .set("Authorization", token)
                .send({ asset: assetToRemove });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe("Asset doesn't exist!");
        });

        it("should return an error if the amount to withdraw is invalid", async () => {
            const assetToRemove = { name: "ethereum", amount: 400 };

            const response = await request(app)
                .put("/wallet/remove")
                .set("Authorization", token)
                .send({ asset: assetToRemove });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe("Amount to withdrawl of asset is invalid!");
        });
    });

    describe("GET /wallet/value", () => {
        it("should get the total wallet value", async () => {
            const response = await request(app)
                .get("/wallet/value")
                .set("Authorization", token);

            expect(response.status).toBe(200);
            expect(response.body.totalValue).toBeDefined();
        });

        it("should return an error if the user does not exist", async () => {
            (readUsers as jest.Mock).mockReturnValue([]);

            const response = await request(app)
                .get("/wallet/value")
                .set("Authorization", token);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe("User doesn't exist!");
        });
    });

    describe("GET /wallet/change", () => {
        it("should get the total wallet change", async () => {
            const response = await request(app)
                .get("/wallet/change")
                .set("Authorization", token);

            expect(response.status).toBe(200);
            expect(response.body.totalChange).toBeDefined();
        });

        it("should return an error if the user does not exist", async () => {
            (readUsers as jest.Mock).mockReturnValue([]);

            const response = await request(app)
                .get("/wallet/change")
                .set("Authorization", token);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe("User doesn't exist!");
        });
    });
});