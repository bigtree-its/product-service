#!/bin/bash
# for file in *.json
file=departments.json
if [ -f "$file" ]; then
    arr=$(cat "$file" | jq -r '.[].name')
    for name in "${arr[@]}"; do
        printf '%s\n' "$name"
        http POST :8080/departments name='$name'
    done
fi
