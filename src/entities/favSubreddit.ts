import { ObjectType, Field } from "type-graphql";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  ManyToOne,
} from "typeorm";
import { Sreddit } from "./subreddit";
import { User } from "./users";
//name, followers, no of posts, creator, description

@ObjectType()
@Entity()
//user can have multiple faves but a fave must be linked to just one user
export class FavSubReddit extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  UserId: number;

  @Field()
  @ManyToOne(() => User, (user) => user.favReddits)
  user: User;

  @Field()
  @Column()
  SubredditId: number;

  @Field()
  @ManyToOne(() => Sreddit, (sr) => sr.favSubreddit )
  favesubreddit: Sreddit;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
