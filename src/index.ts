import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import Redis from 'ioredis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { COOKIE_NAME, __prod__ } from "./constants";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/posts";
import { SRedditResolver } from "./resolvers/subReddit";
import { UserResolver } from "./resolvers/users";
import { MyContext } from "./types";
import { createConnection } from "typeorm";
import cors from "cors";
import { Post } from "./entities/posts";
import { User } from "./entities/users";
import { Sreddit } from "./entities/subreddit";
import { FavSubReddit} from "./entities/favSubreddit";
import path from "path";
import dotenv from "dotenv";

//i've not used reddit before, so I'm assuming the newsletter users get is solely based on list of posts from their
//favourite subreddit for the previous day.
const main = async () => {
  dotenv.config({
    path: '../.env'
  });
  console.log(process.env.username)
  const conn= await createConnection({
    type: 'postgres',
    database: process.env.database,//new db
    username: process.env.username,
    password: process.env.password,
    logging: true,
    synchronize: true,
    migrations: [path.join(__dirname, "./migrations/*")],
    entities: [Post, User, Sreddit, FavSubReddit]
  });
  await conn.runMigrations();
  console.log('up and running')

  const app = express();
  const redisStore= connectRedis(session);
  
  const redis= new Redis(6379,"localhost");
  app.use(cors({
    origin: "http://localhost:3000",//assuming our frontend will run on port 3000
    credentials: true
  }))
  app.use(
    session({
      name: COOKIE_NAME,
      store: new redisStore({
        client: redis,
        disableTouch: true
        }),
      cookie:{
        maxAge: 1000 * 60 * 60 *24 *10*365,//10years,
        httpOnly: true,
        sameSite: 'lax',
        secure: false,//cookie only works in https
      },
      saveUninitialized: false,
      secret: "drmslfkcnmkngkfngmlfmgfefeffffmnknfknfkn",
      resave: false
    })
  );
  const apolloserver= new ApolloServer({
    schema : await buildSchema({
      resolvers: [HelloResolver, PostResolver, SRedditResolver, UserResolver],
      validate: false
    }),
    context: ({ req, res}): MyContext=> ({ req, res, redis })
  });
  apolloserver.applyMiddleware({ app, cors:false });
  app.listen(4000, ()=>{
    console.log('server is running on localhost 4000')
  });
}
main().catch((err)=>{
  console.log(err)
});