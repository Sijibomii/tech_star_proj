"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNewsLetter = void 0;
class newsLetterResponse {
}
class FormatResponese {
}
class Fave {
}
const createNewsLetter = async (data) => {
    const res = [];
    data.map((d) => {
        const pos = d.fave;
        let html = `
    <html>
    <body>
    <div>
    `;
        pos === null || pos === void 0 ? void 0 : pos.map((p) => {
            const str = `<h3>${p.title}</h3>
      <ul>
      ${p.posts.map((post) => {
                `
          <li>
          <a src="www.domain.com/posts/${post.id}">
          <h5>${post.title}</h5>
          </a>
          </li>
          `;
            })}
      </ul>
      `;
            html = html + str;
        });
        const finalhtml = html + `
    </div>
    </body>
    </html>
    `;
        const dat = {
            userId: d.userId,
            email: d.email,
            time: d.time,
            html: finalhtml
        };
        res.push(dat);
    });
    return res;
};
exports.createNewsLetter = createNewsLetter;
//# sourceMappingURL=createNewsLetter.js.map