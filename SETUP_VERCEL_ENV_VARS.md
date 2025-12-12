# 🚀 Step-by-Step: Set Vercel Environment Variables

## ⚡ Quick Fix (5 Minutes)

Follow these steps **EXACTLY** to fix your Vercel deployment:

---

## Step 1: Open Vercel Dashboard

1. Go to: **https://vercel.com/dashboard**
2. Sign in if needed
3. Find your project: **capstone-app** (or whatever you named it)
4. **Click on the project name**

---

## Step 2: Navigate to Environment Variables

1. Click on the **"Settings"** tab (top navigation bar)
2. In the left sidebar, scroll down and click **"Environment Variables"**

---

## Step 3: Add Environment Variables

You need to add **4 environment variables**. For each one:

1. Click the **"Add New"** button
2. Enter the **Key** (exactly as shown below)
3. Enter the **Value** (exactly as shown below)
4. Select all environments: **Production**, **Preview**, and **Development** (use the dropdown)
5. Click **"Save"**

### Variable 1:
- **Key**: `NEXT_PUBLIC_API_BASE`
- **Value**: `https://limitless-caverns-03788-f84f5932a44c.herokuapp.com`
- **Environments**: ✅ Production ✅ Preview ✅ Development

### Variable 2:
- **Key**: `NEXT_PUBLIC_ADMIN_API_BASE`
- **Value**: `https://limitless-caverns-03788-f84f5932a44c.herokuapp.com`
- **Environments**: ✅ Production ✅ Preview ✅ Development

### Variable 3:
- **Key**: `NEXT_PUBLIC_USER_API_BASE`
- **Value**: `https://limitless-caverns-03788-f84f5932a44c.herokuapp.com`
- **Environments**: ✅ Production ✅ Preview ✅ Development

### Variable 4:
- **Key**: `NEXT_PUBLIC_APP_NAME`
- **Value**: `AuraLearn`
- **Environments**: ✅ Production ✅ Preview ✅ Development

---

## Step 4: Verify Variables Are Added

After adding all 4 variables, you should see them listed:

```
✅ NEXT_PUBLIC_API_BASE
✅ NEXT_PUBLIC_ADMIN_API_BASE
✅ NEXT_PUBLIC_USER_API_BASE
✅ NEXT_PUBLIC_APP_NAME
```

---

## Step 5: Redeploy Your Application

1. Click on the **"Deployments"** tab (top navigation)
2. Find your latest deployment
3. Click the **"..."** (three dots) menu on the right
4. Click **"Redeploy"**
5. Select **"Use existing Build Cache"** (optional, but faster)
6. Click **"Redeploy"**
7. Wait for deployment to complete (~2-3 minutes)

---

## Step 6: Test Your Application

1. Visit your Vercel URL: **https://capstone-app-lyart.vercel.app**
2. Go to: **https://capstone-app-lyart.vercel.app/signin**
3. Try to **sign up** with a new account
4. Try to **sign in** with an existing account
5. Open browser console (F12) and check for errors

### ✅ Success Indicators:
- No `localhost:8000` errors in console
- Sign up form submits successfully
- Sign in works
- No `ERR_CONNECTION_REFUSED` errors

---

## 🎯 What This Fixes

### Before:
```
❌ Frontend tries to connect to localhost:8000
❌ Connection refused (localhost doesn't exist on Vercel)
❌ Sign up/Sign in fails
❌ All API calls fail
```

### After:
```
✅ Frontend connects to Heroku backend
✅ API calls succeed
✅ Sign up works
✅ Sign in works
✅ Everything works!
```

---

## 🚨 Troubleshooting

### Problem: Still seeing `localhost:8000` errors

**Solution:**
1. Make sure you **redeployed** after adding variables
2. Clear browser cache (Ctrl+Shift+Delete)
3. Check that variables are set for **all environments**

### Problem: Environment variables not showing up

**Solution:**
1. Make sure variable names start with `NEXT_PUBLIC_`
2. Make sure you clicked "Save" after adding each variable
3. Refresh the Vercel dashboard page

### Problem: Deployment failed

**Solution:**
1. Check Vercel deployment logs for errors
2. Make sure variable values don't have extra spaces
3. Make sure variable values don't have quotes

---

## ✅ Checklist

Before testing, make sure:

- [ ] All 4 environment variables are added
- [ ] Variables are enabled for Production, Preview, and Development
- [ ] Application has been redeployed
- [ ] Browser cache has been cleared
- [ ] You're testing on the Vercel URL (not localhost)

---

## 🎊 You're Done!

Once you complete these steps, your Vercel deployment will:
- ✅ Connect to your Heroku backend
- ✅ Allow users to sign up
- ✅ Allow users to sign in
- ✅ Work perfectly!

---

## 📞 Need Help?

If you're still having issues:
1. Check the deployment logs in Vercel
2. Check browser console for specific error messages
3. Verify Heroku backend is running: https://limitless-caverns-03788-f84f5932a44c.herokuapp.com

---

**🚀 Your app is almost ready! Just set those environment variables and redeploy!**

