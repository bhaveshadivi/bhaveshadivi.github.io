#!/bin/bash
# Start the Jekyll development server for the Bhavesh Adivi academic website
#
# Usage:
#   ./serve.sh
#
# Then open your browser to: http://localhost:4000

cd "$(dirname "$0")"

echo "Starting Jekyll server..."
bundle exec jekyll serve --host 127.0.0.1 --port 4000
