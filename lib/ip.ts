import { headers } from 'next/headers'

/**
 * Safely extracts the client's IP address from incoming headers.
 * 
 * In a production deployment behind a reverse proxy (e.g. Nginx, Cloudflare),
 * clients can forge the X-Forwarded-For header.
 * 
 * Security approach:
 * 1. Prefer X-Real-IP (set by Nginx proxy, which overrides any client values).
 * 2. Next, check CF-Connecting-IP (set by Cloudflare proxy, which cannot be spoofed if behind Cloudflare).
 * 3. Fall back to X-Forwarded-For if set by other proxy configurations.
 * 4. Fall back to local loopback if no headers are present.
 */
export async function getClientIp(): Promise<string> {
  const headersList = await headers()
  
  const realIp = headersList.get('x-real-ip')
  if (realIp) return realIp.trim()
  
  const cfIp = headersList.get('cf-connecting-ip')
  if (cfIp) return cfIp.trim()
  
  const xForwardedFor = headersList.get('x-forwarded-for')
  if (xForwardedFor) {
    const parts = xForwardedFor.split(',')
    if (parts.length > 0 && parts[0]) {
      return parts[0].trim()
    }
  }
  
  return '127.0.0.1'
}
