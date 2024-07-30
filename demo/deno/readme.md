# login-aid.ts demo for Deno
In your GitHub App Settings or twitter Developer Portal:
1. Generate client id and secret
2. Set redirect url (callback)

A `.env` file is required:
```
github_client_id="your github client id"
github_client_secret="your github secret id"

twitter_client_id="your twitter client id"
twitter_client_secret="your twitter secret id"
twitter_callback="http://localhost:8000/login/twitter"
```

``` bash
git clone https://github.com/ppzreboot/login-aid.ts.git
cd login-aid.ts/demo/deno
deno task demo
```
