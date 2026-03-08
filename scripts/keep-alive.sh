#!/usr/bin/env bash
# =============================================================================
# keep-alive.sh — Pings the API health endpoint to prevent Azure Function
#                 cold starts on the free tier.
#
# SETUP
# -----
# 1. Make executable (one-time):
#      chmod +x /path/to/AalokDeepDotCom/scripts/keep-alive.sh
#
# 2. Add a crontab entry to run every 15 minutes:
#      crontab -e
#      */15 * * * * /full/path/to/AalokDeepDotCom/scripts/keep-alive.sh
#
#    To find the full path:
#      cd /path/to/AalokDeepDotCom && pwd
#
# LOGS
# ----
# Logs are written to: ~/.local/share/aalokdeep-keepalive/keep-alive.log
#
#    View live:    tail -f ~/.local/share/aalokdeep-keepalive/keep-alive.log
#    View recent:  tail -n 20 ~/.local/share/aalokdeep-keepalive/keep-alive.log
#
# MOVING TO A VPS
# ---------------
# Clone the repo on the VPS, chmod +x this script, and add the same crontab
# entry. No other dependencies are required beyond curl (pre-installed on most
# Linux distributions).
# =============================================================================

set -euo pipefail

ENDPOINT="https://aalokdeep.com/api/health"
LOG_DIR="${HOME}/.local/share/aalokdeep-keepalive"
LOG_FILE="${LOG_DIR}/keep-alive.log"
MAX_LINES=500

mkdir -p "${LOG_DIR}"

TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "${ENDPOINT}" || echo "000")

echo "${TIMESTAMP}  status=${HTTP_STATUS}  url=${ENDPOINT}" >> "${LOG_FILE}"

# Rotate: keep only the last MAX_LINES lines
LOG_CONTENT=$(tail -n "${MAX_LINES}" "${LOG_FILE}")
echo "${LOG_CONTENT}" > "${LOG_FILE}"
