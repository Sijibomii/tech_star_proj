"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const ioredis_1 = __importDefault(require("ioredis"));
const express_session_1 = __importDefault(require("express-session"));
const connect_redis_1 = __importDefault(require("connect-redis"));
const constants_1 = require("./constants");
const hello_1 = require("./resolvers/hello");
const typeorm_1 = require("typeorm");
const cors_1 = __importDefault(require("cors"));
const posts_1 = require("./entities/posts");
const users_1 = require("./entities/users");
const subreddit_1 = require("./entities/subreddit");
const path_1 = __importDefault(require("path"));
require('dotenv').config();
const main = async () => {
    console.log(process.env.type);
    const conn = await (0, typeorm_1.createConnection)({
        type: 'postgres',
        database: process.env.database,
        username: process.env.username,
        password: process.env.password,
        logging: true,
        synchronize: true,
        migrations: [path_1.default.join(__dirname, "./migrations/*")],
        entities: [posts_1.Post, users_1.User, subreddit_1.Sreddit]
    });
    await conn.runMigrations();
    console.log('ran');
    const app = (0, express_1.default)();
    const redisStore = (0, connect_redis_1.default)(express_session_1.default);
    const redis = new ioredis_1.default(6379, "localhost");
    app.use((0, cors_1.default)({
        origin: "http://localhost:3000",
        credentials: true
    }));
    app.use((0, express_session_1.default)({
        name: constants_1.COOKIE_NAME,
        store: new redisStore({
            client: redis,
            disableTouch: true
        }),
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 10 * 365,
            httpOnly: true,
            sameSite: 'lax',
            secure: false,
        },
        saveUninitialized: false,
        secret: "drmslfkcnmkngkfngmlfmgfefeffffmnknfknfkn",
        resave: false
    }));
    const apolloserver = new apollo_server_express_1.ApolloServer({
        schema: await (0, type_graphql_1.buildSchema)({
            resolvers: [hello_1.HelloResolver],
            validate: false
        }),
        context: ({ req, res }) => ({ req, res, redis })
    });
    apolloserver.applyMiddleware({ app, cors: false });
    app.listen(4000, () => {
        console.log('server is running on localhost 4000');
    });
};
main().catch((err) => {
    console.log(err);
});
//# sourceMappingURL=index.js.map