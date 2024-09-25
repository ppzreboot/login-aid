import { Login_aid_OAuth2 } from './base.ts'
import { Login_aid_error, Login_aid_error_code } from './error.ts'

/**
 * ### Login with github
 * OAuth2.0
 * 
 * 1. Create your github APP [here](https://github.com/settings/apps) and generate your client id and client secret.
 * 2. In your APP, direct the user to https://github.com/login/oauth/authorize, and add client id as a query parameter. For example: https://github.com/login/oauth/authorize?client_id=12345.
 * 3. If the user accepts your authorization request, GitHub will redirect the user to one of the callback URLs in your app settings, and provide a `code` query parameter.
 * 4. Your server will receive a request (redirection at previous step) with a `code` query parameter.
 * 5. In your server, call `Login_aid_github::login(code)`, and you will get userinfo.
 * 
 * Details on [login with github](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-a-user-access-token-for-a-github-app#using-the-device-flow-to-generate-a-user-access-tokehttps://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-a-user-access-token-for-a-github-app).
 */
export
class Login_aid_github extends Login_aid_OAuth2<Github_userinfo> {
  public authorize_url: string
  constructor(private client_id: string, private client_secret: string) {
    super()
    this.authorize_url = 'https://github.com/login/oauth/authorize?client_id=' + client_id
  }

  protected async obtain_access_token(code: string): Promise<string> {
    try {
      const res = await fetch(
        `https://github.com/login/oauth/access_token?client_id=${
          this.client_id}&client_secret=${this.client_secret}&code=${code}`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
          },
        },
      )
      if (!res.ok)
        throw Error(await res.text())
      const data = await res.json() as { access_token: string }
      return data.access_token
    } catch(err) {
      throw new Login_aid_error(Login_aid_error_code.github_retrieve_access_token, err as Error)
    }
  }

  async obtain_userinfo(access_token: string): Promise<Github_userinfo> {
    try {
      const res = await fetch(`https://api.github.com/user`, {
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer ' + access_token,
        },
      })
      if (!res.ok)
        throw Error(await res.text())
      return await res.json() as Github_userinfo
    } catch(err) {
      throw new Login_aid_error(Login_aid_error_code.github_retrieve_userinfo, err as Error)
    }
  }
}

/** Raw data from github. */
export
interface Github_userinfo {
  login: string
  id: number
  avatar_url: string
  type: string
  email: string
}
