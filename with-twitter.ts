import { Login_aid_error, Login_aid_error_code } from './error.ts'
import { encodeBase64 } from '@std/encoding'
/**
 * ### Login with X(twitter)
 * Details on [login with X](https://developer.x.com/en/docs/authentication/oauth-2-0/authorization-code).
 */
export
class Login_aid_X {
  constructor(
    private client_id: string,
    private client_secret: string,
  ) {}

  async login(code: string): Promise<Twitter_userinfo> {
    let access_token: string
    try {
      const res = await fetch(`https://api.twitter.com/2/oauth2/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Basic ' + encodeBase64(new TextEncoder().encode(this.client_id + ':' + this.client_secret)),
        },
        body: JSON.stringify({
          code,
          grant_type: 'authorization_code',
          redirect_uri: 'http://localhost:8000/login/x',
          code_verifier: 'challenge',
        }),
      })
      const data = await res.json() as { access_token: string }
      access_token = data.access_token
    } catch(err) {
      throw new Login_aid_error(Login_aid_error_code.twitter_retrieve_access_token, err as Error)
    }
    try {
      const res = await fetch(`https://api.twitter.com/2/users/me`, {
        headers: {
          // Accept: 'application/json',
          Authorization: 'Bearer ' + access_token,
        },
      })
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
