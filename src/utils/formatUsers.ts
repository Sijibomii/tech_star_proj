import { FavSubReddit } from "../entities/favSubreddit"
import { Post } from "../entities/posts"
import { Sreddit } from "../entities/subreddit"
import { User } from "../entities/users"

class FormatResponese{
  userId!: number
  email!: string
  time!: number
  fave?: Fave[]
}
//fave subreddit
class Fave{
  title: string | undefined
  posts : Post[]
}

export const formatUsers = async (allUsers: User[]): Promise<FormatResponese[]>=>{
  //fave can be null i.e user has no favourites
  const res: FormatResponese[]=[];
  
  allUsers.map(async (user)=>{
    const userId= user.id
    const email= user.email
    const time= user.news_letter
    //get list of fave
    const faves= await FavSubReddit.find({
      where:{
        user: userId,
      }
    });
    
    const fave= await getFaveDetails(faves)
    res.push({
      userId,
      email,
      time,
      fave
    })
  
  });

  return res;
}
//returns an array of fave

const getFaveDetails = async (faves:FavSubReddit[]): Promise<Fave[]>=>{
  const res: Fave[]=[]
  //get faves details
  faves.map(async (fave)=>{
    const sreddit= await Sreddit.findOne({
      where:{
        id: fave.SubredditId
      }
    })

    const title= sreddit?.title;
    //get posts under the subreddit
    const posts= await Post.find({
      where:{
        sub_reddit: sreddit!.id
      }
    })

    res.push({
    title,
    posts  
    })
  })

  return res;
}
// //get faves details
// faves.map(async (fave)=>{
//   const sreddit= await Sreddit.find({
//     where:{
//       id: fave.SubredditId
//     }
//   })
// })