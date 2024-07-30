import { Login_aid_github } from '../../mod.ts'
import { Login_aid_X } from '../../with-twitter.ts'

const github_client_id = Deno.env.get('github_client_id')
const github_client_secret = Deno.env.get('github_client_secret')
if (!github_client_id || !github_client_secret)
  throw Error('no github client id or secret')
const with_github = new Login_aid_github(github_client_id, github_client_secret)

const twitter_client_id = Deno.env.get('twitter_client_id')
const twitter_client_secret = Deno.env.get('twitter_client_secret')
if (!twitter_client_id || !twitter_client_secret)
  throw Error('no twitter client id or secret')
const with_twitter = new Login_aid_X(twitter_client_id, twitter_client_secret)

Deno.serve(async req => {
  const url = new URL(req.url)
  switch(url.pathname) {
    case '/':
      return html(`
        <ul>
          <li>
            <a href="https://github.com/login/oauth/authorize?client_id=${github_client_id}">
              login with github
            </a>
          </li>
          <li>
            <a href="https://twitter.com/i/oauth2/authorize?response_type=code&client_id=WlVxUDVWSkpjUVhlSkdCeGhXc1g6MTpjaQ&redirect_uri=http://localhost:8000/login/x&scope=tweet.read%20users.read&state=state&code_challenge=challenge&code_challenge_method=plain">
              login with X
            </a>
          </li>
        </ul>
      `)
    case '/login/github': { // case 里的 let 和 const 对所有 case 和 default 都有效，所以加大括号，制造块作用域
      console.log('code from user browser is sending to github for access token and then userinfo')
      const code = url.searchParams.get('code')
      if (!code) throw Error('no github code')
      const userinfo = await with_github.login(code)
      return html(`
        <img src="${userinfo.avatar_url}">
        <p>name: ${userinfo.login}, id: ${userinfo.id}</p>
      `)
    }
    case `/login/x`: {
      const code = url.searchParams.get('code')
      if (!code) throw Error('no twitter auth_code')
      const userinfo = await with_twitter.login(code)
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
