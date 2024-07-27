import { Login_aid_error, Login_aid_error_code } from './error.ts'

/** login-aid.ts for github */
export
class Login_aid_github {
  /**
   * @param client_id Github APP's client id. 
   * @param client_secret Github APP's client secret.
   */
  constructor(
    private client_id: string,
    private client_secret: string,
  ) {}

  async login(code: string): Promise<Github_userinfo> {
    let access_token: string
    try {
      // console.debug('requesting github access token')
      const res = await fetch(`https://github.com/login/oauth/access_token?client_id=${
        this.client_id}&client_secret=${this.client_secret}&code=${code}`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
          }
        })
      // console.debug('request sent')
      const data = await res.json() as { access_token: string }
      access_token = data.access_token
      // console.debug('github access token received:', access_token)
    } catch(err) {
      throw new Login_aid_error(Login_aid_error_code.github_retrieve_access_token, err as Error)
    }
    try {
      // console.debug('requesting github userinfo')
      const res = await fetch(`https://api.github.com/user`, {
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer ' + access_token,
        },
      })
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
