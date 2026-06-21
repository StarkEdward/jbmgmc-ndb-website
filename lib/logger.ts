import fs from 'fs'
import path from 'path'

const LOG_DIR = process.env.DATABASE_PATH
  ? path.resolve(process.env.DATABASE_PATH)
  : path.join(process.cwd(), 'data')

const APP_LOG_PATH = path.join(LOG_DIR, 'app.log')
const ERROR_LOG_PATH = path.join(LOG_DIR, 'error.log')

export type LogLevel = 'INFO' | 'WARN' | 'ERROR'

interface LogEntry {
  timestamp: string
  level: LogLevel
  category: string
  message: string
  metadata?: any
}

class Logger {
  private writeLog(level: LogLevel, category: string, message: string, metadata?: any) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      metadata
    }

    const logLine = JSON.stringify(entry) + '\n'

    // Console output for PM2 / Docker / stdout streams
    if (level === 'ERROR') {
      console.error(`[${entry.timestamp}] [${level}] [${category}] ${message}`, metadata || '')
    } else if (level === 'WARN') {
      console.warn(`[${entry.timestamp}] [${level}] [${category}] ${message}`, metadata || '')
    } else {
      console.log(`[${entry.timestamp}] [${level}] [${category}] ${message}`)
    }

    // Append to log files asynchronously (fire-and-forget to keep the main request path non-blocking)
    try {
      if (!fs.existsSync(LOG_DIR)) {
        fs.mkdirSync(LOG_DIR, { recursive: true })
      }
      fs.appendFile(APP_LOG_PATH, logLine, (err) => {
        if (err) console.error('Failed to write to app.log:', err)
      })
      if (level === 'ERROR') {
        fs.appendFile(ERROR_LOG_PATH, logLine, (err) => {
          if (err) console.error('Failed to write to error.log:', err)
        })
      }
    } catch (e) {
      // Fail-silent for logger file failures to protect the main application flow
    }
  }

  public info(category: string, message: string, metadata?: any) {
    this.writeLog('INFO', category, message, metadata)
  }

  public warn(category: string, message: string, metadata?: any) {
    this.writeLog('WARN', category, message, metadata)
  }

  public error(category: string, message: string, metadata?: any) {
    this.writeLog('ERROR', category, message, metadata)
  }
}

export const logger = new Logger()
