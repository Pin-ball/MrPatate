import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import type { HtmlTagDescriptor, Plugin } from 'vite'

const MANIFEST = resolve(import.meta.dirname, '../../public/manifest.webmanifest')

const IMAGE = { path: '/assets/icon-512.png', type: 'image/png', width: 512, height: 512 }

type Manifest = { name: string; description: string }

function readManifest(): Manifest {
  return JSON.parse(readFileSync(MANIFEST, 'utf8'))
}

function siteUrl(): URL | null {
  const domain = process.env['VERCEL_PROJECT_PRODUCTION_URL']
  return domain ? new URL(`https://${domain}`) : null
}

function meta(key: 'name' | 'property', value: string, content: string): HtmlTagDescriptor {
  return { tag: 'meta', attrs: { [key]: value, content }, injectTo: 'head' }
}

function socialTags(): HtmlTagDescriptor[] {
  const { name, description } = readManifest()
  const site = siteUrl()
  const tags = [
    { tag: 'title', children: name, injectTo: 'head' } satisfies HtmlTagDescriptor,
    meta('name', 'description', description),
    meta('property', 'og:type', 'website'),
    meta('property', 'og:site_name', name),
    meta('property', 'og:title', name),
    meta('property', 'og:description', description),
    meta('property', 'og:locale', 'fr_FR'),
    meta('property', 'og:locale:alternate', 'en_US'),
    meta('name', 'twitter:card', 'summary'),
  ]
  if (!site) return tags

  return [
    ...tags,
    meta('property', 'og:url', site.href),
    meta('property', 'og:image', new URL(IMAGE.path, site).href),
    meta('property', 'og:image:type', IMAGE.type),
    meta('property', 'og:image:width', String(IMAGE.width)),
    meta('property', 'og:image:height', String(IMAGE.height)),
    meta('property', 'og:image:alt', name),
  ]
}

export function social(): Plugin {
  return {
    name: 'mr-patate:social',
    transformIndexHtml: () => socialTags(),
  }
}
