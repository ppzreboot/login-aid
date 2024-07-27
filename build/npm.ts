import { build, emptyDir } from '@deno/dnt'
import package_info from '../deno.json' with { type: 'json' }

await emptyDir('./npm')

await build({
  entryPoints: ['./mod.ts'],
  outDir: './npm',
  shims: {
    deno: true,
  },
  package: {
    name: 'login-aid',
    version: package_info.version,
    description: 'login with: github',
    license: 'UNLICENSE',
    repository: {
      type: 'git',
      url: 'git+https://github.com/ppzreboot/login-aid.ts.git',
    },
    bugs: {
      url: 'https://github.com/ppzreboot/login-aid.ts/issues',
    },
  },
  postBuild() {
    Deno.copyFileSync('LICENSE', 'npm/LICENSE')
    Deno.copyFileSync('README.md', 'npm/README.md')
  },
})