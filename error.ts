/** Special errors caused in login with login-aid.ts */
export
class Login_aid_error {
  constructor(
    public code: number,
    public error: Error,
  ) {}
}

/** error code used in Login_aid_error */
export
enum Login_aid_error_code {
  /** error on retrieving access token (github access token is unavailable from china) */
  github_retrieve_access_token = 1,
  /** error on retrieving userinfo */
  github_retrieve_userinfo,
}
