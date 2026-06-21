import fs from 'fs'
import path from 'path'

const LIMITS_FILE = path.join(process.cwd(), 'data', 'rate-limits.json')

export interface RateLimitRecord {
  attempts: number;
  cooldownUntil: number; // timestamp in ms
  violationCount: number; // how many times they hit the limit
  lastAttempt: number; // timestamp of last attempt
}

interface RateLimitData {
  [ip: string]: {
    login?: RateLimitRecord;
    upload?: RateLimitRecord;
    publicData?: RateLimitRecord;
  }
}

// In-memory cache to reduce disk reads
let cache: RateLimitData = {}
let cacheLoaded = false

function loadRateLimits(): RateLimitData {
  if (cacheLoaded) return cache
  try {
    if (fs.existsSync(LIMITS_FILE)) {
      const raw = fs.readFileSync(LIMITS_FILE, 'utf-8')
      cache = JSON.parse(raw)
    }
  } catch (e) {
    console.error('Error reading rate limits file:', e)
  }
  cacheLoaded = true
  return cache
}

let saveTimeout: NodeJS.Timeout | null = null

function saveRateLimits(): void {
  if (saveTimeout) return // Save is already scheduled, don't schedule another
  
  saveTimeout = setTimeout(() => {
    saveTimeout = null
    try {
      const dir = path.dirname(LIMITS_FILE)
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }
      fs.writeFile(LIMITS_FILE, JSON.stringify(cache, null, 2), 'utf-8', (err) => {
        if (err) {
          console.error('Error saving rate limits file asynchronously:', err)
        }
      })
    } catch (e) {
      console.error('Error in rate limit directory checks:', e)
    }
  }, 2000)
}

const DEFAULT_COOLDOWN_MS = 30 * 60 * 1000 // 30 minutes

export function checkRateLimit(ip: string, action: 'login' | 'upload' | 'publicData'): {
  allowed: boolean;
  timeLeftSeconds: number;
} {
  const data = loadRateLimits()
  if (!data[ip]) data[ip] = {}
  
  const record = data[ip][action]
  if (!record) {
    return { allowed: true, timeLeftSeconds: 0 }
  }

  const now = Date.now()
  if (record.cooldownUntil > now) {
    return { 
      allowed: false, 
      timeLeftSeconds: Math.ceil((record.cooldownUntil - now) / 1000) 
    }
  }

  return { allowed: true, timeLeftSeconds: 0 }
}

export function recordAttempt(ip: string, action: 'login' | 'upload' | 'publicData', isFailure: boolean = true): {
  blocked: boolean;
  timeLeftSeconds: number;
} {
  const data = loadRateLimits()
  if (!data[ip]) data[ip] = {}

  let record = data[ip][action]
  if (!record) {
    record = {
      attempts: 0,
      cooldownUntil: 0,
      violationCount: 0,
      lastAttempt: Date.now()
    }
    data[ip][action] = record
  }

  const now = Date.now()

  // For general APIs (upload/publicData), reset attempt count if they've been quiet for more than 30 minutes
  if (action !== 'login' && now - record.lastAttempt > DEFAULT_COOLDOWN_MS) {
    record.attempts = 0;
  }
  
  record.lastAttempt = now

  if (isFailure) {
    record.attempts += 1
  }

  if (record.attempts > 5) {
    record.violationCount += 1
    const cooldownDuration = DEFAULT_COOLDOWN_MS * Math.pow(3, record.violationCount - 1)
    record.cooldownUntil = now + cooldownDuration
    record.attempts = 0 // reset attempt count
    
    saveRateLimits()
    return {
      blocked: true,
      timeLeftSeconds: Math.ceil(cooldownDuration / 1000)
    }
  }

  saveRateLimits()
  return { blocked: false, timeLeftSeconds: 0 }
}

export function clearRateLimit(ip: string, action: 'login' | 'upload' | 'publicData'): void {
  const data = loadRateLimits()
  if (data[ip] && data[ip][action]) {
    delete data[ip][action]
    saveRateLimits()
  }
}
