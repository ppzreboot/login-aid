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
  constructor(private client_id: string, private client_secret: string, private callback: string, private shop_id: string) {
    super()
    this.authorize_url = `https://shopify.com/${shop_id}/auth/oauth/authorize`
  }

  public get_authorize_url() {
    const params = new URLSearchParams()
    params.append('scope', 'openid email https://api.customers.com/auth/customer.graphql')
    params.append('client_id', this.client_id)
    params.append('response_type', 'code')
    params.append('redirect_uri', this.callback)

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
      const body = new URLSearchParams()
      body.append('grant_type', 'authorization_code')
      body.append('client_id', this.client_id)
      body.append('redirect_uri', this.callback,)
      body.append('code', code)

      const res = await fetch(
        `https://shopify.com/${this.shop_id}/auth/oauth/token`,
        {
          method: 'POST',
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${btoa(`${this.client_id}:${this.client_secret}`)}`,
          },
          body,
        },
      )
      if (!res.ok)
        throw Error(await res.text())
      const data = await res.json() as { access_token: string }
      return data.access_token
    } catch(err) {
      throw new Login_aid_error(Login_aid_error_code.shopify_retrieve_access_token, err as Error)
    }
  }

  async obtain_userinfo(access_token: string): Promise<Shopify_userinfo> {
    try {
      const res = await fetch(`https://shopify.com/${this.shop_id}/account/customer/api/2024-07/graphql`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Authorization: access_token,
        },
        body: JSON.stringify({
          operationName: 'Retrieve Userinfo',
          query: `query {
            customer {
              id
              displayName
              phoneNumber {
                phoneNumber
              }
              imageUrl
              emailAddress {
                emailAddress
              }
            }
          }`,
          variables: {},
        }),
      })
      if (!res.ok)
        throw Error(await res.text())
      const data = await res.json() as Raw_customer
      const customer = data.data.customer
      return {
        id: customer.id,
        name: customer.displayName,
        phone: customer.phoneNumber?.phoneNumber,
        avatar: customer.imageUrl,
        email: customer.emailAddress.emailAddress,
      }
    } catch(err) {
      throw new Login_aid_error(Login_aid_error_code.shopify_retrieve_userinfo, err as Error)
    }
  }
}

/** Raw data from shopify.
 * 
 * https://shopify.dev/docs/api/customer/2024-07/queries/customer#returns
 */
interface Raw_customer {
  data: {
    customer: {
      id: string
      displayName: string
      phoneNumber?: {
        phoneNumber: string
      }
      imageUrl: string
      emailAddress: {
        emailAddress: string
      }
    }
  }
}

export
interface Shopify_userinfo {
  id: string
  name: string
  email: string
  phone?: string
  avatar: string
}
