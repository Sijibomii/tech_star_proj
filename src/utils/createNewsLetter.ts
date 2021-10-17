import { Post } from "../entities/posts"


// [
    //   {
    //     userId,
    //     email,
    //     time,
    //     html
    //   }
    // ]
class newsLetterResponse{
  userId!: number
  email!: string
  time!: number
  html!: string
}
  
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

export const createNewsLetter= async (data: FormatResponese[]): Promise<newsLetterResponse[]>=>{

  const res: newsLetterResponse[]=[];
  data.map((d)=>{
    const pos= d.fave
    let html= `
    <html>
    <body>
    <div>
    `
    pos?.map((p)=>{
      const str=`<h3>${p.title}</h3>
      <ul>
      ${
        p.posts.map((post)=>{
          `
          <li>
          <a src="www.domain.com/posts/${post.id}">
          <h5>${post.title}</h5>
          </a>
          </li>
          `
        })
      }
      </ul>
      `
      html=html + str
    })
    const finalhtml=html+`
    </div>
    </body>
    </html>
    `
    const dat={
      userId:d.userId,
      email: d.email,
      time: d.time,
      html: finalhtml
    }
    res.push(dat);
  });

  return res;
}