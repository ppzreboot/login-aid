import { Login_aid_OAuth2, make_basic_authorization } from './base.ts'
import { Login_aid_error, Login_aid_error_code } from './error.ts'

/**
 * ### Login with X(twitter)
 * OAuth2.0
 * 
 * Details on [login with X](https://developer.x.com/en/docs/authentication/oauth-2-0/authorization-code).
 */
export
class Login_aid_twitter extends Login_aid_OAuth2<Twitter_userinfo> {
  public authorize_url: string
  private basic_authorization: string
  constructor(client_id: string, client_secret: string, private callback: string) {
    super()
    // 此处 scope 要有 users.read 用来获取 userid；tweet.read 没有回报错，原因未知
    this.authorize_url = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${client_id}&redirect_uri=${callback}&scope=tweet.read%20users.read&state=state&code_challenge=challenge&code_challenge_method=plain`
    this.basic_authorization = make_basic_authorization(client_id, client_secret)
  }

  protected async obtain_access_token(code: string) {
    try {
      const res = await fetch(`https://api.twitter.com/2/oauth2/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: this.basic_authorization,
        },
        body: JSON.stringify({
          code,
          grant_type: 'authorization_code',
          redirect_uri: this.callback,
          code_verifier: 'challenge',
        }),
      })
      if (!res.ok)
        throw Error(await res.text())
      const data = await res.json() as { access_token: string }
      return data.access_token
    } catch(err) {
      throw new Login_aid_error(Login_aid_error_code.twitter_retrieve_access_token, err as Error)
    }
  }

  protected async obtain_userinfo(access_token: string) {
    try {
      const res = await fetch(`https://api.twitter.com/2/users/me`, {
        headers: {
          Authorization: 'Bearer ' + access_token,
        },
      })
      if (!res.ok)
        throw Error(await res.text())
      const { data } = await res.json() as { data: Twitter_userinfo }
      return data
    } catch(err) {
      throw new Login_aid_error(Login_aid_error_code.twitter_retrieve_userinfo, err as Error)
    }
  }
}

/** Raw data from twitter. */
export
interface Twitter_userinfo {
  id: string
  name: string
  /** unique username */
  username: string
}
