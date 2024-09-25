// import { Login_aid_shopify } from '@ppz/login-aid'
import { Login_aid_shopify } from '../../lib/mod.ts'

// const github_client_id = Deno.env.get('github_client_id')
// const github_client_secret = Deno.env.get('github_client_secret')
// const github_callback = Deno.env.get('github_callback')
// if (!github_client_id || !github_client_secret)
//   throw Error('no github client id or secret or callback')
// const with_github = new Login_aid_github(github_client_id, github_client_secret)

// const twitter_client_id = Deno.env.get('twitter_client_id')
// const twitter_client_secret = Deno.env.get('twitter_client_secret')
// const twitter_callback = Deno.env.get('twitter_callback')
// if (!twitter_client_id || !twitter_client_secret || !twitter_callback)
//   throw Error('no twitter client id or secret || callback')
// const with_twitter = new Login_aid_twitter(twitter_client_id, twitter_client_secret, twitter_callback)

const shopify_client_id = Deno.env.get('shopify_client_id')
const shopify_client_secret = Deno.env.get('shopify_client_secret')
const shopify_callback = Deno.env.get('shopify_callback')
const shopify_shop_id = Deno.env.get('shopify_shop_id')
if (!shopify_client_id || !shopify_client_secret || !shopify_callback || !shopify_shop_id)
  throw Error('no shopify client id or secret or callback')
const with_shopify = new Login_aid_shopify(shopify_client_id, shopify_client_secret, shopify_callback, shopify_shop_id)

Deno.serve(async req => {
  const url = new URL(req.url)
  switch(url.pathname) {
    case '/':
      return html(`
        <ul>
          <li>
            <a href="${with_shopify.get_authorize_url()}">
              login with shopify
            </a>
          </li>
        </ul>
      `)
    case '/login/shopify': {
      const code = url.searchParams.get('code')
      if (!code) throw Error('no shopify auth_code')
      
      const userinfo = await with_shopify.code2id(code)
      return html(`
        <img src="${userinfo.avatar}">
        <p>name: ${userinfo.name}, id: ${userinfo.id}, email: ${userinfo.email}</p>
      `)
    }
    // case '/login/github': { // case 里的 let 和 const 对所有 case 和 default 都有效，所以加大括号，制造块作用域
    //   // console.log('code from user browser is sending to github for access token and then userinfo')
    //   const code = url.searchParams.get('code')
    //   if (!code) throw Error('no github auth_code')
    //   const userinfo = await with_github.code2id(code)
    //   return html(`
    //     <img src="${userinfo.avatar_url}">
    //     <p>name: ${userinfo.login}, id: ${userinfo.id}</p>
    //   `)
    // }
    // case `/login/twitter`: {
    //   const code = url.searchParams.get('code')
    //   if (!code) throw Error('no twitter auth_code')
    //   const userinfo = await with_twitter.code2id(code)
    //   return html(`
    //     <p>name: ${userinfo.name}, id: ${userinfo.id}</p>
    //   `)
    // }
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
