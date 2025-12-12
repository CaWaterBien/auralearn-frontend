# 🔧 Vercel Environment Variables Setup Guide

## 🚨 **CRITICAL: Your App Won't Work Without This!**

Your Vercel deployment is trying to connect to `localhost:8000` because the environment variables are not set. **You MUST set these in Vercel dashboard for your app to work.**

---

## 📋 **Quick Setup (5 Minutes)**

### Step 1: Open Vercel Dashboard

1. Go to: https://vercel.com/dashboard
2. Find your project: **capstone-app** (or your project name)
3. Click on your project

### Step 2: Navigate to Settings

1. Click on the **"Settings"** tab (top navigation)
2. Scroll down and click on **"Environment Variables"** in the left sidebar

### Step 3: Add These 4 Environment Variables

Click **"Add New"** and add each of these **exactly as shown**:

| **Key** | **Value** |
|---------|-----------|
| `NEXT_PUBLIC_API_BASE` | `https://limitless-caverns-03788-f84f5932a44c.herokuapp.com` |
| `NEXT_PUBLIC_ADMIN_API_BASE` | `https://limitless-caverns-03788-f84f5932a44c.herokuapp.com` |
| `NEXT_PUBLIC_USER_API_BASE` | `https://limitless-caverns-03788-f84f5932a44c.herokuapp.com` |
| `NEXT_PUBLIC_APP_NAME` | `AuraLearn` |

**Important:**
- ✅ **Type the key names EXACTLY** (case-sensitive, no spaces)
- ✅ **Copy and paste the values** to avoid typos
- ✅ **Select "Production", "Preview", and "Development"** for each variable (use the dropdown)
- ✅ **No quotes needed** around the values

### Step 4: Save and Redeploy

1. After adding all 4 variables, click **"Save"**
2. Go to the **"Deployments"** tab
3. Click the **"..."** (three dots) on your latest deployment
4. Click **"Redeploy"**
5. Wait for the deployment to complete (~2-3 minutes)

---

## ✅ **What Was Fixed in the Code**

All hardcoded `localhost:8000` references have been replaced with environment variables:

1. ✅ **`next.config.ts`** - Now uses `NEXT_PUBLIC_API_BASE` for rewrites
2. ✅ **`lib/user-api.ts`** - Already uses `NEXT_PUBLIC_USER_API_BASE`
3. ✅ **`lib/course-api.ts`** - Already uses `NEXT_PUBLIC_API_BASE`
4. ✅ **`lib/admin-api.ts`** - Already uses `NEXT_PUBLIC_ADMIN_API_BASE`
5. ✅ **`components/topic-renderer.tsx`** - Fixed to use environment variables
6. ✅ **`components/admin/ImageUpload.tsx`** - Fixed to use environment variables
7. ✅ **`components/admin/VideoUpload.tsx`** - Fixed to use environment variables
8. ✅ **`app/admin/courses/[courseId]/lessons/page.tsx`** - Fixed to use environment variables

---

## 🧪 **Testing After Setup**

After setting the environment variables and redeploying:

1. **Visit your Vercel URL**: https://capstone-app-lyart.vercel.app
2. **Try to sign up** - Should connect to Heroku backend
3. **Try to sign in** - Should authenticate successfully
4. **Check browser console** (F12) - Should see NO `localhost:8000` errors

---

## 🎯 **How It Works**

### Development (Local)
- Uses `localhost:8000` as fallback
- Next.js rewrites `/api/*` to `http://localhost:8000/api/*`
- Works with your local Laravel backend

### Production (Vercel)
- Uses `NEXT_PUBLIC_*` environment variables
- Directly calls `https://limitless-caverns-03788-f84f5932a44c.herokuapp.com`
- No rewrites needed (returns empty array in `next.config.ts`)

---

## 🔍 **Verification Checklist**

After setting environment variables, verify:

- [ ] All 4 environment variables are set in Vercel
- [ ] Variables are enabled for Production, Preview, and Development
- [ ] Latest deployment is redeployed after adding variables
- [ ] No `localhost:8000` errors in browser console
- [ ] Login/Signup works on Vercel deployment
- [ ] API calls succeed (check Network tab in browser dev tools)

---

## 🚨 **Troubleshooting**

### Issue: Still seeing `localhost:8000` errors

**Solution:**
1. Make sure you **redeployed** after adding environment variables
2. Clear your browser cache (Ctrl+Shift+Delete)
3. Check that variables are set for **all environments** (Production, Preview, Development)

### Issue: "Failed to fetch" errors

**Solution:**
1. Verify Heroku backend is running: https://limitless-caverns-03788-f84f5932a44c.herokuapp.com
2. Check CORS configuration (already fixed in backend)
3. Verify environment variable values are correct (no trailing slashes)

### Issue: Environment variables not working

**Solution:**
1. Variables must start with `NEXT_PUBLIC_` to be exposed to the browser
2. Must redeploy after adding/changing variables
3. Check Vercel deployment logs for any errors

---

## 📝 **Environment Variables Reference**

| Variable | Purpose | Default (if not set) |
|----------|---------|---------------------|
| `NEXT_PUBLIC_API_BASE` | Main API base URL for courses, AuraBot, etc. | `http://localhost:8000` |
| `NEXT_PUBLIC_ADMIN_API_BASE` | Admin API base URL | `http://localhost:8000` |
| `NEXT_PUBLIC_USER_API_BASE` | User API base URL (login, register, etc.) | `http://localhost:8000` |
| `NEXT_PUBLIC_APP_NAME` | Application name | `AuraLearn` |

---

## 🎊 **Summary**

**What you need to do:**
1. ✅ Set 4 environment variables in Vercel dashboard
2. ✅ Redeploy your application
3. ✅ Test login/signup

**What was fixed:**
- ✅ All hardcoded `localhost:8000` references removed
- ✅ Code now uses environment variables
- ✅ Works in both development and production

**After setup:**
- ✅ Your Vercel app will connect to Heroku backend
- ✅ Login and signup will work
- ✅ All API calls will succeed

---

## 🔗 **Quick Links**

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Heroku Backend**: https://limitless-caverns-03788-f84f5932a44c.herokuapp.com
- **Your Vercel App**: https://capstone-app-lyart.vercel.app

---

**🚀 Once you set these environment variables, your app will work perfectly!**

