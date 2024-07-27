# login-aid.ts
login aid with:
+ [github](https://jsr.io/@ppz/login-aid@latest/doc/~/Login_aid_github) (unavailable from china)

``` ts
import { Login_aid_github } from '@ppz/login-aid'

// You need a Login_aid_github instance.
const with_github = new Login_aid_github(github_client_id, github_client_secret)

// And exchange userinfo with code.
const userinfo = await with_github.login(code)
```

[Document](https://jsr.io/@ppz/login-aid/doc)
| [demo for deno](https://github.com/ppzreboot/login-aid.ts/tree/main/demo/deno)