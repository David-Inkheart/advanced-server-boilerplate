import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "../../entity/User"
import * as dotenv from "dotenv"

dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DATABASE_HOST,
    port: 5432,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: "graphql-ts-server-boilerplate",
    synchronize: true,
    logging: true,
    entities: [User],
    migrations: [],
    subscribers: [],
});

export const TestDataSource = new DataSource({
    type: "postgres",
    host: process.env.DATABASE_HOST,
    port: 5432,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: "graphql-ts-server-boilerplate-test",
    synchronize: true,
    logging: false,
    dropSchema: true,
    entities: [User],
    migrations: [],
    subscribers: [],
});