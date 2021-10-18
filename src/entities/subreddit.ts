import { ObjectType, Field, Int } from "type-graphql";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { FavSubReddit } from "./favSubreddit";
import { Post } from "./posts";
import { User } from "./users";
//name, followers, no of posts, creator, description

@ObjectType()
@Entity()
export class Sreddit extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  title!: string;

  @Field()
  @Column()
  description!: string;

  @Field()
  @Column({ type: "int", default: 0 })
  followers_count!: number;

  
  @Field(() => Int, { nullable: true})
  @Column({ type: "int", default:0})
  post_count!: number | null; 

  @Field()
  @Column()
  creatorId: number;

  // @Field()
  @ManyToOne(() => User, (user) => user.sreddits)
  creator: User;

  
  @OneToMany(() => FavSubReddit, (fv) => fv.favesubreddit)
  favSubreddit: FavSubReddit[];

  // @Field()
  @OneToMany(() => Post, (p) => p.sub_reddit)
  posts: Post[];

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
