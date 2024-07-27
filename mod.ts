/**
 * @module
 * ### Login with github
 * 1. Create your github APP [here](https://github.com/settings/apps) and generate your client id and client secret.
 * 2. In your APP, direct the user to https://github.com/login/oauth/authorize, and add client id as a query parameter. For example: https://github.com/login/oauth/authorize?client_id=12345.
 * 3. If the user accepts your authorization request, GitHub will redirect the user to one of the callback URLs in your app settings, and provide a `code` query parameter.
 * 4. Your server will receive a request (redirection at previous step) with a `code` query parameter.
 * 5. In your server, call `Login_aid_github::login(code)`, and you will get userinfo.
 * 
 * Details on [login with github](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-a-user-access-token-for-a-github-app#using-the-device-flow-to-generate-a-user-access-tokehttps://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-a-user-access-token-for-a-github-app).
 */

export * from './with-github.ts'
export * from './error.ts'
