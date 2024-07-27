import { Login_aid_error, Login_aid_error_code } from './error.ts'

export
class Login_aid_github {
  constructor(
    private client_id: string,
    private client_secret: string,
  ) {}

  async login(code: string, redirect_url: string) {
    let access_token: string
    try {
      console.debug('requesting github access token')
      const res = await fetch(`https://github.com/login/oauth/access_token?client_id=${
        this.client_id}&client_secret=${this.client_secret}&code=${code}&redirect_url=${redirect_url}`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
          }
        })
      console.debug('request sent')
      const data = await res.json()
      access_token = data.access_token
      console.debug('github access token received:', access_token)
    } catch(err) {
      throw new Login_aid_error(Login_aid_error_code.github_retrieve_access_token, err)
    }
    try {
      console.debug('requesting github userinfo')
      const res = await fetch(`https://api.github.com/user`, {
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer ' + access_token,
        },
      })
      return await res.json()
    } catch(err) {
      throw new Login_aid_error(Login_aid_error_code.github_retrieve_userinfo, err)
    }
  }
}
