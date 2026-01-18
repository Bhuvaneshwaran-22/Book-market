# 🚀 Netlify Deployment Guide for Bookmarket

## Prerequisites
- GitHub repository pushed (✅ Done: https://github.com/Bhuvaneshwaran-22/Book-market.git)
- Netlify account (sign up at https://netlify.com)
- Firebase project credentials

---

## Manual Deployment Steps

### 1. Build the Project Locally (Optional - Test First)
```bash
npm install
npm run build
```
This creates a `dist` folder with production-ready files.

---

### 2. Deploy to Netlify

#### Option A: Drag & Drop (Simplest)
1. Go to https://app.netlify.com/drop
2. Drag the `dist` folder to the upload area
3. Wait for deployment to complete
4. You'll get a URL like: `https://random-name-12345.netlify.app`

#### Option B: Connect GitHub Repo (Recommended)
1. Go to https://app.netlify.com
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **"Deploy with GitHub"**
4. Authorize Netlify to access your GitHub
5. Select repository: `Bhuvaneshwaran-22/Book-market`
6. Configure build settings:
   - **Branch to deploy:** `main`
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
7. Click **"Deploy site"**

---

### 3. Configure Environment Variables

⚠️ **CRITICAL:** Add Firebase credentials to Netlify

1. In Netlify dashboard, go to: **Site settings** → **Environment variables**
2. Click **"Add a variable"** and add each of these:

```
VITE_FIREBASE_API_KEY=<your-api-key>
VITE_FIREBASE_AUTH_DOMAIN=<your-project-id>.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=<your-project-id>
VITE_FIREBASE_STORAGE_BUCKET=<your-project-id>.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=<your-sender-id>
VITE_FIREBASE_APP_ID=<your-app-id>
```

3. Copy values from your `.env` file (or Firebase Console)
4. Click **"Save"**
5. **Trigger redeploy:** Go to **Deploys** tab → Click **"Trigger deploy"** → **"Deploy site"**

---

### 4. Configure Custom Domain (Optional)

1. In Netlify dashboard: **Domain settings** → **Add custom domain**
2. Enter your domain (e.g., `bookmarket.app`)
3. Follow DNS configuration instructions
4. Netlify auto-provisions SSL certificate (HTTPS)

---

### 5. Firebase Configuration for Production

⚠️ **Update Firebase Console:**

1. Go to Firebase Console: https://console.firebase.google.com
2. Select your project
3. Go to **Authentication** → **Settings** → **Authorized domains**
4. Add your Netlify domain:
   - `your-site-name.netlify.app`
   - Your custom domain (if using)
5. Click **"Add domain"**

Without this, authentication will fail on production!

---

## Verify Deployment

### 1. Check Build Logs
- In Netlify dashboard: **Deploys** tab
- Click on latest deploy to see build logs
- Look for errors (should see "Site is live")

### 2. Test Production Site
- ✅ Homepage loads with glassmorphic design
- ✅ Authentication works (Google sign-in)
- ✅ Books page shows search/filter UI
- ✅ Impact page displays achievement badges
- ✅ Mobile responsive (test on phone)
- ✅ QR code generation/scanning works

### 3. Check Browser Console
- Open DevTools (F12)
- Look for Firebase connection errors
- Verify no 404s or CORS issues

---

## Troubleshooting

### Issue: "Build failed"
**Solution:** Check Netlify build logs for error. Common issues:
- Missing `package-lock.json` (✅ committed)
- Wrong Node version (set to 18 in netlify.toml)
- Missing dependencies (run `npm install` locally first)

### Issue: "Page not found on refresh"
**Solution:** Ensure `_redirects` file exists in `public/` folder (✅ created)

### Issue: "Firebase authentication not working"
**Solution:** 
1. Check environment variables are set in Netlify
2. Verify authorized domains in Firebase Console
3. Redeploy after adding variables

### Issue: "Blank page / White screen"
**Solution:**
1. Check browser console for errors
2. Verify Firebase config values are correct
3. Test locally: `npm run build && npm run preview`

---

## Performance Optimization (Post-Deployment)

### Enable Netlify Features:
1. **Asset Optimization:** Site settings → Build & deploy → Enable image/CSS optimization
2. **Prerendering:** Add `netlify-plugin-prerender` for faster loads
3. **Analytics:** Enable Netlify Analytics for user insights

---

## Continuous Deployment (Already Set Up!)

Once connected to GitHub:
- Every push to `main` branch triggers auto-deploy
- Pull request previews available
- Rollback to previous deploys with 1 click

---

## Files Created for Deployment

✅ `netlify.toml` - Build configuration & redirects  
✅ `public/_redirects` - SPA routing fallback  
✅ `DEPLOYMENT.md` - This guide  

---

## Need Help?

- Netlify Docs: https://docs.netlify.com
- Netlify Support: https://answers.netlify.com
- Firebase Docs: https://firebase.google.com/docs

---

**Your site will be live at:** `https://[random-name].netlify.app`

You can customize the subdomain in: **Site settings** → **Site details** → **Change site name**

🎉 **Ready to deploy!**
