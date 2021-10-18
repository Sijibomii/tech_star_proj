"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sreddit = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const favSubreddit_1 = require("./favSubreddit");
const posts_1 = require("./posts");
const users_1 = require("./users");
let Sreddit = class Sreddit extends typeorm_1.BaseEntity {
};
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Sreddit.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Sreddit.prototype, "title", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Sreddit.prototype, "description", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ type: "int", default: 0 }),
    __metadata("design:type", Number)
], Sreddit.prototype, "followers_count", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int, { nullable: true }),
    (0, typeorm_1.Column)({ type: "int", default: 0 }),
    __metadata("design:type", Object)
], Sreddit.prototype, "post_count", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Sreddit.prototype, "creatorId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => users_1.User, (user) => user.sreddits),
    __metadata("design:type", users_1.User)
], Sreddit.prototype, "creator", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => favSubreddit_1.FavSubReddit, (fv) => fv.favesubreddit),
    __metadata("design:type", Array)
], Sreddit.prototype, "favSubreddit", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => posts_1.Post, (p) => p.sub_reddit),
    __metadata("design:type", Array)
], Sreddit.prototype, "posts", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Sreddit.prototype, "createdAt", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Sreddit.prototype, "updatedAt", void 0);
Sreddit = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)()
], Sreddit);
exports.Sreddit = Sreddit;
//# sourceMappingURL=subreddit.js.map