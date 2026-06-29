import { createHash } from 'crypto'
import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import type { Connect } from 'vite'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

function iconCacheVersion(): string {
  const hash = createHash('md5')
  for (const file of ['icon.png', 'favicon.ico', 'favicon-16.png', 'favicon-32.png', 'favicon-48.png']) {
    try {
      hash.update(readFileSync(resolve(__dirname, 'public', file)))
    } catch {
      // ignore missing files during initial setup
    }
  }
  return hash.digest('hex').slice(0, 8)
}

function spaFallback() {
  return {
    name: 'spa-fallback',
    closeBundle() {
      const index = resolve(__dirname, 'dist/index.html')
      writeFileSync(resolve(__dirname, 'dist/404.html'), readFileSync(index, 'utf-8'))
    },
  }
}

function injectIconVersion() {
  const version = iconCacheVersion()
  const query = `?v=${version}`
  const basePath = (process.env.VITE_BASE_PATH || '/tpd-weekly-update/').replace(/\/$/, '')
  return {
    name: 'inject-icon-version',
    transformIndexHtml: {
      order: 'post',
      handler(html: string, ctx?: { bundle?: unknown }) {
        let result = html.replaceAll('%ICON_VERSION%', query)
        if (!ctx?.bundle) return result
        return result.replace(
          /href="\/((?:favicon[^"]*|icon\.png)[^"]*)"/g,
          `href="${basePath}/$1"`,
        )
      },
    },
    config() {
      return {
        define: {
          'import.meta.env.VITE_ICON_VERSION': JSON.stringify(version),
        },
      }
    },
  }
}

function overrideDefaultFavicon(base: string, version: string) {
  const favicon = `${base}favicon-32.png?v=${version}`
  return {
    name: 'override-default-favicon',
    configureServer(server: { middlewares: Connect.Server }) {
      server.middlewares.use((req: Connect.IncomingMessage, _res, next: Connect.NextFunction) => {
        const path = req.url?.split('?')[0] ?? ''
        if (path === '/vite.svg' || path.endsWith('/vite.svg')) {
          req.url = favicon
        } else if (path === '/favicon.ico' || path.endsWith('/favicon.ico')) {
          req.url = favicon
        }
        next()
      })
    },
  }
}

const iconVersion = iconCacheVersion()
const base = process.env.VITE_BASE_PATH || '/tpd-weekly-update/'

export default defineConfig({
  plugins: [react(), tailwindcss(), injectIconVersion(), overrideDefaultFavicon(base, iconVersion), spaFallback()],
  base,
  define: {
    'import.meta.env.VITE_ICON_VERSION': JSON.stringify(iconVersion),
  },
})
