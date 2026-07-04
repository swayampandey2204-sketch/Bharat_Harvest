#!/bin/bash

# Simple sandbox shell test script to hit key endpoints of Bharat Harvest API
API_URL="http://localhost:5001/api/v1"

echo "=== Testing Bharat Harvest E-Commerce APIs ==="
echo "Note: Make sure your MongoDB local instance is running and server is active."

# 1. Base route test
echo -e "\n1. Testing Base Route..."
curl -s -X GET "http://localhost:5001/" | grep -o '"message":[^,]*'

# 2. Get Products Catalog
echo -e "\n2. Fetching Products List..."
curl -s -X GET "$API_URL/products" | grep -o '"totalProducts":[^,]*'

# 3. Get Categories
echo -e "\n3. Fetching Product Categories..."
curl -s -X GET "$API_URL/categories" | grep -o '"name":[^,]*'

# 4. User Registration (Dummy Request Example)
echo -e "\n4. User Registration Example (Payload format validation):"
echo 'curl -X POST -H "Content-Type: application/json" -d '\''{"name":"Test User","email":"test@example.com","password":"password123"}'\'' '"$API_URL/auth/register"

# 5. User Login (Dummy Request Example)
echo -e "\n5. User Login Example (Payload format validation):"
echo 'curl -X POST -H "Content-Type: application/json" -d '\''{"email":"test@example.com","password":"password123"}'\'' '"$API_URL/auth/login"

echo -e "\n=== Test script setup complete ==="
