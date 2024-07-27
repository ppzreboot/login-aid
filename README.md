# login-aid.ts
[GitHub](https://github.com/ppzreboot/login-aid.ts)
| [API Document](https://jsr.io/@ppz/login-aid/doc)
| [JSR](https://jsr.io/@ppz/login-aid)
| [demo for deno](https://github.com/ppzreboot/login-aid.ts/tree/main/demo/deno)

login with:
+ [github](https://jsr.io/@ppz/login-aid@latest/doc/~/Login_aid_github) (unavailable from china)

## Usage
### Install
use with deno:
``` bash
deno add @ppz/login-aid
```
use with npm:
``` bash
npx jsr add @ppz/login-aid
```
use with pnpm:
``` bash
pnpm dlx jsr add @ppz/login-aid
```

### Login looks like...
``` ts
import { Login_aid_github } from '@ppz/login-aid'

// You need a Login_aid_github instance.
const with_github = new Login_aid_github(github_client_id, github_client_secret)

// And exchange code for userinfo.
const userinfo = await with_github.login(code)
```
