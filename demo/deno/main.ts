import { Login_aid_github } from '../../mod.ts'
import { Login_aid_twitter } from '../../with-twitter.ts'

const github_client_id = Deno.env.get('github_client_id')
const github_client_secret = Deno.env.get('github_client_secret')
// const github_callback = Deno.env.get('github_callback')
if (!github_client_id || !github_client_secret)
  throw Error('no github client id or secret or callback')
const with_github = new Login_aid_github(github_client_id, github_client_secret)

const twitter_client_id = Deno.env.get('twitter_client_id')
const twitter_client_secret = Deno.env.get('twitter_client_secret')
const twitter_callback = Deno.env.get('twitter_callback')
if (!twitter_client_id || !twitter_client_secret || !twitter_callback)
  throw Error('no twitter client id or secret || callback')
const with_twitter = new Login_aid_twitter(twitter_client_id, twitter_client_secret, twitter_callback)

Deno.serve(async req => {
  const url = new URL(req.url)
  switch(url.pathname) {
    case '/':
      return html(`
        <ul>
          <li>
            <a href="${with_github.authorize_url}">
              login with github
            </a>
          </li>
          <li>
            <a href="${with_twitter.authorize_url}">
              login with twitter
            </a>
          </li>
        </ul>
      `)
    case '/login/github': { // case 里的 let 和 const 对所有 case 和 default 都有效，所以加大括号，制造块作用域
      // console.log('code from user browser is sending to github for access token and then userinfo')
      const code = url.searchParams.get('code')
      if (!code) throw Error('no github auth_code')
      const userinfo = await with_github.code2id(code)
      return html(`
        <img src="${userinfo.avatar_url}">
        <p>name: ${userinfo.login}, id: ${userinfo.id}</p>
      `)
    }
    case `/login/twitter`: {
      const code = url.searchParams.get('code')
      if (!code) throw Error('no twitter auth_code')
      const userinfo = await with_twitter.code2id(code)
      return html(`
        <p>name: ${userinfo.name}, id: ${userinfo.id}</p>
      `)
    }
    default:
      return new Response('Not Found', { status: 404 })
  }
})

function html(html: string) {
  return new Response(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>login-aid.ts</title>
      </head>
      <body>
        <a href="/">
          <h1>LOGIN AID</h1>
        </a>
        ${html}
      </body>
    </html>
  `, {
    headers: {
      'content-type': 'text/html',
    }
  })
}
