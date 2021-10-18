import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { getConnection } from "typeorm";
import { isAuth } from "../middleware/isAuth";
import { Post } from "../entities/posts";
import { User } from "../entities/users";
import { MyContext } from "../types";
import { FavSubReddit } from "../entities/favSubreddit";
@InputType()
class PostInput {
  @Field()
  title: string;
  @Field()
  text: string;
}

@ObjectType()
class PostResponse{
  @Field(()=> [String], {nullable: true})
  errors?: String[]

  @Field(()=> Post, { nullable: true})
  post?: Post[]
}

@Resolver(Post)
export class PostResolver{
  @FieldResolver(() => String)
  textSnippet(@Root() post: Post) {
    return post.text.slice(0, 50);
  }
  
  @FieldResolver(() => User)
  creator(@Root() post: Post
  ) 
  {
    return User.findOne(post.creatorId);
  }

  //query for getting all post
  @Query(() => PostResponse)
  async posts (@Ctx() { req }: MyContext): Promise<PostResponse> {
    const posts = await Post.find()
    return{
      post: posts
    }
  }

  //quering for post by fav subreddit
  @Query(() => PostResponse)
  async postsByFav(@Ctx() { req }: MyContext): Promise<PostResponse> {
    const faves = await FavSubReddit.find({
      where:{
        UserId: req.session.userId
      }
    })
    const posts: Post[]=[]
    faves.map( async (fave)=>{
      const p= await Post.find({
        where:{
          sub_reddit: fave.SubredditId
        }
      })
      p.map((post)=>{
        posts.push(post);
      })
    });

    return{
      post: posts
    }
  }


  @Query(()=> Post, { nullable: true})
    post(
      @Arg('id', ()=> Int) id: number): Promise<Post | undefined>{
      return Post.findOne(id, { relations :["creator"]})
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg("input") input: PostInput,
    @Ctx() { req }: MyContext
  ): Promise<Post> {
    console.log('lll')
    return Post.create({
      ...input,
      creatorId: req.session.userId,
    }).save();
  }
  
  @Mutation(() => Post, { nullable: true })
  @UseMiddleware(isAuth)
  async updatePost(
    @Arg("id", () => Int) id: number,
    @Arg("title") title: string,
    @Arg("text") text: string,
    @Ctx() { req }: MyContext
  ): Promise<Post | null> {
    const result = await getConnection()
      .createQueryBuilder()
      .update(Post)
      .set({ title, text })
      .where('id = :id and "creatorId" = :creatorId', {
        id,
        creatorId: req.session.userId,
      })
      .returning("*")
      .execute();

    return result.raw[0];
  }
  @Mutation(()=> Boolean)
  @UseMiddleware(isAuth)
    async deletePost(
      @Arg('id', ()=> Int) id: number,
      @Ctx() { req }: MyContext
    ): Promise<boolean>{
        await Post.delete({ id , creatorId: req.session.userId})
        return true;
  }
}