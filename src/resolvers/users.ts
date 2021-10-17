import { User as Userr } from "../entities/users";
import { MyContext } from "../types";
import {
  Resolver,
  Mutation,
  Arg,
  Field,
  Ctx,
  ObjectType,
  Query,
  FieldResolver,
  InputType,
  Root,
  UseMiddleware
} from "type-graphql";
import argon2 from "argon2";
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from "../constants";
import { validateRegister } from "../utils/validateRegister";
// import { sendEmail } from "../utils/sendEmail";
// import { v4 } from "uuid";
import { getConnection } from  "typeorm";
import { User } from "../entities/users";
import { isAuth } from "../middleware/isAuth";

@InputType()
class UsernamePasswordInput{
  @Field()
  username: string

  @Field()
  password: string

  @Field()
  email: string
}

@InputType()
class UserUpdateInput{
  @Field()
  username?: string

  @Field()
  news_letter?: number

  @Field()
  gets_news_letter?: Boolean
  
  @Field()
  email?: string
}
@ObjectType()
class FieldError{
  @Field()
  field: string;

  @Field()
  message:string;
}
@ObjectType()
class UserResponse{
  @Field(()=> [FieldError], {nullable: true})
  errors?: FieldError[]

  @Field(()=> Userr, { nullable: true})
  user?: Userr
}

@Resolver(User)
export class UserResolver{

  @FieldResolver(() => String)
  email(@Root() user: User, @Ctx() { req }: MyContext) {
    // this is the current user and its ok to show them their own email
    if (req.session.userId === user.id) {
      return user.email;
    }
    // current user wants to see someone elses email
    return "";
  }

  //to get the current logged in user
  @Query(()=> Userr, { nullable :true})
   me(@Ctx(){ req }: MyContext){
    if(!req.session.userId){
      //not logged in
      console.log(req.session)
      return null
    }
    console.log(req.session)
    return Userr.findOne(req.session.userId);
    
  }
  //other forms of update apart from password
  @Mutation(()=> UserResponse)
  @UseMiddleware(isAuth)
  async updateUser(
    @Arg("UserUpdate") UserUpdate: UserUpdateInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse>{

    const user = await Userr.findOne({  where: {
      id: req.session.userId
    }})
    if(!user){
      return{
        errors:[
          {
            //redefine this type
            field: "user",
            message: "user not found",
          }
        ]
      }
    }
   
    //insert  
     await Userr.update(
      { id: req.session.userId },
      {
        email: UserUpdate.email || user.email,
        username: UserUpdate.username || user.username,
        gets_news_letter: UserUpdate.gets_news_letter || user.gets_news_letter,
        news_letter: UserUpdate.news_letter || user.news_letter
      }
    );
    //lookup why update doesn't return user
    const newUser = await Userr.findOne({  where: {
      id: req.session.userId
    }})
    return{
      user: newUser
    }
  }
  //updating users password
  @Mutation(() => UserResponse)
  @UseMiddleware(isAuth)
  async changePassword(
    @Arg("token") token: string,
    @Arg("newPassword") newPassword: string,
    @Ctx() { redis, req }: MyContext
  ): Promise<UserResponse> {
    if (newPassword.length <= 2) {
      return {
        errors: [
          {
            field: "newPassword",
            message: "length must be greater than 2",
          },
        ],
      };
    }
    
    //password security
    const key = FORGET_PASSWORD_PREFIX + token;
    const userId = await redis.get(key);
    if (!userId) {
      return {
        errors: [
          {
            field: "token",
            message: "token expired",
          },
        ],
      };
    }

    const userIdNum = parseInt(userId);
    const user = await Userr.findOne(userIdNum);

    if (!user) {
      return {
        errors: [
          {
            field: "token",
            message: "user no longer exists",
          },
        ],
      };
    }
    await Userr.update(
      { id: userIdNum },
      {
        password: await argon2.hash(newPassword),
      }
    );

    await redis.del(key);

    // log in user after change password,
    req.session.userId = user.id;

    return { user };
  }

 //sign up mutation
  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const errors = validateRegister(options);
    if (errors) {
      return { errors };
    }

    const hashedPassword = await argon2.hash(options.password);
    let user;
    try {
      // User.create({}).save()
      const result = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(Userr)
        .values({
          username: options.username,
          email: options.email,
          password: hashedPassword,
        })
        .returning("*")
        .execute();
      user = result.raw[0];
    } catch (err) {
      //|| err.detail.includes("already exists")) {
      // duplicate username error
      if (err.code === "23505") {
        return {
          errors: [
            {
              field: "username",
              message: "username already taken",
            },
          ],
        };
      }
    }

    // store user id session
    // this will set a cookie on the user
    // keep them logged in
    req.session.userId = user.id;

    return { user };
  } 

  //login mutation
  @Mutation(() => UserResponse)
  async login(
    @Arg("usernameOrEmail") usernameOrEmail: string,
    @Arg("password") password: string,
    @Ctx() { req,res }: MyContext
  ): Promise<UserResponse> {
    const user = await Userr.findOne(
      usernameOrEmail.includes("@")
        ? { where: { email: usernameOrEmail } }
        : { where: { username: usernameOrEmail } }
    );
    if (!user) {
      return {
        errors: [
          {
            field: "usernameOrEmail",
            message: "that username doesn't exist",
          },
        ],
      };
    }
    const valid = await argon2.verify(user.password, password);
    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "incorrect password",
          },
        ],
      };
    }
    
    req.session.userId = user.id;
    return {
      user,
    };
  }
  //logout mutation
  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          console.log(err);
          resolve(false);
          return;
        }

        resolve(true);
      })
    );
  }
}


