/** Special errors caused in login with `login-aid.ts`. */
export
class Login_aid_error {
  constructor(
    public code: number,
    public error: Error,
  ) {}
}

/** Error code used in `Login_aid_error`. */
export
enum Login_aid_error_code {
  /** Error on retrieving github access token (github access token is unavailable from china). */
  github_retrieve_access_token = 1,
  /** Error on retrieving github userinfo. */
  github_retrieve_userinfo,

  /** Error on retrieving twitter access token (twitter access token is unavailable from china). */
  twitter_retrieve_access_token,
  /** Error on retrieving twitter userinfo. */
  twitter_retrieve_userinfo,

  /** Error on retrieving shopify access token */
  shopify_retrieve_access_token,
  /** Error on retrieving shopify userinfo */
  shopify_retrieve_userinfo,
}
