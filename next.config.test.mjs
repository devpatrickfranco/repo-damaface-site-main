import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import test from 'node:test'

import nextConfigMjs from './next.config.mjs'

const require = createRequire(import.meta.url)
const nextConfigJs = require('./next.config.js')

for (const [filename, config] of [
  ['next.config.mjs', nextConfigMjs],
  ['next.config.js', nextConfigJs],
]) {
  test(`${filename} permite otimizar imagens do backend e das capas no MinIO`, () => {
    assert.deepEqual(config.images?.remotePatterns, [
      {
        protocol: 'https',
        hostname: 'api.damaface.com.br',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 'ia-minio.i4khe5.easypanel.host',
        pathname: '/damaface-blog/**',
      },
    ])
  })
}
