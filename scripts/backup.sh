#!/bin/bash

# Configuration
DB_DIR="/app/data" # or path to your data folder on the VPS
BACKUP_DIR="${DB_DIR}/backups/rolling"
MAX_BACKUPS=30
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/db_backup_${TIMESTAMP}.tar.gz"

echo "Starting database backup at $(date)..."

# Ensure backup directory exists
mkdir -p "${BACKUP_DIR}"

# Compress database JSON files
# We only target *.json files in the DB_DIR to keep it compact and clean
tar -czf "${BACKUP_FILE}" -C "${DB_DIR}" departments.json news_events.json gallery_hero.json pages_nav.json settings.json visitor-count.json 2>/dev/null

if [ $? -eq 0 ]; then
  echo "Backup successfully created: ${BACKUP_FILE}"
else
  # If running outside container, fallback to relative path check
  tar -czf "${BACKUP_FILE}" -C "./data" departments.json news_events.json gallery_hero.json pages_nav.json settings.json visitor-count.json 2>/dev/null
  if [ $? -eq 0 ]; then
    echo "Backup successfully created (local fallback): ${BACKUP_FILE}"
  else
    echo "Error: Database backup compression failed!" >&2
    exit 1
  fi
fi

# Clean up older backups (keep only the last 30 daily backups)
echo "Pruning older backups (limit: ${MAX_BACKUPS})..."
find "${BACKUP_DIR}" -name "db_backup_*.tar.gz" -type f | sort | head -n -${MAX_BACKUPS} | xargs rm -f 2>/dev/null

echo "Database backup process completed successfully."
