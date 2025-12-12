#!/bin/bash
# Vercel Environment Variables Setup Script

echo "🚀 Setting up Vercel environment variables..."

# Environment variables to set
declare -A env_vars=(
    ["NEXT_PUBLIC_API_BASE"]="https://limitless-caverns-03788-f84f5932a44c.herokuapp.com"
    ["NEXT_PUBLIC_ADMIN_API_BASE"]="https://limitless-caverns-03788-f84f5932a44c.herokuapp.com"
    ["NEXT_PUBLIC_USER_API_BASE"]="https://limitless-caverns-03788-f84f5932a44c.herokuapp.com"
    ["NEXT_PUBLIC_APP_NAME"]="AuraLearn"
)

environments=("production" "preview" "development")

# Set each environment variable for each environment
for key in "${!env_vars[@]}"; do
    value="${env_vars[$key]}"
    echo "Setting $key..."
    
    for env in "${environments[@]}"; do
        echo "  - Adding to $env environment..."
        echo "$value" | vercel env add "$key" "$env" --force 2>&1
    done
done

echo ""
echo "✅ Environment variables set!"
echo ""
echo "🚀 Deploying to Vercel..."
echo ""

# Deploy to production
vercel --prod --yes

echo ""
echo "✅ Deployment complete!"
echo ""

