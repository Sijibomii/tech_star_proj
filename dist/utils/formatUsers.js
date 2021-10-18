"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatUsers = void 0;
const favSubreddit_1 = require("../entities/favSubreddit");
const posts_1 = require("../entities/posts");
const subreddit_1 = require("../entities/subreddit");
class FormatResponese {
}
class Fave {
}
const formatUsers = async (allUsers) => {
    const res = [];
    allUsers.map(async (user) => {
        const userId = user.id;
        const email = user.email;
        const time = user.news_letter;
        const faves = await favSubreddit_1.FavSubReddit.find({
            where: {
                user: userId,
            }
        });
        const fave = await getFaveDetails(faves);
        res.push({
            userId,
            email,
            time,
            fave
        });
    });
    return res;
};
exports.formatUsers = formatUsers;
const getFaveDetails = async (faves) => {
    const res = [];
    faves.map(async (fave) => {
        const sreddit = await subreddit_1.Sreddit.findOne({
            where: {
                id: fave.SubredditId
            }
        });
        const title = sreddit === null || sreddit === void 0 ? void 0 : sreddit.title;
        const posts = await posts_1.Post.find({
            where: {
                sub_reddit: sreddit.id
            }
        });
        res.push({
            title,
            posts
        });
    });
    return res;
};
//# sourceMappingURL=formatUsers.js.map