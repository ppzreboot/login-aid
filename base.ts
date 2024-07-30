import { encodeBase64 } from '@std/encoding'

interface I_userinfo {
  id: string | number
}

export
interface Login_aid<Userinfo extends I_userinfo> {
  authorize_url: string
  code2id(code: string): Promise<Userinfo>
}

export
abstract class Login_aid_OAuth2<Userinfo extends I_userinfo> implements Login_aid<Userinfo> {
  public abstract authorize_url: string
  public async code2id(code: string): Promise<Userinfo> {
    return await this.obtain_userinfo(await this.obtain_access_token(code))
  }

  protected abstract obtain_access_token(code: string): Promise<string>
  protected abstract obtain_userinfo(access_token: string): Promise<Userinfo>
}

export
function make_basic_authorization(id: string, password: string) {
  return 'Basic ' + encodeBase64(
    new TextEncoder().encode(id + ':' + password)
  )
}
