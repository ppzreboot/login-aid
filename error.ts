export
class Login_aid_error {
  constructor(
    public code: number,
    public error: Error,
  ) {}
}

export
enum Login_aid_error_code {
  github_retrieve_access_token = 1,
  github_retrieve_userinfo,
}
