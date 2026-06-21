module.exports = {
  apps: [
    {
      name: 'jbmgmc-website',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      instances: 'max',
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        DATABASE_PATH: './data'
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
        DATABASE_PATH: './data'
      },
      error_file: './data/pm2_error.log',
      out_file: './data/pm2_out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss'
    }
  ]
}
