import request from "supertest";
import app from "../testbed";
import { readUsers, writeUsers } from "../../utils/fileFunctions";
import { userDataModel, walletDataModel } from "../../data/dataModel";
import bcrypt from "bcryptjs";

// Mock the readUsers and writeUsers functions
jest.mock("../../utils/fileFunctions");

describe("Auth API", () => {
    beforeEach(() => {
        // Reset the mock before each test
        jest.resetAllMocks();
    });

    describe("POST /signup", () => {
        it("should create a new user successfully", async () => {
            const newUser = {
                username: "newuser",
                password: "password123"
            };

        // Mock readUsers to return an empty array
        (readUsers as jest.Mock).mockReturnValue([]);

        const response = await request(app)
            .post("/signup")
            .send(newUser);

        expect(response.status).toBe(201);
        expect(response.body.message).toBe("User created successfully");
        expect(response.body.token).toBeDefined();
        });

        it("should return an error if the user already exists", async () => {
            const existingUser = new userDataModel(
                "existingUserId",
                "existinguser",
                "hashedpassword",
                new walletDataModel(0, {})
            );

            // Mock readUsers to return an array with the existing user
            (readUsers as jest.Mock).mockReturnValue([existingUser]);

            const response = await request(app)
                .post("/signup")
                .send({
                    username: "existinguser",
                    password: "password123"
            });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe("User already exists");
        });
    });

    describe("POST /login", () => {
        it("should login successfully with valid credentials", async () => {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash("password123", salt);
            const existingUser = new userDataModel(
                "existingUserId",
                "existinguser",
                hashedPassword,
                new walletDataModel(0, {})
            );

            // Mock readUsers to return an array with the existing user
            (readUsers as jest.Mock).mockReturnValue([existingUser]);

            const response = await request(app)
            .get("/login")
            .send({
            username: "existinguser",
            password: "password123"
            });
            expect(response.status).toBe(200);
            expect(response.body.message).toBe("Login successful");
            expect(response.body.token).toBeDefined();
        });

        it("should return an error with invalid credentials", async () => {
            const hashedPassword = await bcrypt.hash("password123", 10);
            const existingUser = new userDataModel(
                "existingUserId",
                "existinguser",
                hashedPassword, // hashed password for "password123"
                new walletDataModel(0, {})
            );

            // Mock readUsers to return an array with the existing user
            (readUsers as jest.Mock).mockReturnValue([existingUser]);

            const response = await request(app)
                .get("/login")
                .send({
                username: "existinguser",
                password: "wrongpassword"
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe("Invalid username or password");
        });

        it("should return an error if the user does not exist", async () => {
            // Mock readUsers to return an empty array
            (readUsers as jest.Mock).mockReturnValue([]);

            const response = await request(app)
                .get("/login")
                .send({
                username: "nonexistentuser",
                password: "password123"
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe("User does not exist");
        });
    });
});

