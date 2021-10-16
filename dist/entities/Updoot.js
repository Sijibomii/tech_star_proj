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
exports.Updoot = void 0;
const typeorm_1 = require("typeorm");
const users_1 = require("./users");
const posts_1 = require("./posts");
let Updoot = class Updoot extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.Column)({ type: "int" }),
    __metadata("design:type", Number)
], Updoot.prototype, "value", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], Updoot.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => users_1.User, (user) => user.updoots),
    __metadata("design:type", users_1.User)
], Updoot.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], Updoot.prototype, "postId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => posts_1.Post, (post) => post.updoots, {
        onDelete: "CASCADE",
    }),
    __metadata("design:type", posts_1.Post)
], Updoot.prototype, "post", void 0);
Updoot = __decorate([
    (0, typeorm_1.Entity)()
], Updoot);
exports.Updoot = Updoot;
//# sourceMappingURL=Updoot.js.map