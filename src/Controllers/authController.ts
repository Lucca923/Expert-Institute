import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { readUsers, writeUsers } from "../utils/fileFunctions";
import { JWT_SECRET } from "../utils/constants";
import { userDataModel, walletDataModel } from "../data/dataModel";

export async function signup(req: Request, res: Response) {
    try {
        const { username, password } = req.body;

        let users = readUsers();

        if (users.some((user) => user.username === username)) {
            res.status(400).json({ message: "User already exists" });
        } else {

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const newWallet = new walletDataModel(0, {});

            // Create new user object
            const newUser = new userDataModel( 
                Math.random().toString(36).substr(2, 9),
                username, 
                hashedPassword, 
                newWallet
            );

            // Save user to local storage (users.json)
            users.push(newUser);
            writeUsers(users);

            // Generate JWT token
            const token = jwt.sign({ id: newUser.id }, JWT_SECRET as string, { expiresIn: "1h" });

            res.status(201).json({ message: "User created successfully", token });
        }

    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ message: "Server error", error });
    }
  };

  export const login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        const users = readUsers();
  
        const user = users.find((user) => user.username === username);
        if (!user) {
            res.status(400).json({ message: "User does not exist" });
            return;
        }
  
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: "Invalid username or password" });
            return;
        }
  
        const token = jwt.sign({ id: user.id }, JWT_SECRET as string, { expiresIn: "1h" });
        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
  };

  
  export const authController = {
    signup,
    login
  }