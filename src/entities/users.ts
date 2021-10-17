import { ObjectType, Field, Int } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  BaseEntity,
  OneToMany,
} from "typeorm";
import { FavSubReddit } from "./favSubreddit";
import { Post } from "./posts";
import { Sreddit } from "./subreddit";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number; 

  @Field()
  @Column({ unique: true })
  username!: string;

  //24hour system 8 rep 8am
  @Field(() => Int)
  @Column({ type: "int", default: 8})
  news_letter!: number; 

  //whether or not this user is sent a newsletter
  @Field()
  @Column({ default: true })
  gets_news_letter!: Boolean

  @Field()
  @Column({ unique: true })
  email!: string;

  @Field()
  @Column({ default: false})
  is_admin!: boolean

  @Column()
  password!: string;

  @OneToMany(() => Post, (post) => post.creator)
  posts: Post[];

  @OneToMany(()=> Sreddit,(sreddit)=> sreddit.creator )
  sreddits: Sreddit[];

  @OneToMany(()=> FavSubReddit,(fv)=> fv.user )
  favReddits: FavSubReddit[];

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
