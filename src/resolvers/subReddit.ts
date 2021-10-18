import { MyContext } from "../types";
import {
  Resolver,
  Mutation,
  Arg,
  Field,
  Ctx,
  ObjectType,
  InputType,
  UseMiddleware,
  Int
} from "type-graphql";
import { User } from "../entities/users";
import { isAuth } from "../middleware/isAuth";
import { Sreddit } from "../entities/subreddit";
import { FavSubReddit } from "../entities/favSubreddit";
import { formatUsers } from "../utils/formatUsers";
import { createNewsLetter } from "../utils/createNewsLetter"
//create new subreddit here

@InputType()
class SredditInput{
  @Field()
  title: string

  @Field()
  description: string
}

@ObjectType()
class SResponse{
  @Field(()=> [String], {nullable: true})
  errors?: String[]

  @Field(()=> Sreddit, { nullable: true})
  sreddit?: Sreddit

  @Field(()=> FavSubReddit, { nullable: true})
  favReddit?: FavSubReddit
}

@Resolver(User)
export class SRedditResolver{
  @Mutation(()=> SResponse)
  @UseMiddleware(isAuth)
  async createSubReddit(
    @Arg("input") subRedditInput: SredditInput,
    @Ctx() { req }: MyContext
  ): Promise<SResponse>{
    //check if subreddit with that title exist
    const sred = await Sreddit.findOne({ title: subRedditInput.title })
    if (sred){
      return{
        errors:[
          "Sub reddit title must be unique"
        ]
      }
    }

   const s= await Sreddit.create({
      title: subRedditInput.title,
      description: subRedditInput.description,
      creatorId: req.session.userId
    }).save();
    
    return{
    sreddit: s
    }
  }

  @Mutation(()=> SResponse)
  @UseMiddleware(isAuth)
  async addAsFavSubRed(
    @Arg("input") sredit: "string",
    @Ctx(){ req }: MyContext
  ): Promise<SResponse>{
    const sred = await Sreddit.findOne({ title: sredit })
    if (!sred){
      return{
        errors:[
          "Not found"
        ]
      }
    }
    //check if this sreddit not yet a fav
    const favs= await FavSubReddit.findOne({
      SubredditId: sred.id,
      UserId: req.sessionID.userId
    })
    if(favs){
      return{
        errors:[
          "you've added this sub reddit to favourite before"
        ]
      }
    }
    //add as a favourite
    const fav= await FavSubReddit.create({
      SubredditId: sred.id,
      UserId: req.session.userId
    })
    return{
      favReddit: fav
    }
  }
//delete a favourite
@Mutation(()=> Boolean)
@UseMiddleware(isAuth)
  async deleteFav(
    @Arg('id', ()=> Int) id: number,
    @Ctx() { req }: MyContext
  ): Promise<boolean>{
      await FavSubReddit.delete({ id , user: req.session.userId})
      return true;
}

//schedule a newsletter for next day
//only admins
//returns boolean for now
@Mutation(()=> Boolean)
@UseMiddleware(isAuth)
  async sendNewsletter(@Ctx(){ req }: MyContext): Promise<boolean>{
    const user= await User.findOne({
      where:{
        id: req.session.userId
      }
    })
    if(!user){
      //reject
      return false
    }
    if(!user.is_admin){
      return false
    }
    //admin confirmed
    //get all users that want a newsletter
    const allUsers= await User.find({
      where:{
        gets_news_letter: true,
        is_admin: false
      }
    })
    // [
    //   {
    //     userId,
    //     email,
    //     time,
    //     fave[
    //       comedy[
    //         post under comedy
    //       ]
    //     ]
    //   }
    // ]
    //function that take all users and return the schema above
    const data = await formatUsers(allUsers);
    //create the newsletter for each of them with scheduled time
    // return an array like
    // [
    //   {
    //     userId,
    //     email,
    //     time,
    //     html
    //   }
    // ]
    const news_letter = await createNewsLetter(data)
    //schedule with sendgrid
    try{
      //sendgrid's api stuff
      //having issues getting a send grid account
    }catch(error){
      console.log(error)
      return false
    }
    return true
  }
  
}





