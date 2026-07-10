#!/bin/bash

echo "===================================="
echo "TaxHub Project Diagnostic Report"
echo "===================================="

echo ""
echo "📁 Current folder:"
pwd

echo ""
echo "===================================="
echo "Project files"
echo "===================================="

ls -la

echo ""
echo "===================================="
echo "Package dependencies"
echo "===================================="

if [ -f package.json ]; then
    cat package.json
else
    echo "package.json not found"
fi

echo ""
echo "===================================="
echo "Checking Anthropic API integration"
echo "===================================="

echo ""
echo "ask route:"
if [ -f app/api/ask/route.js ]; then
    head -20 app/api/ask/route.js
else
    echo "app/api/ask/route.js not found"
fi

echo ""
echo "draft-email route:"
if [ -f app/api/draft-email/route.js ]; then
    head -20 app/api/draft-email/route.js
else
    echo "app/api/draft-email/route.js not found"
fi

echo ""
echo "===================================="
echo "Environment files"
echo "===================================="

ls -la | grep env

echo ""
echo "Git tracked environment files:"
git ls-files | grep env || echo "No env files tracked"

echo ""
echo "===================================="
echo "Searching Anthropic references"
echo "===================================="

grep -R "Anthropic" app lib package.json 2>/dev/null || echo "No Anthropic references found"

echo ""
echo "===================================="
echo "Searching API key references"
echo "===================================="

grep -R "ANTHROPIC_API_KEY" . --exclude-dir=node_modules --exclude-dir=.next 2>/dev/null || echo "No API key references found"

echo ""
echo "===================================="
echo "Node modules status"
echo "===================================="

if [ -d node_modules ]; then
    echo "node_modules exists"
else
    echo "node_modules missing. Run npm install"
fi

echo ""
echo "===================================="
echo "Finished"
echo "===================================="
