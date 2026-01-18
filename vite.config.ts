import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as fs from 'fs'
import * as path from 'path'

// https://vite.dev/config/
export default defineConfig(() => {
  // Manually load .env file to ensure variables are read
  const envPath = path.resolve(process.cwd(), '.env')
  let haToken = ''
  let haUrl = 'http://192.168.0.208:8123'
  
  if (fs.existsSync(envPath)) {
    let envContent = fs.readFileSync(envPath, 'utf-8')
    // Remove BOM if present
    if (envContent.charCodeAt(0) === 0xFEFF) {
      envContent = envContent.slice(1)
    }
    
    // Parse .env file - read all content first to handle token spanning lines
    const tokenMatch = envContent.match(/VITE_HA_TOKEN=([^\n]*(?:\n[^\n]*)*?)(?=\n|$)/m)
    const urlMatch = envContent.match(/VITE_HA_URL=([^\n]+)/)
    
    if (tokenMatch) {
      haToken = tokenMatch[1].trim().replace(/\n/g, '')
    }
    if (urlMatch) {
      haUrl = urlMatch[1].trim()
    }
  }

  console.log('=== Vite Config Debug ===')
  console.log('HA URL:', haUrl)
  console.log('HA Token present:', !!haToken)
  if (haToken) {
    console.log('HA Token length:', haToken.length)
    console.log('HA Token preview:', haToken.substring(0, 50) + '...')
  }
  console.log('========================')
  
  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: haUrl,
          changeOrigin: true,
          onProxyReq: (proxyReq: any, req: any) => {
            console.log(`[Proxy] ${req.method} ${req.url}`)
            // Add authorization header to proxied requests
            if (haToken) {
              proxyReq.setHeader('Authorization', `Bearer ${haToken}`)
              console.log('[Proxy] Authorization header added')
            } else {
              console.log('[Proxy] WARNING: No auth token!')
            }
          },
          onProxyRes: (proxyRes: any) => {
            console.log(`[Proxy] Response status: ${proxyRes.statusCode}`)
          }
        },
      },
    },
  }
})
