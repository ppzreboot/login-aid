import { Login_aid_github } from '../../mod.ts'

const github_client_id = Deno.env.get('github_client_id')
const github_client_secret = Deno.env.get('github_client_secret')
if (!github_client_id || !github_client_secret)
  throw Error('no github client id or secret')
const with_github = new Login_aid_github(github_client_id, github_client_secret)

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
        </ul>
      `)
    case '/login/github':
      console.log('code from user browser is sending to github for access token and then userinfo')
      const code = url.searchParams.get('code')
      if (!code) throw Error('no github code')
      const userinfo = await with_github.login(code, 'http://localhost:8000/me')
      console.log({ userinfo })
      return html(`<p>name: ${userinfo.login}</p>`)
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
        <h1>LOGIN AID</h1>
        ${html}
      </body>
    </html>
  `, {
    headers: {
      'content-type': 'text/html',
    }
  })
}
