import { Login_aid_OAuth2 } from './base.ts'
import { Login_aid_error, Login_aid_error_code } from './error.ts'

/**
 * ### Login with shopify
 * OAuth2.0

 * Details(https://shopify.dev/docs/api/customer#step-authorization).
 */
export
class Login_aid_shopify extends Login_aid_OAuth2<Shopify_userinfo> {
  public authorize_url: string
  constructor(private client_id: string, private client_secret: string, shop_id: string) {
    super()
    this.authorize_url = `https://shopify.com/${shop_id}/auth/oauth/authorize`
  }

  public get_authorize_url() {
    const params = new URLSearchParams()
    params.append('scope', 'openid email https://api.customers.com/auth/customer.graphql')
    params.append('client_id', this.client_id)
    params.append('response_type', 'code')
    params.append('redirect_uri', this.client_id)

    {
      // https://shopify.dev/docs/api/customer#generating-state
      const timestamp = Date.now().toString()
      const random_str = Math.random().toString(36).substring(2)
      params.append('state', timestamp + random_str) 
    }

    return this.authorize_url + '?' + params.toString()
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

  async obtain_userinfo(access_token: string): Promise<Shopify_userinfo> {
    try {
      const res = await fetch(`https://api.github.com/user`, {
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer ' + access_token,
        },
      })
      if (!res.ok)
        throw Error(await res.text())
      return await res.json() as Shopify_userinfo
    } catch(err) {
      throw new Login_aid_error(Login_aid_error_code.github_retrieve_userinfo, err as Error)
    }
  }
}

/** Raw data from github. */
export
interface Shopify_userinfo {
  login: string
  id: number
  avatar_url: string
  type: string
  email: string
}
