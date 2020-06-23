#!/bin/bash
for file in *.json
do
 # do something on $file
 if [ -f "$file" ]; then
     _id=$(cat "$file" |  jq '. | "\(._id)"')
     id=$( echo "$_id" | tr -d '"' )
     http PUT :8080/products/$id < $file
fi
done