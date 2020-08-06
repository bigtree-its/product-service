#!/bin/bash
response=$(http :8080/categories | jq '.[] | ._id') 
IFS=' ' # space is set as delimiter
read -ra ADDR <<< "$response" # str is read into an array as tokens separated by IFS
for i in "${ADDR[@]}"; do # access each element of array
    echo "$i"
done
echo $response