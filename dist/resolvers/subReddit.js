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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SRedditResolver = void 0;
const type_graphql_1 = require("type-graphql");
const users_1 = require("../entities/users");
const isAuth_1 = require("../middleware/isAuth");
const subreddit_1 = require("src/entities/subreddit");
const favSubreddit_1 = require("../entities/favSubreddit");
const formatUsers_1 = require("../utils/formatUsers");
const createNewsLetter_1 = require("../utils/createNewsLetter");
let SredditInput = class SredditInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], SredditInput.prototype, "title", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], SredditInput.prototype, "description", void 0);
SredditInput = __decorate([
    (0, type_graphql_1.InputType)()
], SredditInput);
let SResponse = class SResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => [String], { nullable: true }),
    __metadata("design:type", Array)
], SResponse.prototype, "errors", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => subreddit_1.Sreddit, { nullable: true }),
    __metadata("design:type", subreddit_1.Sreddit)
], SResponse.prototype, "sreddit", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => favSubreddit_1.FavSubReddit, { nullable: true }),
    __metadata("design:type", favSubreddit_1.FavSubReddit)
], SResponse.prototype, "favReddit", void 0);
SResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], SResponse);
let SRedditResolver = class SRedditResolver {
    async createSubReddit(subRedditInput, { req }) {
        const sred = await subreddit_1.Sreddit.findOne({ title: subRedditInput.title });
        if (sred) {
            return {
                errors: [
                    "Sub reddit title must be unique"
                ]
            };
        }
        const s = await subreddit_1.Sreddit.create({
            title: subRedditInput.title,
            description: subRedditInput.description,
            creatorId: req.session.userId
        }).save();
        return {
            sreddit: s
        };
    }
    async addAsFavSubRed(sredit, { req }) {
        const sred = await subreddit_1.Sreddit.findOne({ title: sredit });
        if (!sred) {
            return {
                errors: [
                    "Not found"
                ]
            };
        }
        const favs = await favSubreddit_1.FavSubReddit.findOne({
            SubredditId: sred.id,
            UserId: req.sessionID.userId
        });
        if (favs) {
            return {
                errors: [
                    "you've added this sub reddit to favourite before"
                ]
            };
        }
        const fav = await favSubreddit_1.FavSubReddit.create({
            SubredditId: sred.id,
            UserId: req.session.userId
        });
        return {
            favReddit: fav
        };
    }
    async deleteFav(id, { req }) {
        await favSubreddit_1.FavSubReddit.delete({ id, user: req.session.userId });
        return true;
    }
    async sendNewsletter({ req }) {
        const user = await users_1.User.findOne({
            where: {
                id: req.session.userId
            }
        });
        if (!user) {
            return false;
        }
        if (!user.is_admin) {
            return false;
        }
        const allUsers = await users_1.User.find({
            where: {
                gets_news_letter: true,
                is_admin: false
            }
        });
        const data = await (0, formatUsers_1.formatUsers)(allUsers);
        const news_letter = await (0, createNewsLetter_1.createNewsLetter)(data);
        try {
        }
        catch (error) {
            console.log(error);
            return false;
        }
        return true;
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => SResponse),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)("input")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SredditInput, Object]),
    __metadata("design:returntype", Promise)
], SRedditResolver.prototype, "createSubReddit", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => SResponse),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)("input")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SRedditResolver.prototype, "addAsFavSubRed", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)('id', () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], SRedditResolver.prototype, "deleteFav", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SRedditResolver.prototype, "sendNewsletter", null);
SRedditResolver = __decorate([
    (0, type_graphql_1.Resolver)(users_1.User)
], SRedditResolver);
exports.SRedditResolver = SRedditResolver;
//# sourceMappingURL=subReddit.js.map