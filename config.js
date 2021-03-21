import dotenv from "dotenv";

dotenv.config();

export const CONNECTION_URL = `mongodb+srv://${process.env.ADMIN}:${process.env.PASSWORD}@cluster0.8xruj.mongodb.net/social?retryWrites=true&w=majority`;

export const SECRET = process.env.SECRET;
