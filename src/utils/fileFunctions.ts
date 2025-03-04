import fs from "fs";
import path from "path";

const usersFilePath = path.join(__dirname, "../data/userData.json");

export function readUsers(): any[]{
    if (!fs.existsSync(usersFilePath)) {
      fs.writeFileSync(usersFilePath, "[]", "utf8");
    }
    const data = fs.readFileSync(usersFilePath, "utf8");
    if (data === "") {
        return [];
        }
    return JSON.parse(data);
};

export function writeUsers(users: any[]){
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), "utf8");
};