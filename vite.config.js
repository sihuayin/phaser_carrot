import { defineConfig } from 'vite'

function resolveBase () {
  const repository = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? ''

  if (!process.env.GITHUB_ACTIONS) {
    return '/'
  }

  if (!repository || repository.endsWith('.github.io')) {
    return '/'
  }

  return `/${repository}/`
}

export default defineConfig({
  base: resolveBase()
})
