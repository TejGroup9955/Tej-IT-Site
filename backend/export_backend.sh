#!/bin/bash

OUTPUT_FILE="/var/www/html/Tej-IT-Site/backend/backend_dump.txt"

# Clear the file if it exists
> "$OUTPUT_FILE"

# Cat backend root files (excluding flask_session, venv)
echo "====== app.py ======" >> "$OUTPUT_FILE"
cat app.py >> "$OUTPUT_FILE"
echo -e "\n\n" >> "$OUTPUT_FILE"

echo "====== requirements.txt ======" >> "$OUTPUT_FILE"
cat requirements.txt >> "$OUTPUT_FILE"
echo -e "\n\n" >> "$OUTPUT_FILE"

# Cat all template files
for f in templates/*.html; do
    echo "====== $f ======" >> "$OUTPUT_FILE"
    cat "$f" >> "$OUTPUT_FILE"
    echo -e "\n\n" >> "$OUTPUT_FILE"
done

# Cat static/css files
for f in static/css/*; do
    echo "====== $f ======" >> "$OUTPUT_FILE"
    cat "$f" >> "$OUTPUT_FILE"
    echo -e "\n\n" >> "$OUTPUT_FILE"
done

# Only list static/uploads
echo "====== static/uploads/ ======" >> "$OUTPUT_FILE"
ls -lh static/uploads/ >> "$OUTPUT_FILE"
